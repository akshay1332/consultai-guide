import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Shield, 
  Clock, 
  Brain,
  Heart,
  Activity
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Diagnostics",
    description: "Advanced artificial intelligence system trained on extensive medical data to provide accurate initial assessments.",
    color: "dark-spring-green"
  },
  {
    icon: Shield,
    title: "Secure & Confidential",
    description: "Your health data is protected with military-grade encryption and strict privacy protocols.",
    color: "paynes-gray"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access medical guidance anytime, anywhere. No waiting rooms, no appointments needed.",
    color: "dark-spring-green"
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Receive tailored medical advice based on your unique health profile and history.",
    color: "paynes-gray"
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Continuous health tracking and instant alerts for critical conditions.",
    color: "dark-spring-green"
  },
  {
    icon: Stethoscope,
    title: "Expert System",
    description: "Built on the latest medical research and guidelines from healthcare professionals.",
    color: "paynes-gray"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-ghost-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-paynes-gray mb-6">
            Comprehensive Healthcare Features
          </h2>
          <p className="text-xl text-paynes-gray/80 max-w-2xl mx-auto">
            Discover how our virtual doctor platform revolutionizes your healthcare experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`bg-${feature.color} bg-opacity-10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center`}>
                  <Icon className={`h-8 w-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-paynes-gray mb-4">
                  {feature.title}
                </h3>
                <p className="text-paynes-gray/70">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 