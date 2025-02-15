import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "How it Works", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Support", href: "#" }
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" }
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "HIPAA Compliance", href: "#" }
  ]
};

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const hoverVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-ghost-white to-light-blue/10 relative overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 border-b border-dark-spring-green/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.h3
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-dark-spring-green to-paynes-gray bg-clip-text text-transparent mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Stay Updated with Healthcare Innovation
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-paynes-gray/70 mb-8 text-lg"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Subscribe to our newsletter for the latest updates in AI healthcare technology
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                className="relative flex-1 max-w-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 rounded-full bg-white/80 backdrop-blur-sm border-2 border-light-blue/30 focus:outline-none focus:border-dark-spring-green/50 text-paynes-gray shadow-lg shadow-dark-spring-green/5 transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-dark-spring-green hover:bg-dark-spring-green/90 text-ghost-white px-8 py-4 rounded-full group shadow-lg shadow-dark-spring-green/20 transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <h4 
              className="text-2xl font-bold bg-gradient-to-r from-dark-spring-green to-paynes-gray bg-clip-text text-transparent mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Virtual Doctor
            </h4>
            <p 
              className="text-paynes-gray/70 mb-8 max-w-md leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Revolutionizing healthcare through AI technology. Making professional medical guidance accessible to everyone, anywhere, anytime.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: "#04724d"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-dark-spring-green/10 flex items-center justify-center group transition-all duration-300 hover:shadow-lg hover:shadow-dark-spring-green/20"
                >
                  <Icon className="h-5 w-5 text-dark-spring-green group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          {["Product", "Company", "Legal"].map((section, sectionIndex) => (
            <motion.div 
              key={section}
              variants={itemVariants}
              className="space-y-6"
            >
              <h5 
                className="text-xl font-semibold text-paynes-gray"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {section}
              </h5>
              <ul className="space-y-4">
                {footerLinks[section.toLowerCase()].map((link, index) => (
                  <motion.li
                    key={index}
                    variants={hoverVariants}
                    whileHover="hover"
                    className="text-paynes-gray/70 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <a 
                      href={link.href}
                      className="group flex items-center hover:text-dark-spring-green"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 border-t border-dark-spring-green/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, text: "support@virtualdoctor.ai" },
              { icon: Phone, text: "+1 (888) 123-4567" },
              { icon: MapPin, text: "123 Healthcare Ave, Digital City" }
            ].map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center md:justify-start text-paynes-gray/70 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon className="h-5 w-5 text-dark-spring-green mr-3" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-6 border-t border-dark-spring-green/10"
        >
          <div 
            className="flex flex-col md:flex-row justify-between items-center text-paynes-gray/60 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <motion.div variants={itemVariants}>
              © {currentYear} Virtual Doctor. All rights reserved.
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center mt-4 md:mt-0"
            >
              <motion.span 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                Made with <Heart className="h-4 w-4 text-dark-spring-green mx-1 animate-pulse" /> by Healthcare Innovators
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 