import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-ghost-white/90 dark:bg-black font-sans md:px-10 backdrop-blur-sm"
      ref={containerRef}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10"
      >
        <h2 
          className="text-3xl md:text-6xl mb-8 max-w-4xl font-extrabold bg-gradient-to-r from-dark-spring-green via-paynes-gray to-dark-spring-green bg-clip-text text-transparent tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Our Journey
        </h2>
        <p 
          className="text-paynes-gray dark:text-light-blue text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Discover how we've evolved and grown to become a leading AI consultation platform.
        </p>
      </motion.div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="flex justify-start pt-10 md:pt-40 md:gap-10 group"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <motion.div 
                className="h-14 absolute left-3 md:left-3 w-14 rounded-full bg-ghost-white dark:bg-black flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.2, rotate: 360 }}
                animate={{
                  scale: hoveredIndex === index ? 1.1 : 1,
                  backgroundColor: hoveredIndex === index ? "#04724D" : "",
                }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-dark-spring-green to-paynes-gray border-2 border-light-blue shadow-inner" />
              </motion.div>
              <motion.h3 
                className="hidden md:block text-xl md:pl-20 md:text-7xl font-black text-paynes-gray dark:text-light-blue tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                animate={{
                  color: hoveredIndex === index ? "#04724D" : "",
                  scale: hoveredIndex === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {item.title}
              </motion.h3>
            </div>

            <motion.div 
              className="relative pl-20 pr-4 md:pl-4 w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <motion.h3 
                className="md:hidden block text-4xl mb-4 text-left font-black text-paynes-gray dark:text-light-blue tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                animate={{
                  color: hoveredIndex === index ? "#04724D" : "",
                }}
              >
                {item.title}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0.9 }}
                whileHover={{ 
                  opacity: 1,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="bg-ghost-white/50 dark:bg-paynes-gray/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {item.content}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[4px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-light-blue dark:via-paynes-gray to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[4px] bg-gradient-to-t from-dark-spring-green via-paynes-gray to-transparent from-[0%] via-[50%] rounded-full glow-effect"
          />
        </div>
      </div>
    </div>
  );
}; 