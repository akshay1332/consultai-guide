import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ClipboardCheck,
  User,
  Info,
  LogOut,
  Home,
  Activity,
  Settings,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const sidebarVariants = {
  expanded: { width: "300px" },
  collapsed: { width: "80px" }
};

const itemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -10 }
};

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("/dashboard");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const sidebarLinks = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: Home,
      color: "#04724D",
      description: "Dashboard overview and summary"
    },
    {
      label: "Assessments",
      href: "/dashboard/assessments",
      icon: Activity,
      color: "#2563EB",
      description: "Medical assessments and tests"
    },
    {
      label: "Sessions",
      href: "/dashboard/sessions",
      icon: MessageSquare,
      color: "#7C3AED",
      description: "Start your doctor consultation"
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      color: "#EA580C",
      description: "View consultation reports"
    },
    {
      label: "Diet Plans",
      href: "/dashboard/diet-plans",
      icon: Utensils,
      color: "#DB2777",
      description: "Personalized nutrition plans"
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: Info,
      color: "#0891B2",
      description: "Update your basic information"
    },
  ];

  return (
    <motion.div
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className={cn(
        "relative h-screen bg-white border-r border-gray-200",
        "shadow-[0_0_15px_rgba(0,0,0,0.1)]",
        "transition-all duration-300 ease-in-out z-50",
        "flex flex-col"
      )}
    >
      {/* Toggle Button */}
      <motion.button
        className={cn(
          "absolute -right-3 top-6",
          "h-6 w-6 rounded-full",
          "bg-white border border-gray-200",
          "shadow-md hover:shadow-lg",
          "flex items-center justify-center",
          "transition-transform duration-200",
          "hover:scale-110 focus:outline-none",
          "z-50"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600" />
        )}
      </motion.button>

      {/* Header */}
      <div className="flex h-20 items-center px-4 border-b border-gray-100">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#04724D] to-[#0891B2] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-lg">VD</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <motion.h2
                  className="text-xl font-bold bg-gradient-to-r from-[#04724D] to-[#0891B2] bg-clip-text text-transparent"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Virtual Doctor
                </motion.h2>
                <motion.p
                  className="text-xs text-gray-500"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  AI Healthcare Assistant
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative group"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#04724D] to-[#0891B2] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">VD</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.href}
                onClick={() => {
                  setActiveItem(link.href);
                  navigate(link.href);
                }}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-xl",
                  "transition-all duration-200",
                  "hover:bg-gray-50 group relative",
                  activeItem === link.href 
                    ? "bg-gray-50 shadow-sm" 
                    : "text-gray-600"
                )}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 rounded-full",
                    "transition-all duration-200 ease-in-out"
                  )}
                  initial={{ opacity: 0, height: "0%" }}
                  animate={{
                    opacity: activeItem === link.href ? 1 : 0,
                    height: activeItem === link.href ? "100%" : "0%"
                  }}
                  style={{
                    backgroundColor: link.color,
                    boxShadow: activeItem === link.href ? `0 0 10px ${link.color}40` : "none"
                  }}
                />
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    "transition-all duration-200",
                    activeItem === link.href ? "bg-white shadow-md" : "bg-gray-50"
                  )}
                  style={{
                    color: activeItem === link.href ? link.color : "#64748B"
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      variants={itemVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="flex flex-col items-start min-w-0"
                    >
                      <span
                        className={cn(
                          "font-semibold transition-colors duration-200 text-base truncate",
                          activeItem === link.href
                            ? "text-gray-900"
                            : "text-gray-600 group-hover:text-gray-900"
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {link.description}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer with User Profile */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/80 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 w-full p-3 rounded-xl",
            "bg-white/80 hover:bg-red-50",
            "text-red-600 hover:text-red-700",
            "shadow-sm hover:shadow-md",
            "transition-all duration-200"
          )}
        >
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex flex-col items-start"
              >
                <span className="font-semibold text-base">Logout</span>
                <span className="text-xs text-red-400">End your session</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
