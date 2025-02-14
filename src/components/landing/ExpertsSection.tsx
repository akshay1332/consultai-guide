import React from "react";
import { AnimatedExperts } from "@/components/ui/AnimatedExperts";
import { motion } from "framer-motion";

export default function ExpertsSection() {
  const experts = [
    {
      bio: "Leading expert in AI implementation strategies with a focus on enterprise-scale solutions. Pioneered multiple successful AI transformations for Fortune 500 companies.",
      name: "Dr. Sarah Chen",
      specialization: "AI Strategy Director",
      experience: "15+ years in Enterprise AI Solutions",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      bio: "Specialized in developing ethical AI frameworks and ensuring responsible AI implementation across various industries. Published author on AI ethics and governance.",
      name: "Dr. Michael Rodriguez",
      specialization: "AI Ethics Specialist",
      experience: "12+ years in AI Governance",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      bio: "Expert in machine learning optimization and AI performance tuning. Helped numerous organizations achieve breakthrough results with custom AI solutions.",
      name: "Dr. Emily Watson",
      specialization: "ML Optimization Lead",
      experience: "10+ years in Machine Learning",
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      bio: "Specializes in integrating AI solutions with existing business processes. Expert in minimizing disruption while maximizing AI adoption and impact.",
      name: "Dr. James Kim",
      specialization: "AI Integration Specialist",
      experience: "14+ years in Business Process AI",
      src: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      bio: "Pioneer in developing AI-driven decision support systems. Expert in creating scalable and reliable AI solutions for critical business operations.",
      name: "Dr. Lisa Thompson",
      specialization: "AI Systems Architect",
      experience: "13+ years in AI Architecture",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-ghost-white via-light-blue/5 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black">
      <div className="max-w-7xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-dark-spring-green via-paynes-gray to-dark-spring-green bg-clip-text text-transparent mb-4">
            Our AI Experts
          </h2>
          <p className="text-paynes-gray/90 dark:text-light-blue/90 text-lg md:text-xl max-w-2xl mx-auto px-4">
            Meet our team of world-class AI specialists dedicated to transforming your business through expert consultation and implementation.
          </p>
        </motion.div>
        <AnimatedExperts experts={experts} />
      </div>
    </div>
  );
} 