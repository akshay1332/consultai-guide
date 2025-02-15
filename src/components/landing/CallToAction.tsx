import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Clock,
  Stethoscope,
  Lock,
  Activity,
  MessageSquare,
  Heart,
  Zap
} from "lucide-react";

const benefits = [
  {
    title: "24/7 Medical Guidance",
    description: "Access expert medical advice anytime, anywhere",
    icon: Clock,
    color: "from-dark-spring-green to-paynes-gray"
  },
  {
    title: "Secure Consultations",
    description: "End-to-end encrypted private sessions",
    icon: Lock,
    color: "from-paynes-gray to-light-blue"
  },
  {
    title: "Instant Health Insights",
    description: "AI-powered health recommendations",
    icon: Activity,
    color: "from-light-blue to-dark-spring-green"
  },
  {
    title: "Private & Secure",
    description: "Your data is protected with military-grade encryption",
    icon: Shield,
    color: "from-dark-spring-green to-paynes-gray"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

interface CallToActionProps {
  onGetStarted: () => void;
}

export default function CallToAction({ onGetStarted }: CallToActionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-ghost-white via-light-blue/10 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black relative overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-ghost-white/50 dark:bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-light-blue/20"
        >
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12 items-center">
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, -1, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-dark-spring-green/20 to-light-blue/20 rounded-full blur-2xl"
                />
                <h2 
                  className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-dark-spring-green via-paynes-gray to-dark-spring-green bg-clip-text text-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Transform Your Healthcare Experience
                </h2>
                <p 
                  className="text-lg text-paynes-gray/80 dark:text-light-blue/80 mb-8"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Join thousands of satisfied users who have already discovered the future of healthcare with our AI-powered platform.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mb-12"
                >
                  <Button
                    onClick={onGetStarted}
                    className="bg-dark-spring-green hover:bg-dark-spring-green/90 text-ghost-white px-8 py-6 text-lg rounded-full group shadow-lg shadow-dark-spring-green/20 hover:shadow-xl hover:shadow-dark-spring-green/30 transition-all duration-300"
                  >
                    <span className="relative">
                      Get Started Now
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-ghost-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      />
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </motion.div>

                <div className="flex items-center gap-4 text-paynes-gray/60 dark:text-light-blue/60">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">HIPAA Compliant & Secure</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-spring-green/5 to-light-blue/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                  <div className="relative p-6 backdrop-blur-sm rounded-2xl border border-light-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="mb-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <benefit.icon className="h-6 w-6 text-ghost-white" />
                      </motion.div>
                    </div>
                    <h3 
                      className="text-xl font-bold text-paynes-gray dark:text-light-blue mb-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {benefit.title}
                    </h3>
                    <p 
                      className="text-paynes-gray/70 dark:text-light-blue/70"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-12 bg-gradient-to-r from-dark-spring-green/5 via-paynes-gray/5 to-light-blue/5 border-t border-light-blue/10"
          >
            {[
              { value: "24/7", label: "Availability", icon: Clock },
              { value: "100%", label: "Secure", icon: Lock },
              { value: "10k+", label: "Users", icon: Heart },
              { value: "99.9%", label: "Uptime", icon: Zap }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block"
                >
                  <stat.icon className="h-6 w-6 text-dark-spring-green mb-2 mx-auto" />
                </motion.div>
                <div 
                  className="text-2xl md:text-3xl font-bold text-paynes-gray dark:text-light-blue"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm text-paynes-gray/70 dark:text-light-blue/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 