import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, UserPlus, LogIn, Heart, Sparkles } from "lucide-react";

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthOverlay({ isOpen, onClose }: AuthOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Background Images and Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-paynes-gray/20 to-black opacity-90" />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1920"
                alt="AI Background"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          </div>

          {/* Animated Particles */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-dark-spring-green rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 2,
                  opacity: Math.random() * 0.5,
                }}
                animate={{
                  y: [null, Math.random() * -100],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-20 w-full">
            <div className="container max-w-screen-xl mx-auto px-4 py-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Column - Info */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:block"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="h-12 w-12 text-dark-spring-green" />
                    <Sparkles className="h-8 w-8 text-dark-spring-green animate-pulse" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-dark-spring-green via-light-blue to-dark-spring-green bg-clip-text text-transparent">
                    {isSignUp ? "Join Our AI Revolution" : "Welcome Back"}
                  </h1>
                  <p className="text-xl text-ghost-white/80 mb-8 leading-relaxed">
                    {isSignUp
                      ? "Embark on a journey to transform your business with cutting-edge AI solutions and expert guidance."
                      : "Continue your AI journey with our expert consultation and implementation services."}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-dark-spring-green" />
                        <p className="text-ghost-white/70">Expert AI Consultation</p>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-dark-spring-green" />
                        <p className="text-ghost-white/70">24/7 Support</p>
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-dark-spring-green" />
                        <p className="text-ghost-white/70">Custom Solutions</p>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-dark-spring-green" />
                        <p className="text-ghost-white/70">Proven Results</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Form */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-md mx-auto"
                >
                  <Card className="bg-black/50 border-ghost-white/10 backdrop-blur-xl shadow-[0_0_15px_rgba(0,255,0,0.07)]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 text-ghost-white/60 hover:text-ghost-white hover:bg-white/10"
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <CardHeader className="space-y-1">
                      <motion.div 
                        className="flex items-center justify-center mb-4"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {isSignUp ? (
                          <UserPlus className="h-8 w-8 text-dark-spring-green" />
                        ) : (
                          <LogIn className="h-8 w-8 text-dark-spring-green" />
                        )}
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-center text-ghost-white">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                      </CardTitle>
                      <CardDescription className="text-center text-ghost-white/60">
                        {isSignUp
                          ? "Join us for a smarter tomorrow"
                          : "Continue your AI journey"}
                      </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleAuth}>
                      <CardContent className="space-y-4">
                        <motion.div 
                          className="space-y-2"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ghost-white/40 group-hover:text-dark-spring-green transition-colors" />
                            <Input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="pl-10 bg-white/5 border-ghost-white/10 text-ghost-white placeholder:text-ghost-white/40 focus:border-dark-spring-green/50 hover:border-dark-spring-green/30 transition-colors"
                            />
                          </div>
                        </motion.div>

                        <motion.div 
                          className="space-y-2"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ghost-white/40 group-hover:text-dark-spring-green transition-colors" />
                            <Input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="pl-10 bg-white/5 border-ghost-white/10 text-ghost-white placeholder:text-ghost-white/40 focus:border-dark-spring-green/50 hover:border-dark-spring-green/30 transition-colors"
                            />
                          </div>
                        </motion.div>
                      </CardContent>

                      <CardFooter className="flex flex-col space-y-4">
                        <Button 
                          className="w-full bg-dark-spring-green hover:bg-dark-spring-green/90 text-ghost-white group relative overflow-hidden shadow-lg shadow-dark-spring-green/20"
                          type="submit" 
                          disabled={isLoading}
                        >
                          <span className="relative z-10 flex items-center">
                            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-dark-spring-green to-dark-spring-green/80"
                            initial={{ x: '100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full text-ghost-white/80 hover:text-dark-spring-green hover:bg-dark-spring-green/10"
                          type="button"
                          onClick={() => setIsSignUp(!isSignUp)}
                        >
                          {isSignUp ? "Already have an account?" : "Need an account?"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
