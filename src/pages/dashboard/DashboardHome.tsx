import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FileText, 
  ClipboardCheck, 
  Activity,
  Utensils,
  TrendingUp,
  Plus,
  ChevronRight,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useNavigate } from "react-router-dom";

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

const COLORS = ['#04724D', '#0891B2', '#7C3AED', '#EA580C'];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const { count: completedSessionsCount } = await supabase
          .from("chat_sessions")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        const { count: reportsCount } = await supabase
          .from("reports")
          .select("*", { count: "exact", head: true });

        const { count: assessmentsCount } = await supabase
          .from("assessments")
          .select("*", { count: "exact", head: true });

        const { count: dietPlansCount } = await supabase
          .from("diet_plans")
          .select("*", { count: "exact", head: true });

        // Get activity data for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: activityData } = await supabase
          .from("chat_sessions")
          .select("created_at, status")
          .gte("created_at", sevenDaysAgo.toISOString());

        // Generate sample data for the last 7 days if no data exists
        const sampleData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: format(date, 'MMM dd'),
            sessions: Math.floor(Math.random() * 10),
            completed: Math.floor(Math.random() * 8)
          };
        }).reverse();

        return {
          sessions: completedSessionsCount || 0,
          reports: reportsCount || 0,
          assessments: assessmentsCount || 0,
          dietPlans: dietPlansCount || 0,
          activityData: activityData?.length ? activityData : sampleData
        };
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#04724D]" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading dashboard data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Sessions', value: stats?.sessions || 0 },
    { name: 'Reports', value: stats?.reports || 0 },
    { name: 'Assessments', value: stats?.assessments || 0 },
    { name: 'Diet Plans', value: stats?.dietPlans || 0 }
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto space-y-8 pb-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#04724D]">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your healthcare activities and progress</p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/sessions')}
          className="bg-[#04724D] hover:bg-[#04724D]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Consultation
        </Button>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#04724D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#04724D]">{stats?.sessions}</div>
            <Progress value={75} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              15% increase from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-[#0891B2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0891B2]">{stats?.reports}</div>
            <Progress value={85} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              20% increase from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#7C3AED]">{stats?.assessments}</div>
            <Progress value={65} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              12% increase from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Diet Plans</CardTitle>
            <Utensils className="h-4 w-4 text-[#EA580C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EA580C]">{stats?.dietPlans}</div>
            <Progress value={90} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              25% increase from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Daily sessions and completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.activityData || []}>
                    <defs>
                      <linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#04724D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#04724D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0891B2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#04724D" 
                      fillOpacity={1} 
                      fill="url(#sessions)" 
                      name="Total Sessions"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#0891B2" 
                      fillOpacity={1} 
                      fill="url(#completed)" 
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
              <CardDescription>Overview of healthcare activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest healthcare activities</CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard/sessions')}>
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#04724D]/10 rounded-full">
                    <Activity className="h-4 w-4 text-[#04724D]" />
                  </div>
                  <div>
                    <p className="font-medium">New Assessment Completed</p>
                    <p className="text-sm text-gray-500">Mental Health Assessment</p>
                  </div>
                </div>
                <Badge variant="outline">2 hours ago</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#0891B2]/10 rounded-full">
                    <FileText className="h-4 w-4 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="font-medium">Medical Report Generated</p>
                    <p className="text-sm text-gray-500">Consultation #1234</p>
                  </div>
                </div>
                <Badge variant="outline">5 hours ago</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#EA580C]/10 rounded-full">
                    <Utensils className="h-4 w-4 text-[#EA580C]" />
                  </div>
                  <div>
                    <p className="font-medium">Diet Plan Created</p>
                    <p className="text-sm text-gray-500">Personalized Nutrition Plan</p>
                  </div>
                </div>
                <Badge variant="outline">1 day ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
