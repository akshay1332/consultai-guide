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
  ArrowRight
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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-paynes-gray/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(4, 114, 77, 0.2) 0%, transparent 60%)",
            transform: "rotate(-15deg)"
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
              className="text-2xl font-bold text-paynes-gray mb-4"
            >
              Stay Updated with Healthcare Innovation
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-paynes-gray/70 mb-8"
            >
              Subscribe to our newsletter for the latest updates in AI healthcare technology
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-full bg-white border border-light-blue/20 focus:outline-none focus:border-dark-spring-green/30 text-paynes-gray"
              />
              <Button
                className="bg-dark-spring-green hover:bg-opacity-90 text-ghost-white px-8 py-3 rounded-full group"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
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
            <h4 className="text-xl font-bold text-paynes-gray mb-6">Virtual Doctor</h4>
            <p className="text-paynes-gray/70 mb-8 max-w-md">
              Revolutionizing healthcare through AI technology. Making professional medical guidance accessible to everyone, anywhere, anytime.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-dark-spring-green/10 flex items-center justify-center group transition-colors hover:bg-dark-spring-green"
                >
                  <Icon className="h-5 w-5 text-dark-spring-green group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h5 className="text-lg font-semibold text-paynes-gray mb-6">Product</h5>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-paynes-gray/70 hover:text-dark-spring-green transition-colors"
                >
                  <a href={link.href}>{link.name}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h5 className="text-lg font-semibold text-paynes-gray mb-6">Company</h5>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-paynes-gray/70 hover:text-dark-spring-green transition-colors"
                >
                  <a href={link.href}>{link.name}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h5 className="text-lg font-semibold text-paynes-gray mb-6">Legal</h5>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-paynes-gray/70 hover:text-dark-spring-green transition-colors"
                >
                  <a href={link.href}>{link.name}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Contact Info Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 border-t border-dark-spring-green/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {[
              { icon: Mail, text: "support@virtualdoctor.ai" },
              { icon: Phone, text: "+1 (888) 123-4567" },
              { icon: MapPin, text: "123 Healthcare Ave, Digital City" }
            ].map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-center md:justify-start text-paynes-gray/70"
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
          <div className="flex flex-col md:flex-row justify-between items-center text-paynes-gray/60 text-sm">
            <motion.div variants={itemVariants}>
              © {currentYear} Virtual Doctor. All rights reserved.
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center mt-4 md:mt-0"
            >
              <span className="flex items-center">
                Made with <Heart className="h-4 w-4 text-dark-spring-green mx-1" /> by Healthcare Innovators
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 