import { Card } from "./card";
import type { DietPlan } from "@/lib/gemini";
import { Clock, Droplet, AlertCircle, Apple, Coffee, UtensilsCrossed } from "lucide-react";

interface DietPlanCardProps {
  dietPlan: DietPlan;
  isDetailed?: boolean;
}

export function DietPlanCard({ dietPlan, isDetailed = false }: DietPlanCardProps) {
  const mealIcons: Record<string, any> = {
    breakfast: Coffee,
    lunch: UtensilsCrossed,
    dinner: UtensilsCrossed,
    snack: Apple,
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[#04724D]">Personalized Diet Plan</h3>
          <p className="text-gray-600">Duration: {dietPlan.duration}</p>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-[#04724D]">Daily Meal Plan</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {dietPlan.meals.map((meal, index) => {
              const Icon = mealIcons[meal.type.toLowerCase()] || UtensilsCrossed;
              return (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-[#04724D]" />
                    <h5 className="font-medium text-[#04724D] capitalize">{meal.type}</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><Clock className="w-4 h-4 inline mr-1" /> {meal.timing}</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {meal.suggestions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {isDetailed && (
                      <>
                        <p className="text-sm text-gray-600">Portions: {meal.portions}</p>
                        <p className="text-sm text-gray-600">Notes: {meal.notes}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guidelines and Restrictions */}
        {isDetailed && (
          <>
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-[#04724D]">Dietary Guidelines</h4>
              <ul className="list-disc list-inside space-y-1">
                {dietPlan.guidelines.map((guideline, index) => (
                  <li key={index} className="text-gray-700">{guideline}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-red-600">Food Restrictions</h4>
              <ul className="list-disc list-inside space-y-1">
                {dietPlan.restrictions.map((restriction, index) => (
                  <li key={index} className="text-red-600">{restriction}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Hydration */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-600">Hydration</h4>
          </div>
          <p className="text-blue-700">{dietPlan.hydration}</p>
        </div>

        {/* Supplements */}
        {isDetailed && dietPlan.supplements.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-[#04724D]">Recommended Supplements</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {dietPlan.supplements.map((supplement, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-[#04724D] mb-2">{supplement.name}</h5>
                  <p className="text-sm text-gray-600">Dosage: {supplement.dosage}</p>
                  <p className="text-sm text-gray-600">Timing: {supplement.timing}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {isDetailed && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-600">Special Instructions</h4>
            </div>
            <p className="text-yellow-700">{dietPlan.specialInstructions}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 