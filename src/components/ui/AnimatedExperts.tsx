"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

type Expert = {
  bio: string;
  name: string;
  specialization: string;
  experience: string;
  src: string;
};

export const AnimatedExperts = ({
  experts,
  autoplay = true,
  className,
}: {
  experts: Expert[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % experts.length);
  }, [experts.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + experts.length) % experts.length);
  }, [experts.length]);

  useEffect(() => {
    if (autoplay && !isHovered) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext, isHovered]);

  return (
    <div 
      className={`max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-20 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-96 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={experts[active].src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  y: [0, -20, 0],
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <img
                  src={experts[active].src}
                  alt={experts[active].name}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full rounded-3xl object-cover object-center shadow-xl will-change-transform"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-paynes-gray dark:text-light-blue">
              {experts[active].name}
            </h3>
            <p className="text-sm text-dark-spring-green font-medium">
              {experts[active].specialization}
            </p>
            <p className="text-sm text-paynes-gray/80 dark:text-light-blue/80 mt-1">
              {experts[active].experience}
            </p>
            <p className="text-lg text-paynes-gray/90 dark:text-light-blue/90 mt-8 leading-relaxed">
              {experts[active].bio}
            </p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-light-blue dark:bg-paynes-gray flex items-center justify-center group/button hover:bg-dark-spring-green transition-colors duration-300"
            >
              <IconArrowLeft className="h-6 w-6 text-paynes-gray dark:text-light-blue group-hover/button:text-ghost-white transition-colors duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-light-blue dark:bg-paynes-gray flex items-center justify-center group/button hover:bg-dark-spring-green transition-colors duration-300"
            >
              <IconArrowRight className="h-6 w-6 text-paynes-gray dark:text-light-blue group-hover/button:text-ghost-white transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 