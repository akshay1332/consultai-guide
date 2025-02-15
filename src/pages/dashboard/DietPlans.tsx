import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getUserDietPlans, type StoredDietPlan } from "@/lib/diet-plans";
import { DietPlanCard } from "@/components/ui/DietPlanCard";
import { motion } from "framer-motion";

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#04724D]">My Diet Plans</h1>
        <Button
          className="bg-[#04724D] hover:bg-[#04724D]/90"
          onClick={() => window.location.href = "/dashboard/sessions"}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Consultation
        </Button>
      </div>

      {dietPlans.length === 0 ? (
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Diet Plans Yet</h2>
          <p className="text-gray-600 mb-4">Start a consultation to get your personalized diet plan.</p>
          <Button
            className="bg-[#04724D] hover:bg-[#04724D]/90"
            onClick={() => window.location.href = "/dashboard/sessions"}
          >
            Start Consultation
          </Button>
        </Card>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {dietPlans.map((plan) => (
            <motion.div key={plan.id} variants={item}>
              <Card className="overflow-hidden">
                <CardHeader className="bg-[#04724D]/5 border-b border-[#04724D]/10">
                  <CardTitle className="flex items-center gap-2 text-[#04724D]">
                    <FileText className="w-5 h-5" />
                    Diet Plan
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Created on: {new Date(plan.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <DietPlanCard dietPlan={plan.diet_data} isDetailed={true} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 