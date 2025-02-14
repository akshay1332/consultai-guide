import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, ClipboardCheck } from "lucide-react";

export default function DashboardHome() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get completed sessions with reports
      const { count: completedSessionsCount } = await supabase
        .from("chat_sessions")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .not("reports", "is", null);

      // Get total reports count
      const { count: reportsCount } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true });

      // Get total assessments count
      const { count: assessmentsCount } = await supabase
        .from("assessments")
        .select("*", { count: "exact", head: true });
      
      return {
        sessions: completedSessionsCount || 0,
        reports: reportsCount || 0,
        assessments: assessmentsCount || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assessments}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
