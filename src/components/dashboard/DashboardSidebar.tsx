import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
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

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
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
      label: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      color: "#7C3AED",
      description: "View consultation reports"
    },
    {
      label: "Diet Plans",
      href: "/dashboard/diet-plans",
      icon: Utensils,
      color: "#EA580C",
      description: "Personalized nutrition plans"
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
      color: "#DB2777",
      description: "Manage your profile"
    },
    {
      label: "Basic Info",
      href: "/dashboard/basic-info",
      icon: Info,
      color: "#0891B2",
      description: "Update your basic information"
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "300px",
        }}
        className={cn(
          "relative h-screen bg-white border-r border-gray-200 shadow-lg",
          "transition-all duration-300 ease-in-out z-50"
        )}
      >
        {/* Toggle Button */}
                  <Button
                    variant="ghost"
          size="icon"
          className="absolute -right-4 top-6 h-8 w-8 rounded-full border shadow-md bg-white hover:bg-gray-100 z-50"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
                  </Button>

        {/* Header */}
        <div className="flex h-20 items-center border-b px-6">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#04724D] to-[#0891B2] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">VD</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#04724D] to-[#0891B2] bg-clip-text text-transparent">
                    Virtual Doctor
                  </h2>
                  <p className="text-xs text-gray-500">AI Healthcare Assistant</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#04724D] to-[#0891B2] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">VD</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2 p-4 mt-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.href}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveItem(link.href);
                  navigate(link.href);
                }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-all duration-200",
                  "hover:bg-gray-50 group relative",
                  activeItem === link.href 
                    ? "bg-gray-50 shadow-sm" 
                    : "text-gray-600"
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 rounded-full transition-all duration-200",
                    activeItem === link.href ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    backgroundColor: link.color,
                    boxShadow: activeItem === link.href ? `0 0 10px ${link.color}40` : "none"
                  }}
                />
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200",
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col items-start"
                    >
                      <span
                        className={cn(
                          "font-semibold transition-colors duration-200 text-base",
                          activeItem === link.href
                            ? "text-gray-900"
                            : "text-gray-600 group-hover:text-gray-900"
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="text-xs text-gray-500">{link.description}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
  );
}
