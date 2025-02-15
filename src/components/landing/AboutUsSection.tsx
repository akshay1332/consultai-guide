import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/Timeline";
import { motion } from "framer-motion";

// Preload images for better performance
const imageUrls = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const preloadImages = () => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://via.placeholder.com/800x600?text=Loading...";

  return (
    <img
      src={imageError ? fallbackImage : src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

export default function AboutUsSection() {
  useEffect(() => {
    preloadImages();
  }, []);

  const timelineData = [
    {
      title: "2024",
      content: (
        <div>
          <motion.p 
            className="text-paynes-gray dark:text-light-blue text-base md:text-lg font-medium mb-8 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Launched ConsultAI, revolutionizing the way businesses leverage artificial intelligence through expert consultation and guidance. Our platform brings enterprise-grade AI solutions within reach of organizations of all sizes.
          </motion.p>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[0]}
                alt="AI consultation meeting"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[1]}
                alt="Team collaboration"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Mission",
      content: (
        <div>
          <motion.p 
            className="text-paynes-gray dark:text-light-blue text-base md:text-lg font-medium mb-8 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            We're dedicated to democratizing AI technology by providing expert consultation services that help businesses implement AI solutions effectively and ethically. Our mission is to bridge the gap between cutting-edge AI technology and practical business applications.
          </motion.p>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[2]}
                alt="Team meeting"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[3]}
                alt="AI technology"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Impact",
      content: (
        <div>
          <motion.p 
            className="text-paynes-gray dark:text-light-blue text-base md:text-lg font-medium mb-6 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Making a difference in how businesses operate through AI implementation. Our track record speaks for itself:
          </motion.p>
          <motion.div 
            className="mb-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              "100+ Successful AI Implementations",
              "50+ Enterprise Clients",
              "95% Client Satisfaction Rate",
              "24/7 Expert Support"
            ].map((achievement, index) => (
              <motion.div
                key={index}
                className="flex gap-3 items-center text-paynes-gray dark:text-light-blue text-base md:text-lg font-medium group"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-dark-spring-green text-2xl transform-gpu"
                >
                  ✅
                </motion.span>
                <span className="group-hover:text-dark-spring-green transition-colors duration-300">
                  {achievement}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[4]}
                alt="Data analysis"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="overflow-hidden rounded-2xl group"
            >
              <ImageWithFallback
                src={imageUrls[5]}
                alt="Team success"
                className="rounded-2xl object-cover h-32 md:h-56 lg:h-72 w-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-ghost-white via-light-blue/5 to-ghost-white dark:from-black dark:via-paynes-gray/5 dark:to-black">
      <Timeline data={timelineData} />
    </div>
  );
} 