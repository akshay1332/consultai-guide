import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProps {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isLast?: boolean;
}

export function Step({
  title,
  description,
  isCompleted = false,
  isActive = false,
  isLast = false,
}: StepProps) {
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2",
            {
              "border-primary bg-primary text-primary-foreground": isCompleted,
              "border-primary": isActive,
              "border-muted": !isActive && !isCompleted,
            }
          )}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="text-sm font-medium">
              {isActive ? "●" : "○"}
            </span>
          )}
        </div>
        {!isLast && (
          <div
            className={cn("w-px grow bg-border", {
              "bg-primary": isCompleted,
            })}
          />
        )}
      </div>
      <div className="ml-4 pb-8">
        <p
          className={cn("font-medium", {
            "text-primary": isActive || isCompleted,
            "text-muted-foreground": !isActive && !isCompleted,
          })}
        >
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface StepperProps {
  steps: {
    title: string;
    description?: string;
  }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <Step
          key={step.title}
          title={step.title}
          description={step.description}
          isCompleted={index < currentStep}
          isActive={index === currentStep}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
} 