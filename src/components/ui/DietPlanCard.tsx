import { Card } from "./card";
import type { DietPlan } from "@/lib/gemini";
import { Clock, Droplet, AlertCircle, Apple, Coffee, UtensilsCrossed, Leaf, ChevronRight } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

interface DietPlanCardProps {
  dietPlan: DietPlan;
  isDetailed?: boolean;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

const mealItemVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1 }
};

export function DietPlanCard({ dietPlan, isDetailed = false }: DietPlanCardProps) {
  const mealIcons: Record<string, any> = {
    breakfast: Coffee,
    lunch: UtensilsCrossed,
    dinner: UtensilsCrossed,
    snack: Apple,
  };

  if (!isDetailed) {
    // Compact view for the card list
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#04724D]/10 p-2 rounded-full">
              <Leaf className="w-5 h-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Duration: {dietPlan.duration}
              </p>
              <p className="text-xs text-gray-500">
                {dietPlan.meals.length} meals per day
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Meals Preview */}
          <div className="bg-[#04724D]/5 rounded-lg p-3 hover:bg-[#04724D]/10 transition-colors duration-200">
            <h5 className="text-sm font-medium text-[#04724D] mb-2">Daily Meals</h5>
            <div className="flex gap-2">
              <AnimatePresence>
                {Object.entries(mealIcons).map(([type, Icon]) => (
                  dietPlan.meals.some(meal => meal.type.toLowerCase() === type) && (
                    <motion.div 
                      key={type}
                      variants={mealItemVariants}
                      className="bg-white p-1.5 rounded-full hover:scale-110 transition-transform duration-200"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-4 h-4 text-[#04724D]" />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Hydration Preview */}
          <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100/50 transition-colors duration-200">
            <h5 className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              Hydration
            </h5>
            <p className="text-xs text-blue-700 line-clamp-2">
              {dietPlan.hydration}
            </p>
          </div>
        </motion.div>

        {/* Restrictions Preview */}
        {dietPlan.restrictions.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-50 rounded-lg p-3 hover:bg-red-100/50 transition-colors duration-200"
          >
            <h5 className="text-sm font-medium text-red-600 flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              Restrictions
            </h5>
            <p className="text-xs text-red-700 line-clamp-1">
              {dietPlan.restrictions.length} food items to avoid
            </p>
          </motion.div>
        )}

        {/* Guidelines Preview */}
        <motion.div 
          variants={itemVariants}
          className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100/50 transition-colors duration-200"
        >
          <h5 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4" />
            Guidelines
          </h5>
          <p className="text-xs text-gray-600 line-clamp-1">
            {dietPlan.guidelines.length} dietary recommendations
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Detailed view for the dialog
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-2xl font-semibold text-[#04724D] flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          Personalized Diet Plan
        </h3>
        <p className="text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Duration: {dietPlan.duration}
        </p>
      </motion.div>

      {/* Meals */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h4 className="text-lg font-medium text-[#04724D] flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5" />
          Daily Meal Plan
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {dietPlan.meals.map((meal, index) => {
            const Icon = mealIcons[meal.type.toLowerCase()] || UtensilsCrossed;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg border border-gray-200 hover:border-[#04724D]/30 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#04724D]/10 p-2 rounded-full">
                      <Icon className="w-5 h-5 text-[#04724D]" />
                    </div>
                    <h5 className="font-medium text-[#04724D] capitalize">{meal.type}</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#04724D]" />
                      {meal.timing}
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {meal.suggestions.map((item, i) => (
                        <motion.li
                          key={i}
                          variants={itemVariants}
                          className="hover:text-[#04724D] transition-colors duration-200"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                    {isDetailed && (
                      <div className="pt-2 space-y-1 border-t border-dashed border-gray-200 mt-2">
                        <p className="text-sm text-gray-600">Portions: {meal.portions}</p>
                        <p className="text-sm text-gray-600">Notes: {meal.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Guidelines and Restrictions */}
      {isDetailed && (
        <>
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-medium text-[#04724D] flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Dietary Guidelines
            </h4>
            <div className="bg-[#04724D]/5 rounded-lg p-4 space-y-2">
              {dietPlan.guidelines.map((guideline, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-2"
                >
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#04724D]" />
                  </div>
                  <p className="text-gray-700">{guideline}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-medium text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Food Restrictions
            </h4>
            <div className="bg-red-50 rounded-lg p-4 space-y-2">
              {dietPlan.restrictions.map((restriction, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-2"
                >
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-red-700">{restriction}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Hydration */}
      <motion.div variants={itemVariants}>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-600">Daily Hydration</h4>
          </div>
          <p className="text-blue-700">{dietPlan.hydration}</p>
        </div>
      </motion.div>

      {/* Supplements */}
      {isDetailed && dietPlan.supplements.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-lg font-medium text-[#04724D] flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Recommended Supplements
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {dietPlan.supplements.map((supplement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#04724D]/30 transition-all duration-200 hover:shadow-lg"
              >
                <h5 className="font-medium text-[#04724D] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#04724D]" />
                  {supplement.name}
                </h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Dosage: {supplement.dosage}</p>
                  <p>Timing: {supplement.timing}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Special Instructions */}
      {isDetailed && (
        <motion.div variants={itemVariants}>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h4 className="font-medium text-yellow-600">Special Instructions</h4>
            </div>
            <p className="text-yellow-700">{dietPlan.specialInstructions}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 