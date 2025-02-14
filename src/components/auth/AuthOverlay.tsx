import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-[400px] relative overflow-hidden bg-white/95 backdrop-blur-sm border-2">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-dark-spring-green/10 via-transparent to-light-blue/10 z-0" />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 hover:bg-dark-spring-green/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="relative z-10 space-y-1">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center mb-4"
                >
                  {isSignUp ? (
                    <UserPlus className="h-8 w-8 text-dark-spring-green" />
                  ) : (
                    <LogIn className="h-8 w-8 text-dark-spring-green" />
                  )}
                </motion.div>
                <CardTitle className="text-2xl font-bold text-center text-paynes-gray">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="text-center text-paynes-gray/60">
                  {isSignUp
                    ? "Join us for a healthier tomorrow"
                    : "Continue your healthcare journey"}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-paynes-gray/40" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-white/50 border-paynes-gray/20 focus:border-dark-spring-green/50 transition-colors"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-paynes-gray/40" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-white/50 border-paynes-gray/20 focus:border-dark-spring-green/50 transition-colors"
                      />
                    </div>
                  </motion.div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-dark-spring-green hover:bg-dark-spring-green/90 text-white group relative overflow-hidden"
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      className="w-full text-paynes-gray hover:text-dark-spring-green hover:bg-dark-spring-green/10 transition-colors"
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp ? "Already have an account?" : "Need an account?"}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-dark-spring-green/10 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-light-blue/10 rounded-full blur-xl" />
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
