import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileText, Calendar, Clock, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getUserDietPlans, type StoredDietPlan } from "@/lib/diet-plans";
import { DietPlanCard } from "@/components/ui/DietPlanCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from "date-fns";

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

export default function DietPlans() {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<StoredDietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<StoredDietPlan | null>(null);

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        const plans = await getUserDietPlans();
        setDietPlans(plans);
      } catch (error) {
        console.error("Error fetching diet plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#04724D]" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#04724D]">My Diet Plans</h1>
        <Button
          className="bg-[#04724D] hover:bg-[#04724D]/90 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.location.href = "/dashboard/sessions"}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Consultation
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {dietPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-8 text-center border-2 border-dashed">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <FileText className="w-12 h-12 text-[#04724D]/40 mx-auto" />
                <h2 className="text-xl font-semibold text-gray-700">No Diet Plans Yet</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start a consultation to get your personalized diet plan tailored to your needs and goals.
                </p>
                <Button
                  className="bg-[#04724D] hover:bg-[#04724D]/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = "/dashboard/sessions"}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Consultation
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {dietPlans.map((plan) => (
              <motion.div 
                key={plan.id} 
                variants={item}
                layoutId={plan.id}
              >
                <Card 
                  className="overflow-hidden border-2 hover:border-[#04724D]/50 transition-all duration-200 cursor-pointer group relative"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader className="bg-[#04724D]/5 border-b border-[#04724D]/10">
                    <CardTitle className="flex items-center gap-2 text-[#04724D]">
                      <FileText className="w-5 h-5" />
                      Diet Plan
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(plan.created_at), 'PPP')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {format(new Date(plan.created_at), 'p')}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 space-y-3">
                      <DietPlanCard dietPlan={plan.diet_data} isDetailed={false} />
                      <motion.div 
                        className="absolute inset-0 bg-[#04724D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        whileHover={{ opacity: 0.1 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diet Plan Details Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span className="text-[#04724D] text-xl">Detailed Diet Plan</span>
              <div className="flex gap-2">
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
          {selectedPlan && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedPlan.created_at), 'PPP')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {format(new Date(selectedPlan.created_at), 'p')}
                </div>
              </div>
              <DietPlanCard dietPlan={selectedPlan.diet_data} isDetailed={true} />
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 