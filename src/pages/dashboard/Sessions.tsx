import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { ChatSession } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2, Plus, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ChatInterface from "@/components/chat/ChatInterface";
import { generateMedicalReport } from "@/lib/gemini";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
          {/* Recent Sessions */}
          <motion.div variants={item}>
            <Card className="h-full bg-white/80 backdrop-blur-sm border-[#B8DBD9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-[#04724D]" />
                  Recent Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions?.length === 0 ? (
                  <div className="text-center py-8">
                    <img
                      src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80"
                      alt="No sessions"
                      className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                    />
                    <p className="text-muted-foreground">No recent consultations</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {recentSessions?.map((session) => (
                      <motion.li
                        key={session.id}
                        variants={item}
                        className="p-4 rounded-lg bg-white shadow-sm border border-[#B8DBD9] hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#04724D]">
                              Consultation #{session.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(session.created_at), 'PPp')}
                            </p>
                          </div>
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </Badge>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
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
  );
} 