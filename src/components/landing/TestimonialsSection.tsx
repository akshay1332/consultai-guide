import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    content: "The virtual doctor platform has been a game-changer for me. I got immediate medical advice when I needed it most, saving me unnecessary trips to the ER.",
    rating: 5
  },
  {
    name: "Dr. Michael Chen",
    role: "Healthcare Professional",
    content: "As a medical professional, I'm impressed by the accuracy and comprehensiveness of the AI diagnostics. It's a valuable tool for initial patient assessment.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Regular User",
    content: "The 24/7 availability and quick responses have made managing my chronic condition so much easier. The personalized care approach really makes a difference.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-light-blue/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-paynes-gray mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-paynes-gray/80 max-w-2xl mx-auto">
            Real experiences from people who have transformed their healthcare journey with our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-dark-spring-green fill-current"
                  />
                ))}
              </div>
              <p className="text-paynes-gray/80 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-dark-spring-green to-paynes-gray flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-paynes-gray">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-paynes-gray/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 