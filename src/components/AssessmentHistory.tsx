import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { Assessment } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2, Brain, Heart, Activity, Smile, AlertTriangle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const MotionCard = motion(Card);

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

const iconBackgrounds = {
  heart: "from-red-100 to-red-200",
  brain: "from-blue-100 to-blue-200",
  mental: "from-green-100 to-green-200",
  depression: "from-yellow-100 to-yellow-200",
  vitals: "from-purple-100 to-purple-200"
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
        <Loader2 className="h-8 w-8 animate-spin text-[#04724D]" />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <MotionCard
            whileHover={{ scale: 1.02, y: -5 }}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground group-hover:text-[#04724D] transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#04724D] to-[#0891B2] bg-clip-text text-transparent">
                {totalAssessments}
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            whileHover={{ scale: 1.02, y: -5 }}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground group-hover:text-[#04724D] transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#04724D] to-[#0891B2] bg-clip-text text-transparent">
                {completedAssessments}
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            whileHover={{ scale: 1.02, y: -5 }}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Assessment</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground group-hover:text-[#04724D] transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium bg-gradient-to-r from-[#04724D] to-[#0891B2] bg-clip-text text-transparent">
                {latestAssessment ? format(new Date(latestAssessment.created_at), 'PPP') : 'No assessments yet'}
              </div>
            </CardContent>
          </MotionCard>
        </div>

        {/* Assessment List */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden"
        >
          <CardHeader>
            <CardTitle className="text-2xl">Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-4">
              <AnimatePresence>
                {assessments?.map((assessment, index) => {
                  const results = assessment.results as any;
                  const Icon = assessmentIcons[results?.assessment_type as keyof typeof assessmentIcons] || Activity;
                  const bgGradient = iconBackgrounds[results?.assessment_type as keyof typeof iconBackgrounds] || "from-gray-100 to-gray-200";
                  
                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/5 cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-xl bg-gradient-to-br shadow-lg",
                          bgGradient
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{assessment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed {format(new Date(assessment.completed_at || ''), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {results?.risk_level && (
                          <Badge className={cn(
                            riskLevelColors[results.risk_level as keyof typeof riskLevelColors],
                            "capitalize"
                          )}>
                            {results.risk_level}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group hover:bg-accent/10"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {assessments?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No assessments completed yet
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </MotionCard>
      </motion.div>

      {/* Assessment Details Dialog */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {selectedAssessment && (() => {
                const results = selectedAssessment.results as any;
                const Icon = assessmentIcons[results?.assessment_type as keyof typeof assessmentIcons] || Activity;
                const bgGradient = iconBackgrounds[results?.assessment_type as keyof typeof iconBackgrounds] || "from-gray-100 to-gray-200";
                
                return (
                  <>
                    <div className={cn(
                      "p-2 rounded-xl bg-gradient-to-br shadow-lg",
                      bgGradient
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span>{selectedAssessment.title}</span>
                  </>
                );
              })()}
            </DialogTitle>
          </DialogHeader>

          {selectedAssessment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <MotionCard whileHover={{ scale: 1.02 }}>
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
                </MotionCard>

                <MotionCard whileHover={{ scale: 1.02 }}>
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
                        <span className="font-medium capitalize">
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
                </MotionCard>
              </div>

              <MotionCard whileHover={{ scale: 1.02 }}>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.ul className="list-disc pl-4 space-y-2">
                    {(selectedAssessment.results as any).recommendations?.map((rec: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-muted-foreground"
                      >
                        {rec}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </MotionCard>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAssessment(null)}
                  className="hover:bg-accent/10"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 