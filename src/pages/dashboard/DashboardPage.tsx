import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from "date-fns";
import { 
  Activity, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users, 
  LogOut,
  Plus,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: chatSessions } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select(`
          *,
          messages:messages(count),
          reports:reports(*)
        `)
        .eq("user_id", session?.user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [sessionsRes, reportsRes, assessmentsRes] = await Promise.all([
        supabase.from("chat_sessions").select("*", { count: "exact", head: true }),
        supabase.from("reports").select("*", { count: "exact", head: true }),
        supabase.from("assessments").select("*", { count: "exact", head: true }),
      ]);
      
      return {
        sessions: sessionsRes.count || 0,
        reports: reportsRes.count || 0,
        assessments: assessmentsRes.count || 0,
      };
    },
  });

  const totalSessions = chatSessions?.length || 0;
  const completedSessions = chatSessions?.filter(s => s.status === 'completed').length || 0;
  const totalMessages = chatSessions?.reduce((acc, session) => acc + (session.messages?.count || 0), 0) || 0;
  const totalReports = chatSessions?.reduce((acc, session) => acc + (session.reports?.length || 0), 0) || 0;

  const sessionsOverTime = chatSessions?.reduce((acc: any[], session) => {
    const date = format(new Date(session.created_at), 'MMM d');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.sessions += 1;
      existing.messages += session.messages?.count || 0;
    } else {
      acc.push({
        date,
        sessions: 1,
        messages: session.messages?.count || 0
      });
    }
    return acc;
  }, []) || [];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleStartConsultation = () => {
    navigate("/consultation/new");
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-[#F4F4F9] to-[#B8DBD9]/20 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={item} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#04724D] mb-2">Welcome back, {session?.user?.email?.split('@')[0]}</h1>
            <p className="text-[#586F7C]">Here's what's happening with your consultations</p>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="hover:bg-red-500/10 hover:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                  +{Math.round((completedSessions/totalSessions) * 100)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <Progress value={(completedSessions/totalSessions) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  Active
                </Badge>
              </div>
              <p className="text-2xl font-bold">{totalMessages}</p>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <Progress value={75} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                  Generated
                </Badge>
              </div>
              <p className="text-2xl font-bold">{totalReports}</p>
              <p className="text-sm text-muted-foreground">Medical Reports</p>
              <Progress value={90} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                  Trending
                </Badge>
              </div>
              <p className="text-2xl font-bold">{completedSessions}</p>
              <p className="text-sm text-muted-foreground">Completed Sessions</p>
              <Progress value={60} className="mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Session and message activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sessionsOverTime}>
                      <defs>
                        <linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#04724D" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#04724D" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="messages" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#586F7C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#586F7C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sessions" stroke="#04724D" fillOpacity={1} fill="url(#sessions)" />
                      <Area type="monotone" dataKey="messages" stroke="#586F7C" fillOpacity={1} fill="url(#messages)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {chatSessions?.slice(0, 5).map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/50 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/consultation/${session.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          session.status === 'completed' ? 'bg-green-500/10' : 'bg-orange-500/10'
                        }`}>
                          {session.status === 'completed' ? (
                            <Clock className="h-4 w-4 text-green-500" />
                          ) : (
                            <Calendar className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Session #{session.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(session.created_at), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start a new consultation or view your reports</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={handleStartConsultation} className="bg-[#04724D] hover:bg-[#04724D]/90">
                <Plus className="mr-2 h-4 w-4" />
                Start New Consultation
              </Button>
              <Button variant="outline" onClick={() => navigate("/reports")}>
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
