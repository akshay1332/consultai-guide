import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Stethoscope, 
  Shield, 
  Clock, 
  Brain,
  Heart,
  Activity,
  Sparkles,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Diagnostics",
    description: "Advanced artificial intelligence system trained on extensive medical data to provide accurate initial assessments.",
    color: "from-dark-spring-green to-paynes-gray",
    highlight: "99.9% Accuracy"
  },
  {
    icon: Shield,
    title: "Secure & Confidential",
    description: "Your health data is protected with military-grade encryption and strict privacy protocols.",
    color: "from-paynes-gray to-light-blue",
    highlight: "HIPAA Compliant"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access medical guidance anytime, anywhere. No waiting rooms, no appointments needed.",
    color: "from-light-blue to-dark-spring-green",
    highlight: "Always Online"
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Receive tailored medical advice based on your unique health profile and history.",
    color: "from-dark-spring-green to-light-blue",
    highlight: "Custom Plans"
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Continuous health tracking and instant alerts for critical conditions.",
    color: "from-paynes-gray to-dark-spring-green",
    highlight: "Live Updates"
  },
  {
    icon: Stethoscope,
    title: "Expert System",
    description: "Built on the latest medical research and guidelines from healthcare professionals.",
    color: "from-light-blue to-paynes-gray",
    highlight: "Medical Grade"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

export default function FeaturesSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="py-24 bg-gradient-to-b from-ghost-white via-light-blue/5 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(4, 114, 77, 0.15) 0%, transparent 70%)",
            transform: "rotate(-15deg)"
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.2 }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(88, 111, 124, 0.15) 0%, transparent 70%)",
            transform: "rotate(15deg)"
          }}
        />
      </div>

      <motion.div 
        style={{ y }}
        className="container mx-auto px-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-spring-green to-paynes-gray opacity-20 blur-xl rounded-full" />
              <Sparkles className="w-12 h-12 text-dark-spring-green relative z-10" />
            </div>
          </motion.div>
          <h2 
            className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-dark-spring-green via-paynes-gray to-dark-spring-green bg-clip-text text-transparent"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Comprehensive Healthcare Features
          </h2>
          <p 
            className="text-xl text-paynes-gray/80 dark:text-light-blue/80 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
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
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-dark-spring-green/5 to-light-blue/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative p-8 backdrop-blur-sm rounded-2xl border border-light-blue/10 bg-ghost-white/50 dark:bg-black/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="mb-6 relative">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10`}
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <Icon className="h-8 w-8 text-ghost-white" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute -right-2 -top-2 bg-dark-spring-green/10 dark:bg-dark-spring-green/20 px-3 py-1 rounded-full text-xs font-semibold text-dark-spring-green transform rotate-3"
                    >
                      {feature.highlight}
                    </motion.div>
                  </div>
                  <h3 
                    className="text-2xl font-bold text-paynes-gray dark:text-light-blue mb-4 group-hover:text-dark-spring-green transition-colors duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-paynes-gray/70 dark:text-light-blue/70"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {feature.description}
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-dark-spring-green to-paynes-gray rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-4 rounded-full bg-gradient-to-br from-dark-spring-green/10 to-light-blue/10"
          >
            <Zap className="w-8 h-8 text-dark-spring-green" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
} 