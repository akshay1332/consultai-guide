import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { Loader2, Download, FileText, Calendar, Clock, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { downloadReport } from "@/lib/reports";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ChatSession {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
}

interface ExtendedReport extends Report {
  chat_sessions: ChatSession;
}

export default function Reports() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ExtendedReport | null>(null);
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<ExtendedReport | null>(null);

  const fetchReports = async () => {
    try {
      if (!user?.id) return;

      // First, get the user's chat sessions
      const { data: chatSessions, error: chatError } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          user_id,
          status,
          created_at
        `)
        .eq('user_id', user.id);

      if (chatError) throw chatError;

      if (!chatSessions || chatSessions.length === 0) {
        setReports([]);
        return;
      }

      // Then get reports for those sessions
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(`
          id,
          session_id,
          report_data,
          generated_at
        `)
        .in('session_id', chatSessions.map(session => session.id))
        .order('generated_at', { ascending: false });

      if (reportError) throw reportError;

      const formattedReports: ExtendedReport[] = (reportData || []).map(report => ({
        ...report,
        chat_sessions: chatSessions.find(session => session.id === report.session_id) || {
          id: report.session_id,
          user_id: user.id,
          status: 'completed',
          created_at: report.generated_at
        }
      }));

      setReports(formattedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Error fetching reports');
    }
  };

  useEffect(() => {
    fetchReports();
    setLoading(false);

    // Set up real-time subscription for both tables
    const reportsSubscription = supabase
      .channel('reports_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    const sessionsSubscription = supabase
      .channel('sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      reportsSubscription.unsubscribe();
      sessionsSubscription.unsubscribe();
    };
  }, [user?.id]);

  const handleDownload = (report: ExtendedReport) => {
    downloadReport({
      id: report.id,
      session_id: report.session_id,
      report_data: report.report_data,
      generated_at: report.generated_at
    });
  };

  const handleDelete = async (report: ExtendedReport) => {
    try {
      setLoading(true);
      
      // First, delete the report from the reports table
      const { data: deletedReport, error: reportDeleteError } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id)
        .select()
        .single();

      if (reportDeleteError) {
        console.error('Error deleting report:', reportDeleteError);
        if (reportDeleteError.code === 'PGRST116') {
          toast.error('Permission denied: You can only delete your own reports');
          return;
        }
        throw new Error(`Failed to delete report: ${reportDeleteError.message}`);
      }

      if (!deletedReport) {
        throw new Error('Report not found or already deleted');
      }

      // Check if this was the last report for this session
      const { data: remainingReports, error: checkError } = await supabase
        .from('reports')
        .select('id')
        .eq('session_id', report.session_id);

      if (checkError) {
        console.error('Error checking remaining reports:', checkError);
        throw new Error(`Failed to check remaining reports: ${checkError.message}`);
      }

      // If this was the last report for this session, delete the chat session
      if (!remainingReports || remainingReports.length === 0) {
        const { error: sessionDeleteError } = await supabase
          .from('chat_sessions')
          .delete()
          .match({ 
            id: report.session_id,
            user_id: user?.id
          });

        if (sessionDeleteError) {
          console.error('Error deleting chat session:', sessionDeleteError);
          throw new Error(`Failed to delete chat session: ${sessionDeleteError.message}`);
        }
      }

      // Update local state only after successful database operations
      setReports(prev => prev.filter(r => r.id !== report.id));
      toast.success('Report deleted successfully');
      setReportToDelete(null);

      // Refresh the reports list to ensure sync with database
      await fetchReports();

    } catch (err) {
      console.error('Delete operation failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#04724D]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading reports: {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-8"
    >
      <h2 className="text-3xl font-bold tracking-tight text-[#04724D]">Medical Reports</h2>
      <AnimatePresence mode="popLayout">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">No reports generated yet</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            reports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="relative overflow-hidden border-2 hover:border-[#04724D]/50 transition-all duration-200"
                >
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(report);
                      }}
                      className="text-[#04724D] hover:text-[#04724D]/80 hover:bg-[#04724D]/10 rounded-full"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportToDelete(report);
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardContent 
                    className="pt-12 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <motion.div 
                      className="space-y-3"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <h4 className="font-semibold text-[#04724D] text-lg">
                          Medical Report
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(report.generated_at), 'PP')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(report.generated_at), 'p')}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">Session ID: {report.session_id.slice(0, 8)}...</p>
                        {report.report_data.diagnosis && (
                          <p className="line-clamp-2 mt-1">
                            Diagnosis: {report.report_data.diagnosis}
                          </p>
                        )}
                        <p className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-[#04724D]/10 text-[#04724D]">
                          {report.chat_sessions?.status || 'Completed'}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Report</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Are you sure you want to delete this report? This action cannot be undone.</p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete the report and its associated data from your records.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setReportToDelete(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => reportToDelete && handleDelete(reportToDelete)}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Existing Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Medical Report Details</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => selectedReport && handleDownload(selectedReport)}
                  className="text-[#04724D] hover:text-[#04724D]/80 hover:bg-[#04724D]/10"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 py-4"
            >
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedReport.generated_at), 'PPp')}
                </div>
                <div>Session ID: {selectedReport.session_id}</div>
              </div>
              
              <div className="space-y-4">
                <ReportSection
                  title="Diagnosis"
                  content={selectedReport.report_data.diagnosis}
                />
                
                <ReportSection
                  title="Treatment Plan"
                  content={selectedReport.report_data.treatment}
                  isList
                />

                <ReportSection
                  title="Medications"
                  content={selectedReport.report_data.medications.map(med => (
                    `${med.name} - ${med.dosage} (${med.duration})\n${med.instructions}`
                  ))}
                  isList
                />

                <ReportSection
                  title="Recommendations"
                  content={selectedReport.report_data.recommendations}
                  isList
                />

                <ReportSection
                  title="Follow-up Plan"
                  content={selectedReport.report_data.followUp}
                />
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function ReportSection({ 
  title, 
  content, 
  isList = false 
}: { 
  title: string; 
  content: string | string[]; 
  isList?: boolean;
}) {
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
    >
      <h3 className="font-semibold text-[#04724D] mb-2 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        {title}
      </h3>
      {isList ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {(Array.isArray(content) ? content : [content]).map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-gray-700"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-700">{content}</p>
      )}
    </motion.div>
  );
} 