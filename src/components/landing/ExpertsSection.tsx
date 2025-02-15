import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

export default function ExpertsSection() {
  const experts = [
    {
      quote: "Leading expert in AI implementation strategies with a focus on enterprise-scale solutions. Pioneered multiple successful AI transformations for Fortune 500 companies, bringing innovative solutions to complex business challenges.",
      name: "Dr. Sarah Chen",
      designation: "AI Strategy Director • 15+ years in Enterprise AI Solutions",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      quote: "Specialized in developing ethical AI frameworks and ensuring responsible AI implementation across various industries. Published author on AI ethics and governance, helping organizations navigate the complex landscape of AI adoption.",
      name: "Dr. Michael Rodriguez",
      designation: "AI Ethics Specialist • 12+ years in AI Governance",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      quote: "Expert in machine learning optimization and AI performance tuning. Helped numerous organizations achieve breakthrough results with custom AI solutions, focusing on scalability and efficiency.",
      name: "Dr. Emily Watson",
      designation: "ML Optimization Lead • 10+ years in Machine Learning",
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      quote: "Specializes in integrating AI solutions with existing business processes. Expert in minimizing disruption while maximizing AI adoption and impact, ensuring smooth transitions for organizations.",
      name: "Dr. James Kim",
      designation: "AI Integration Specialist • 14+ years in Business Process AI",
      src: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      quote: "Pioneer in developing AI-driven decision support systems. Expert in creating scalable and reliable AI solutions for critical business operations, with a focus on real-world impact.",
      name: "Dr. Lisa Thompson",
      designation: "AI Systems Architect • 13+ years in AI Architecture",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-ghost-white via-light-blue/5 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black relative overflow-hidden">
      {/* Decorative Elements */}
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

      <div className="max-w-7xl mx-auto pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 px-4"
        >
          <h2 
            className="text-3xl md:text-6xl font-extrabold bg-gradient-to-r from-dark-spring-green via-paynes-gray to-dark-spring-green bg-clip-text text-transparent mb-6"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Our AI Experts
          </h2>
          <p 
            className="text-paynes-gray/90 dark:text-light-blue/90 text-lg md:text-xl max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Meet our team of world-class AI specialists dedicated to transforming your business through expert consultation and implementation.
          </p>
        </motion.div>
        <AnimatedTestimonials 
          testimonials={experts} 
          autoplay={true}
          className="bg-ghost-white/30 dark:bg-black/30 backdrop-blur-md rounded-3xl shadow-xl"
        />
      </div>
    </div>
  );
} 