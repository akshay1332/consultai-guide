import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { ChatSession } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2, Plus, Calendar, Clock, ArrowRight, FileText, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ChatInterface from "@/components/chat/ChatInterface";
import { generateMedicalReport } from "@/lib/gemini";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getUserReports, downloadReport } from "@/lib/reports";
import type { StoredReport } from "@/lib/reports";
import { DietPlanCard } from "@/components/ui/DietPlanCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createDietPlan, getDietPlanByReportId, type StoredDietPlan } from "@/lib/diet-plans";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Sessions() {
  const { user } = useAuth();
  const { data: sessions, loading, error } = useRealtimeSubscription<ChatSession>(
    'chat_sessions',
    user?.id || ''
  );
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [recentReports, setRecentReports] = useState<StoredReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState<StoredReport | null>(null);
  const [dietPlan, setDietPlan] = useState<StoredDietPlan | null>(null);
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await getUserReports();
        setRecentReports(reports.slice(0, 3)); // Get only top 3 recent reports
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const recentSessions = sessions?.filter(s => s.status === 'completed').slice(0, 5);
  const upcomingSessions = sessions?.filter(s => s.status === 'scheduled');

  const startNewSession = async () => {
    setIsStarting(true);
    try {
      const { data: session, error: createError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user?.id,
          status: 'in_progress',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;
      setActiveSession(session.id);
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSessionComplete = async (sessionId: string, reportData: any) => {
    try {
      await supabase
        .from('chat_sessions')
        .update({
          status: 'completed',
          finished_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      await supabase.from('reports').insert({
        session_id: sessionId,
        report_data: reportData,
        generated_at: new Date().toISOString(),
      });

      setActiveSession(null);
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  };

  const handleViewReport = async (report: StoredReport) => {
    setSelectedReport(report);
    // Check if diet plan exists
    const existingPlan = await getDietPlanByReportId(report.id);
    setDietPlan(existingPlan);
  };

  const handleGenerateDietPlan = async () => {
    if (!selectedReport) return;
    
    setIsGeneratingDiet(true);
    try {
      const newDietPlan = await createDietPlan(selectedReport);
      if (newDietPlan) {
        setDietPlan(newDietPlan);
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setIsGeneratingDiet(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading sessions: {error.message}
      </div>
    );
  }

  if (activeSession) {
    return (
      <div className="p-8">
        <ChatInterface
          sessionId={activeSession}
          onSessionComplete={handleSessionComplete}
          onCloseSession={() => setActiveSession(null)}
        />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-[#F4F4F9] to-[#B8DBD9]/20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] bg-[#04724D] overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
          alt="Medical consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Virtual Medical Consultations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl mb-8 max-w-2xl"
          >
            Get professional medical guidance from the comfort of your home. Start a consultation now with our AI-powered medical assistant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={startNewSession}
              disabled={isStarting}
              size="lg"
              className="bg-white text-[#04724D] hover:bg-white/90 text-lg"
            >
              {isStarting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              Start New Consultation
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Sessions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
            {/* Recent Reports */}
          <motion.div variants={item}>
            <Card className="h-full bg-white/80 backdrop-blur-sm border-[#B8DBD9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#04724D]" />
                  Recent Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                  {isLoadingReports ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#04724D]" />
                    </div>
                  ) : recentReports.length === 0 ? (
                  <div className="text-center py-8">
                    <img
                      src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80"
                        alt="No reports"
                      className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                    />
                    <p className="text-muted-foreground">No recent consultations</p>
                  </div>
                ) : (
                    <div className="space-y-6">
                      {recentReports.map((report) => (
                        <motion.div
                          key={report.id}
                        variants={item}
                        className="p-4 rounded-lg bg-white shadow-sm border border-[#B8DBD9] hover:shadow-md transition-shadow"
                      >
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                          <div>
                                <h3 className="font-medium text-[#04724D]">
                                  Consultation Report
                                </h3>
                            <p className="text-sm text-muted-foreground">
                                  {new Date(report.generated_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Diagnosis: </span>
                                <span className="text-gray-600">
                                  {report.report_data?.diagnosis || 'No diagnosis available'}
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Medications: </span>
                                <span className="text-gray-600">
                                  {report.report_data?.medications?.length > 0
                                    ? report.report_data.medications.map(med => med.name).join(", ")
                                    : 'No medications prescribed'}
                                </span>
                              </div>
                              {report.report_data?.dietPlan?.meals?.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                  <h4 className="text-sm font-medium text-[#04724D] mb-2">Recommended Diet</h4>
                                  <div className="text-sm text-gray-600">
                                    {report.report_data.dietPlan.meals.slice(0, 2).map((meal, index) => (
                                      <div key={index} className="flex items-center gap-2 mb-1">
                                        <span className="font-medium capitalize">{meal.type}:</span>
                                        {meal.suggestions?.slice(0, 2).join(", ") || 'No suggestions available'}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="bg-[#04724D]/10 text-[#04724D]">
                                {report.report_data?.estimatedCondition || 'Condition not specified'}
                              </Badge>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-[#04724D] border-[#04724D] hover:bg-[#04724D]/10"
                                  onClick={() => downloadReport(report)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-[#04724D] hover:bg-[#04724D]/90"
                                  onClick={() => handleViewReport(report)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                        </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={item}>
            <Card className="h-full bg-white/80 backdrop-blur-sm border-[#B8DBD9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-[#04724D]" />
                  Scheduled Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions?.length === 0 ? (
                  <div className="text-center py-8">
                    <img
                      src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80"
                      alt="No upcoming sessions"
                      className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                    />
                    <p className="text-muted-foreground">No scheduled consultations</p>
                    <Button
                      variant="link"
                      onClick={startNewSession}
                      disabled={isStarting}
                      className="mt-4"
                    >
                      Schedule a consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {upcomingSessions?.map((session) => (
                      <motion.li
                        key={session.id}
                        variants={item}
                        className="p-4 rounded-lg bg-white shadow-sm border border-[#B8DBD9] hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#04724D]">
                              Scheduled Consultation
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(session.created_at), 'PPp')}
                            </p>
                          </div>
                          <Badge variant="secondary">Upcoming</Badge>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#04724D] flex items-center justify-between">
              <span>Medical Consultation Report</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedReport(null)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-8 py-4">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-4">Report Details</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Generated on: {new Date(selectedReport.generated_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Estimated Condition */}
              <div className="bg-white p-4 rounded-lg border border-[#B8DBD9]">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Estimated Condition</h3>
                <p className="text-gray-700">{selectedReport.report_data?.estimatedCondition || 'Not specified'}</p>
              </div>

              {/* Symptoms Analysis */}
              <div className="bg-white p-4 rounded-lg border border-[#B8DBD9]">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Symptoms Analysis</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedReport.report_data?.symptomsAnalysis || 'No symptoms analysis available'}
                </p>
              </div>

              {/* Diagnosis */}
              <div className="bg-white p-4 rounded-lg border border-[#B8DBD9]">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Medical Assessment</h3>
                <p className="text-gray-700">{selectedReport.report_data?.diagnosis || 'No diagnosis available'}</p>
              </div>

              {/* Treatment Plan */}
              <div className="bg-white p-4 rounded-lg border border-[#B8DBD9]">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Treatment Plan</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedReport.report_data?.treatment?.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  )) || <li className="text-gray-700">No treatment plan available</li>}
                </ul>
              </div>

              {/* Medications */}
              <div className="bg-white p-4 rounded-lg border border-[#B8DBD9]">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Prescribed Medications</h3>
                <div className="grid gap-4">
                  {selectedReport.report_data?.medications?.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#04724D] mb-2">{med.name}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-700"><span className="font-medium">Dosage:</span> {med.dosage}</p>
                        <p className="text-gray-700"><span className="font-medium">Duration:</span> {med.duration}</p>
                        <p className="text-gray-700 col-span-2"><span className="font-medium">Instructions:</span> {med.instructions}</p>
                      </div>
                    </div>
                  )) || <p className="text-gray-700">No medications prescribed</p>}
                </div>
              </div>

              {/* Diet Plan Section */}
              {dietPlan ? (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-[#04724D]">Personalized Diet Plan</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/diet-plans`}
                      className="text-[#04724D] border-[#04724D] hover:bg-[#04724D]/10"
                    >
                      View All Diet Plans
                    </Button>
                  </div>
                  <DietPlanCard dietPlan={dietPlan.diet_data} isDetailed={true} />
                </div>
              ) : (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-[#04724D]">Diet Plan</h3>
                    <Button
                      onClick={handleGenerateDietPlan}
                      disabled={isGeneratingDiet}
                      className="bg-[#04724D] hover:bg-[#04724D]/90"
                    >
                      {isGeneratingDiet ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Diet Plan...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Generate Diet Plan
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Generate a personalized diet plan based on your medical condition and requirements.
                  </p>
                </div>
              )}

              {/* Precautions */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg text-red-700 mb-2">⚠️ Important Precautions & Warning Signs</h3>
                <p className="text-red-700 whitespace-pre-line">
                  {selectedReport.report_data?.precautions || 'No specific precautions noted'}
                </p>
              </div>

              {/* Follow-up Instructions */}
              <div className="bg-[#04724D]/5 p-4 rounded-lg border border-[#04724D]/20">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Follow-up Instructions</h3>
                <p className="text-gray-700">{selectedReport.report_data?.followUp || 'No follow-up instructions provided'}</p>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
                <h3 className="font-semibold text-yellow-800 mb-2">⚕️ Medical Disclaimer</h3>
                <p className="text-yellow-700">
                  This is an AI-generated medical consultation report. The information provided is for general guidance only 
                  and should not be considered as professional medical advice. Please consult with a qualified healthcare 
                  provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => selectedReport && downloadReport(selectedReport)}
              className="border-[#04724D] text-[#04724D] hover:bg-[#04724D]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={() => setSelectedReport(null)}
              className="bg-[#04724D] hover:bg-[#04724D]/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 