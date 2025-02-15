
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Loader2, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Assessment } from "@/types/database";

export default function Assessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError(err instanceof Error ? err.message : 'Error fetching assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user?.id]);

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
        Error loading assessments: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold">Health Assessments</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No assessments yet</p>
            </CardContent>
          </Card>
        ) : (
          assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{assessment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(assessment.created_at), 'PP')}
                    </p>
                  </div>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Status: {assessment.status}
                  </p>
                  {assessment.description && (
                    <p className="text-sm">{assessment.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
