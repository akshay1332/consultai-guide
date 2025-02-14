
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Stethoscope,
      title: "AI-Powered Diagnosis",
      description: "Get instant medical consultations powered by advanced AI",
    },
    {
      icon: MapPin,
      title: "Locate Healthcare",
      description: "Find nearby hospitals, clinics, and pharmacies",
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description: "Receive comprehensive medical reports and recommendations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-medical-900 mb-6">
            Virtual Doctor
          </h1>
          <p className="text-lg md:text-xl text-medical-600 max-w-2xl mx-auto mb-8">
            Experience the future of healthcare with our AI-powered medical consultation platform
          </p>
          <Button
            onClick={() => navigate("/consultation")}
            className="bg-medical-600 hover:bg-medical-700 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Start Consultation
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6 bg-medical-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <feature.icon className="w-8 h-8 text-medical-600" />
              </div>
              <h3 className="text-xl font-semibold text-medical-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-medical-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-medical-500 text-sm">
            Please note: This is a medical assistance tool and should not replace professional medical advice.
            Always consult with a healthcare provider for serious medical conditions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
