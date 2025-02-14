import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Instant access to medical guidance",
  "Personalized health recommendations",
  "Secure and private consultations",
  "24/7 availability"
];

interface CallToActionProps {
  onGetStarted: () => void;
}

export default function CallToAction({ onGetStarted }: CallToActionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-ghost-white via-light-blue/10 to-ghost-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-paynes-gray mb-6">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-lg text-paynes-gray/80 mb-8">
                Join thousands of satisfied users who have already discovered the future of healthcare with our AI-powered platform.
              </p>
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-paynes-gray/80"
                  >
                    <CheckCircle className="h-5 w-5 text-dark-spring-green mr-3" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onGetStarted}
                  className="bg-dark-spring-green hover:bg-opacity-90 text-ghost-white px-8 py-6 text-lg rounded-full group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-dark-spring-green/20 to-light-blue/20 p-8">
                <div className="absolute inset-0 bg-gradient-radial opacity-10" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-dark-spring-green mb-4">24/7</div>
                    <div className="text-xl text-paynes-gray">Healthcare Access</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 