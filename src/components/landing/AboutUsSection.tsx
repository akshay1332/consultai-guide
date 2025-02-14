import React from "react";
import { Timeline } from "@/components/ui/Timeline";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const timelineData = [
    {
      title: "2024",
      content: (
        <div>
          <motion.p 
            className="text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Launched ConsultAI, revolutionizing the way businesses leverage artificial intelligence through expert consultation and guidance. Our platform brings enterprise-grade AI solutions within reach of organizations of all sizes.
          </motion.p>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3"
                alt="AI consultation meeting"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3"
                alt="Team collaboration"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
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
            className="text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            We're dedicated to democratizing AI technology by providing expert consultation services that help businesses implement AI solutions effectively and ethically. Our mission is to bridge the gap between cutting-edge AI technology and practical business applications.
          </motion.p>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
                alt="Team meeting"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3"
                alt="AI technology"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
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
            className="text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Making a difference in how businesses operate through AI implementation. Our track record speaks for itself:
          </motion.p>
          <motion.div 
            className="mb-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3 items-center text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium">
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="text-dark-spring-green text-xl"
              >
                ✅
              </motion.span>
              <span className="hover:text-dark-spring-green transition-colors duration-200">100+ Successful AI Implementations</span>
            </div>
            <div className="flex gap-3 items-center text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium">
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="text-dark-spring-green text-xl"
              >
                ✅
              </motion.span>
              <span className="hover:text-dark-spring-green transition-colors duration-200">50+ Enterprise Clients</span>
            </div>
            <div className="flex gap-3 items-center text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium">
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="text-dark-spring-green text-xl"
              >
                ✅
              </motion.span>
              <span className="hover:text-dark-spring-green transition-colors duration-200">95% Client Satisfaction Rate</span>
            </div>
            <div className="flex gap-3 items-center text-paynes-gray dark:text-light-blue text-sm md:text-base font-medium">
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="text-dark-spring-green text-xl"
              >
                ✅
              </motion.span>
              <span className="hover:text-dark-spring-green transition-colors duration-200">24/7 Expert Support</span>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3"
                alt="Data analysis"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3"
                alt="Team success"
                className="rounded-xl object-cover h-24 md:h-48 lg:h-64 w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-200"
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