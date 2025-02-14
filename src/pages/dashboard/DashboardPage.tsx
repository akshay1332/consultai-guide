
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleStartConsultation = () => {
    navigate("/consultation/new");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartConsultation}>
              Start New Consultation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {chatSessions?.length === 0 ? (
              <p className="text-muted-foreground">No consultations yet</p>
            ) : (
              <div className="space-y-4">
                {chatSessions?.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Session #{session.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/consultation/${session.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
