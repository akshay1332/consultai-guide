import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import AuthOverlay from "@/components/auth/AuthOverlay";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/PricingSection";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Redirect to dashboard if user is already authenticated
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-ghost-white">
      <AuthOverlay isOpen={showAuth} onClose={() => setShowAuth(false)} />
      
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}
