import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { Profile as ProfileType, BasicInformation } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { Loader2, User, Heart, Activity, Shield, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const steps = [
  {
    id: "personal",
    title: "Personal Info",
    icon: User,
    color: "#04724D",
  },
  {
    id: "health",
    title: "Health Info",
    icon: Heart,
    color: "#0891B2",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    icon: Activity,
    color: "#7C3AED",
  },
  {
    id: "emergency",
    title: "Emergency",
    icon: Shield,
    color: "#EA580C",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface FormData {
  personal: {
    full_name: string;
    email: string;
    location: string;
  };
  health: {
    date_of_birth: string;
    blood_type: string;
    height: number;
    weight: number;
  };
  lifestyle: {
    exercise_frequency: string;
    dietary_preferences: string[];
  };
  emergency: {
    contact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
}

export default function Profile() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  
  const { data: profiles, loading: profileLoading, error: profileError } = 
    useRealtimeSubscription<ProfileType>('profiles', user?.id || '', 'id');
  const { data: basicInfo, loading: basicInfoLoading, error: basicInfoError } = 
    useRealtimeSubscription<BasicInformation>('basic_information', user?.id || '');

  const profile = profiles?.[0];
  const info = basicInfo?.[0];

  const isLoading = profileLoading || basicInfoLoading;
  const error = profileError || basicInfoError;

  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  // Initialize form with existing data when profile or info changes
  useEffect(() => {
    if (profile || info) {
      reset({
        personal: {
          full_name: profile?.full_name || "",
          email: profile?.email || "",
          location: profile?.location || "",
        },
        health: {
          date_of_birth: info?.date_of_birth || "",
          blood_type: info?.blood_type || "",
          height: info?.height || 0,
          weight: info?.weight || 0,
        },
        lifestyle: {
          exercise_frequency: info?.exercise_frequency || "",
          dietary_preferences: info?.dietary_preferences || [],
        },
        emergency: {
          contact: info?.emergency_contact || {
            name: "",
            relationship: "",
            phone: "",
          },
        },
      });
    }
  }, [profile, info, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!user?.id) throw new Error("No authenticated user");

      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.personal.full_name,
          email: data.personal.email,
          location: data.personal.location,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update basic information
      const { error: basicInfoError } = await supabase
        .from('basic_information')
        .upsert({
          user_id: user.id,
          ...data.health,
          ...data.lifestyle,
          emergency_contact: data.emergency.contact,
        })
        .eq('user_id', user.id);

      if (basicInfoError) throw basicInfoError;

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-[#04724D]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Error loading profile: {error.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
              <div>
          <h1 className="text-3xl font-bold text-[#04724D]">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
              </div>
        <Button
          onClick={() => setEditMode(!editMode)}
          variant={editMode ? "destructive" : "default"}
          className={cn(
            "transition-all duration-300",
            editMode ? "bg-red-500 hover:bg-red-600" : "bg-[#04724D] hover:bg-[#04724D]/90"
          )}
        >
          {editMode ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div variants={item}>
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-[#04724D]/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-[#04724D]/10 text-[#04724D] text-xl">
                  {profile?.full_name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                <p className="text-gray-500">{profile?.email}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-[#04724D]/10 text-[#04724D]">
                    Member since {profile?.created_at ? format(new Date(profile.created_at), 'MMM yyyy') : '-'}
                  </Badge>
                  <Badge variant="outline" className="bg-[#0891B2]/10 text-[#0891B2]">
                    {info?.gender || 'Not specified'}
                  </Badge>
              </div>
              </div>
              </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Steps */}
      <motion.div variants={item} className="grid grid-cols-4 gap-4">
        {steps.map((step) => (
          <motion.button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={cn(
              "relative p-4 rounded-xl transition-all duration-300",
              "hover:shadow-md group",
              currentStep === step.id ? "bg-white shadow-lg" : "bg-white/50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute left-0 top-0 w-1 h-full rounded-l-xl transition-all duration-300"
              style={{
                backgroundColor: step.color,
                opacity: currentStep === step.id ? 1 : 0,
                boxShadow: currentStep === step.id ? `0 0 10px ${step.color}40` : "none"
              }}
            />
            <div className="flex flex-col items-center gap-2 py-2">
              <div
                className={cn(
                  "p-3 rounded-xl transition-all duration-300",
                  currentStep === step.id ? "bg-white shadow-md" : "bg-gray-50"
                )}
                style={{ color: currentStep === step.id ? step.color : "#64748B" }}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  "font-medium transition-colors duration-300",
                  currentStep === step.id ? "text-gray-900" : "text-gray-600"
                )}
              >
                {step.title}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
              <CardTitle>{steps.find(s => s.id === currentStep)?.title}</CardTitle>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {currentStep === "personal" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      {editMode ? (
                        <Input 
                          {...register("personal.full_name")} 
                          defaultValue={profile?.full_name}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">{profile?.full_name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      {editMode ? (
                        <Input 
                          {...register("personal.email")} 
                          defaultValue={profile?.email}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">{profile?.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      {editMode ? (
                        <Input 
                          {...register("personal.location")} 
                          defaultValue={profile?.location}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">{profile?.location || '-'}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === "health" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date of Birth</label>
                      {editMode ? (
                        <Input 
                          type="date" 
                          {...register("health.date_of_birth")}
                          defaultValue={info?.date_of_birth}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                  {info?.date_of_birth ? format(new Date(info.date_of_birth), 'PPP') : '-'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Blood Type</label>
                      {editMode ? (
                        <Input 
                          {...register("health.blood_type")}
                          defaultValue={info?.blood_type}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">{info?.blood_type || '-'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Height (cm)</label>
                      {editMode ? (
                        <Input 
                          type="number" 
                          {...register("health.height")}
                          defaultValue={info?.height}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                          {info?.height ? `${info.height} cm` : '-'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Weight (kg)</label>
                      {editMode ? (
                        <Input 
                          type="number" 
                          {...register("health.weight")}
                          defaultValue={info?.weight}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                          {info?.weight ? `${info.weight} kg` : '-'}
                        </p>
                      )}
                    </div>
              </div>
                )}

                {currentStep === "lifestyle" && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Exercise Frequency</label>
                        <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                          {info?.exercise_frequency || '-'}
                        </p>
              </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dietary Preferences</label>
                        <div className="flex flex-wrap gap-2">
                          {info?.dietary_preferences?.length ? (
                            info.dietary_preferences.map((pref) => (
                              <Badge key={pref} variant="outline" className="bg-[#7C3AED]/10 text-[#7C3AED]">
                                {pref}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600 p-2 bg-gray-50 rounded-md w-full">-</p>
                          )}
              </div>
                </div>
                </div>
              </div>
                )}

                {currentStep === "emergency" && (
                  <div className="space-y-4">
                  {info?.emergency_contact ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Contact Name</label>
                          <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                            {info.emergency_contact.name}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Relationship</label>
                          <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                            {info.emergency_contact.relationship}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                      {info.emergency_contact.phone}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 p-2 bg-gray-50 rounded-md">No emergency contact information</p>
                    )}
                  </div>
                )}

                {editMode && (
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditMode(false)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#04724D] hover:bg-[#04724D]/90">
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
              </div>
                )}
              </form>
          </CardContent>
        </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 