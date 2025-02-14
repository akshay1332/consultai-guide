import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { Assessment } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2, Brain, Heart, Activity, Smile, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const assessmentIcons = {
  heart: Heart,
  brain: Brain,
  mental: Smile,
  depression: AlertTriangle,
  vitals: Activity
};

const riskLevelColors = {
  low: "bg-green-500",
  moderate: "bg-yellow-500",
  high: "bg-red-500"
};

export function AssessmentHistory() {
  const { user } = useAuth();
  const { data: assessments, loading, error } = useRealtimeSubscription<Assessment>(
    'assessments',
    user?.id || ''
  );
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

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
        Error loading assessments: {error.message}
      </div>
    );
  }

  const totalAssessments = assessments?.length || 0;
  const completedAssessments = assessments?.filter(a => a.status === 'completed').length || 0;
  const latestAssessment = assessments?.[0];

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssessments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssessments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {latestAssessment ? format(new Date(latestAssessment.created_at), 'PPP') : 'No assessments yet'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment List */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments?.map((assessment) => {
                const results = assessment.results as any;
                const Icon = assessmentIcons[results?.assessment_type as keyof typeof assessmentIcons] || Activity;
                
                return (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed {format(new Date(assessment.completed_at || ''), 'PPp')}
                        </p>
                      </div>
                    </div>
                    {results?.risk_level && (
                      <Badge className={cn(riskLevelColors[results.risk_level as keyof typeof riskLevelColors])}>
                        {results.risk_level.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                );
              })}
              
              {assessments?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No assessments completed yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Details Dialog */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAssessment && (
                <>
                  {(() => {
                    const results = selectedAssessment.results as any;
                    const Icon = assessmentIcons[results?.assessment_type as keyof typeof assessmentIcons] || Activity;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  <span>{selectedAssessment.title}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Overall Status</h4>
                        <p className="mt-1">{(selectedAssessment.results as any).summary}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Risk Level</h4>
                        <Badge 
                          className={cn(
                            "mt-1",
                            riskLevelColors[(selectedAssessment.results as any).risk_level]
                          )}
                        >
                          {((selectedAssessment.results as any).risk_level || '').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {format(new Date(selectedAssessment.completed_at || ''), 'PPP')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">
                          {(selectedAssessment.results as any).assessment_type}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Follow-up Required</span>
                        <span className="font-medium">
                          {(selectedAssessment.results as any).follow_up_required ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {(selectedAssessment.results as any).recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedAssessment(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 