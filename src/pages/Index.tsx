
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Shield, 
  Clock, 
  ArrowRight,
  MessageSquare 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if user is already authenticated
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Virtual Doctor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of healthcare with our AI-powered virtual consultations.
            Get instant medical guidance from the comfort of your home.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="group"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 Consultations</h3>
                <p className="text-gray-600">
                  Get medical advice anytime, anywhere with our AI-powered system
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your health information is protected with enterprise-grade security
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert System</h3>
                <p className="text-gray-600">
                  Powered by advanced AI to provide accurate medical guidance
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of users who trust our virtual doctor for their health concerns.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Start Your Free Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
