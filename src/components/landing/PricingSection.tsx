import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Heart, Shield, Stethoscope, Brain } from "lucide-react";

const healthcareTiers: PricingTier[] = [
    {
        name: "Basic Care",
        icon: <Heart className="w-6 h-6" />,
        price: 199,
        description: "Essential health monitoring and basic consultations",
        color: "dark-spring-green",
        features: [
            "Basic Health Assessment",
            "24/7 AI Chat Support",
            "Symptom Tracking",
            "Health Tips & Reminders",
        ],
        currency: "₹"
    },
    {
        name: "Premium Care",
        icon: <Stethoscope className="w-6 h-6" />,
        price: 499,
        description: "Advanced healthcare features for comprehensive care",
        color: "dark-spring-green",
        features: [
            "Priority AI Consultations",
            "Detailed Health Analytics",
            "Medication Reminders",
            "Family Health Tracking",
        ],
        popular: true,
        currency: "₹"
    },
    {
        name: "Professional",
        icon: <Brain className="w-6 h-6" />,
        price: 999,
        description: "Complete healthcare solution for optimal wellness",
        color: "dark-spring-green",
        features: [
            "Advanced AI Diagnostics",
            "Specialist Referrals",
            "Emergency Support",
            "Health History Analysis",
        ],
        currency: "₹"
    },
];

export default function PricingSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            <CreativePricing
                tag="Flexible Plans"
                title="Choose Your Healthcare Plan"
                description="Get personalized AI-powered healthcare that fits your needs"
                tiers={healthcareTiers}
            />
        </section>
    );
} 