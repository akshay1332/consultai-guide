import React from "react";
import MarqueeAnimation from "@/components/ui/MarqueeAnimation";

export default function MarqueeSection() {
  return (
    <div className="w-full bg-gradient-to-r from-ghost-white via-light-blue/5 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black py-10">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-1.5}
        className="bg-dark-spring-green/90 text-ghost-white py-4 mb-4 font-medium tracking-wider text-3xl md:text-4xl"
      >
        ★ Enterprise AI Solutions ★ Machine Learning Optimization ★ AI Strategy Consulting ★ Custom AI Development
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={-1.2}
        className="bg-paynes-gray/90 text-ghost-white py-4 font-medium tracking-wider text-3xl md:text-4xl"
      >
        ★ 24/7 Expert Support ★ 95% Client Satisfaction ★ Industry Leading Expertise ★ Ethical AI Implementation
      </MarqueeAnimation>
    </div>
  );
} 