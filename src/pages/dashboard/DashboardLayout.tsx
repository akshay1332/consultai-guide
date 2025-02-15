import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const loadingVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4F4F9] to-[#B8DBD9]/20">
        <motion.div
          variants={loadingVariants}
          animate="animate"
          className="flex flex-col items-center gap-4"
        >
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#04724D] to-[#0891B2] flex items-center justify-center shadow-lg">
            <Loader2 className="h-8 w-8 text-white" />
          </div>
          <p className="text-[#04724D] font-medium animate-pulse">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#F4F4F9] to-[#B8DBD9]/20">
      <DashboardSidebar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "flex-1 relative",
          "h-screen overflow-y-auto",
          "transition-all duration-300 ease-in-out",
          "backdrop-blur-sm"
        )}
      >
        <div className="absolute inset-0 p-4 md:p-6 lg:p-8">
          <div className="container mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
