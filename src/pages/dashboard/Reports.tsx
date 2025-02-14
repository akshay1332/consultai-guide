import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { Loader2, Download, FileText, Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { downloadReport } from "@/lib/reports";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    async function fetchReports() {
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
      } finally {
        setLoading(false);
      }
    }

    fetchReports();

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
        async () => {
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
        async () => {
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
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Medical Reports</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No reports generated yet</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card 
              key={report.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-[#04724D]">
                        Medical Report
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(report.generated_at), 'PP')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(new Date(report.generated_at), 'p')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(report);
                      }}
                      className="text-[#04724D] hover:text-[#04724D]/80 hover:bg-[#04724D]/10"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Session ID: {report.session_id.slice(0, 8)}...</p>
                    {report.report_data.diagnosis && (
                      <p className="line-clamp-2">
                        Diagnosis: {report.report_data.diagnosis}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      Status: {report.chat_sessions?.status || 'Completed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
            <div className="space-y-6 py-4">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
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
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-[#04724D] mb-2 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        {title}
      </h3>
      {isList ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {(Array.isArray(content) ? content : [content]).map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-700">{content}</p>
      )}
    </div>
  );
} 