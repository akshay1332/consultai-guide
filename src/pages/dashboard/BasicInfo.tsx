import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, User, Heart, Activity, Pill, AlertTriangle, Plus, Minus, Save } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];
type BasicInformationRow = Tables["basic_information"]["Row"];
type BasicInformationInsert = Tables["basic_information"]["Insert"];

type BasicInfoForm = {
  date_of_birth: string;
  gender: string;
  height: number;
  weight: number;
  blood_type: string;
  allergies: string[];
  medical_conditions: string[];
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  lifestyle_habits: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
    diet: string[];
  };
  family_history: Array<{
    condition: string;
    relation: string;
  }>;
  vaccination_history: Array<{
    name: string;
    date: string;
  }>;
  preferred_language: string;
  occupation: string;
  marital_status: string;
  exercise_frequency: string;
  dietary_preferences: string[];
  last_physical_exam: string;
  blood_pressure: {
    systolic: number;
    diastolic: number;
    last_checked: string;
  };
  insurance_info: {
    provider: string;
    policy_number: string;
    group_number: string;
  };
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EXERCISE_FREQUENCY = ["Never", "Rarely", "1-2 times/week", "3-4 times/week", "5+ times/week"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Separated", "Domestic Partnership"];
const DIETARY_PREFERENCES = ["Vegetarian", "Vegan", "Pescatarian", "Gluten-Free", "Dairy-Free", "Kosher", "Halal", "None"];

export default function BasicInfo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");
  const [familyHistory, setFamilyHistory] = useState<BasicInfoForm["family_history"]>([]);
  const [vaccinations, setVaccinations] = useState<BasicInfoForm["vaccination_history"]>([]);
  const { register, handleSubmit, reset, setValue, watch } = useForm<BasicInfoForm>();

  const { data: basicInfo, isLoading } = useQuery({
    queryKey: ["basic-info", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const { data: rawData, error } = await supabase
        .from("basic_information")
        .select()
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found for this user, return default values
          return {
            date_of_birth: "",
            gender: "",
            height: 0,
            weight: 0,
            blood_type: "",
            allergies: [],
            medical_conditions: [],
            emergency_contact: { name: "", phone: "", relationship: "" },
            lifestyle_habits: { smoking: false, alcohol: "", exercise: "", diet: [] },
            family_history: [],
            vaccination_history: [],
            preferred_language: "",
            occupation: "",
            marital_status: "",
            exercise_frequency: "",
            dietary_preferences: [],
            last_physical_exam: "",
            blood_pressure: { systolic: 0, diastolic: 0, last_checked: "" },
            insurance_info: { provider: "", policy_number: "", group_number: "" }
          } as BasicInfoForm;
        }
        throw error;
      }
      
      const data = rawData as BasicInformationRow;
      
      // Transform the data to match our form type
      const transformedData: BasicInfoForm = {
        date_of_birth: data?.date_of_birth || "",
        gender: data?.gender || "",
        height: data?.height || 0,
        weight: data?.weight || 0,
        blood_type: data?.blood_type || "",
        allergies: data?.allergies || [],
        medical_conditions: data?.medical_conditions || [],
        emergency_contact: (data?.emergency_contact || { name: "", phone: "", relationship: "" }) as BasicInfoForm["emergency_contact"],
        lifestyle_habits: (data?.lifestyle_habits || { smoking: false, alcohol: "", exercise: "", diet: [] }) as BasicInfoForm["lifestyle_habits"],
        family_history: (data?.family_history || []) as BasicInfoForm["family_history"],
        vaccination_history: (data?.vaccination_history || []) as BasicInfoForm["vaccination_history"],
        preferred_language: data?.preferred_language || "",
        occupation: data?.occupation || "",
        marital_status: data?.marital_status || "",
        exercise_frequency: data?.exercise_frequency || "",
        dietary_preferences: data?.dietary_preferences || [],
        last_physical_exam: data?.last_physical_exam || "",
        blood_pressure: (data?.blood_pressure || { systolic: 0, diastolic: 0, last_checked: "" }) as BasicInfoForm["blood_pressure"],
        insurance_info: (data?.insurance_info || { provider: "", policy_number: "", group_number: "" }) as BasicInfoForm["insurance_info"]
      };
      
      return transformedData;
    },
    enabled: !!user?.id, // Only run query when user is authenticated
  });

  const mutation = useMutation({
    mutationFn: async (data: BasicInfoForm) => {
      if (!user?.id) throw new Error("No authenticated user");

      // Convert empty strings to null or appropriate default values for numeric fields
      const insertData: BasicInformationInsert = {
        user_id: user.id, // Use the authenticated user's ID
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || "",
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
        blood_type: data.blood_type || "",
        allergies: data.allergies || [],
        medical_conditions: data.medical_conditions || [],
        emergency_contact: data.emergency_contact || {
          name: "",
          phone: "",
          relationship: ""
        },
        lifestyle_habits: data.lifestyle_habits || {
          smoking: false,
          alcohol: "",
          exercise: "",
          diet: []
        },
        family_history: data.family_history || [],
        vaccination_history: data.vaccination_history || [],
        preferred_language: data.preferred_language || "",
        occupation: data.occupation || "",
        marital_status: data.marital_status || "",
        exercise_frequency: data.exercise_frequency || "",
        dietary_preferences: data.dietary_preferences || [],
        last_physical_exam: data.last_physical_exam || null,
        blood_pressure: {
          systolic: data.blood_pressure?.systolic ? Number(data.blood_pressure.systolic) : null,
          diastolic: data.blood_pressure?.diastolic ? Number(data.blood_pressure.diastolic) : null,
          last_checked: data.blood_pressure?.last_checked || null
        },
        insurance_info: data.insurance_info || {
          provider: "",
          policy_number: "",
          group_number: ""
        },
        updated_at: new Date().toISOString(),
      };

      // Remove any undefined values
      Object.keys(insertData).forEach(key => {
        if (insertData[key as keyof typeof insertData] === undefined) {
          delete insertData[key as keyof typeof insertData];
        }
      });

      const { error } = await supabase
        .from("basic_information")
        .upsert(insertData)
        .eq('user_id', user.id); // Ensure we're only updating this user's data

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basic-info", user?.id] });
      toast.success("Basic information updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update basic information");
      console.error(error);
    },
  });

  useEffect(() => {
    if (basicInfo) {
      reset(basicInfo);
      setFamilyHistory(basicInfo.family_history || []);
      setVaccinations(basicInfo.vaccination_history || []);
    }
  }, [basicInfo, reset]);

  const onSubmit = (data: BasicInfoForm) => {
    mutation.mutate({
      ...data,
      family_history: familyHistory,
      vaccination_history: vaccinations,
    });
  };

  const addFamilyHistory = () => {
    setFamilyHistory([...familyHistory, { condition: "", relation: "" }]);
  };

  const removeFamilyHistory = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
  };

  const addVaccination = () => {
    setVaccinations([...vaccinations, { name: "", date: "" }]);
  };

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04724D]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">Please log in to view and update your basic information.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-[#04724D]">Basic Information</h1>
        <p className="text-gray-600">
          Please provide your basic health information to help us serve you better.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 mb-8">
            <TabsTrigger value="personal" className="data-[state=active]:bg-[#04724D] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-[#04724D] data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="data-[state=active]:bg-[#04724D] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Lifestyle
            </TabsTrigger>
            <TabsTrigger value="medical" className="data-[state=active]:bg-[#04724D] data-[state=active]:text-white">
              <Pill className="w-4 h-4 mr-2" />
              Medical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watch("date_of_birth") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch("date_of_birth") ? format(new Date(watch("date_of_birth")), "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch("date_of_birth") ? new Date(watch("date_of_birth")) : undefined}
                          onSelect={(date) => setValue("date_of_birth", date?.toISOString() || "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={watch("gender")}
                      onValueChange={(value) => setValue("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_language">Preferred Language</Label>
                    <Input
                      id="preferred_language"
                      {...register("preferred_language")}
                      placeholder="e.g., English"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      {...register("occupation")}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select
                      value={watch("marital_status")}
                      onValueChange={(value) => setValue("marital_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARITAL_STATUS.map((status) => (
                          <SelectItem key={status} value={status.toLowerCase()}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Emergency Contact</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact.name">Name</Label>
                      <Input
                        id="emergency_contact.name"
                        {...register("emergency_contact.name")}
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact.phone">Phone</Label>
                      <Input
                        id="emergency_contact.phone"
                        {...register("emergency_contact.phone")}
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact.relationship">Relationship</Label>
                      <Input
                        id="emergency_contact.relationship"
                        {...register("emergency_contact.relationship")}
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
                <CardDescription>
                  Your physical measurements and health indicators.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      {...register("height")}
                      placeholder="Height in centimeters"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      {...register("weight")}
                      placeholder="Weight in kilograms"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Select
                      value={watch("blood_type")}
                      onValueChange={(value) => setValue("blood_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Pressure</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Systolic"
                        {...register("blood_pressure.systolic")}
                      />
                      <Input
                        type="number"
                        placeholder="Diastolic"
                        {...register("blood_pressure.diastolic")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Family Medical History</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFamilyHistory}
                      className="text-[#04724D]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {familyHistory.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-4 md:grid-cols-2 items-center"
                      >
                        <Input
                          placeholder="Medical condition"
                          value={item.condition}
                          onChange={(e) => {
                            const newHistory = [...familyHistory];
                            newHistory[index].condition = e.target.value;
                            setFamilyHistory(newHistory);
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Relation"
                            value={item.relation}
                            onChange={(e) => {
                              const newHistory = [...familyHistory];
                              newHistory[index].relation = e.target.value;
                              setFamilyHistory(newHistory);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFamilyHistory(index)}
                            className="text-red-500"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Information</CardTitle>
                <CardDescription>
                  Your lifestyle habits and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Smoking Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={watch("lifestyle_habits.smoking")}
                        onCheckedChange={(checked) => setValue("lifestyle_habits.smoking", checked)}
                      />
                      <span>I am a smoker</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lifestyle_habits.alcohol">Alcohol Consumption</Label>
                    <Select
                      value={watch("lifestyle_habits.alcohol")}
                      onValueChange={(value) => setValue("lifestyle_habits.alcohol", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="occasionally">Occasionally</SelectItem>
                        <SelectItem value="moderately">Moderately</SelectItem>
                        <SelectItem value="frequently">Frequently</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
                    <Select
                      value={watch("exercise_frequency")}
                      onValueChange={(value) => setValue("exercise_frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXERCISE_FREQUENCY.map((frequency) => (
                          <SelectItem key={frequency} value={frequency.toLowerCase()}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Dietary Preferences</Label>
                    <ScrollArea className="h-[120px] w-full rounded-md border p-4">
                      <div className="space-y-2">
                        {DIETARY_PREFERENCES.map((preference) => (
                          <div key={preference} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={preference}
                              checked={watch("dietary_preferences")?.includes(preference.toLowerCase())}
                              onChange={(e) => {
                                const current = watch("dietary_preferences") || [];
                                if (e.target.checked) {
                                  setValue("dietary_preferences", [...current, preference.toLowerCase()]);
                                } else {
                                  setValue(
                                    "dietary_preferences",
                                    current.filter((p) => p !== preference.toLowerCase())
                                  );
                                }
                              }}
                              className="rounded border-gray-300 text-[#04724D] focus:ring-[#04724D]"
                            />
                            <label htmlFor={preference}>{preference}</label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Your medical history and current conditions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Allergies</h3>
                    <Badge variant="outline" className="text-[#04724D]">
                      {watch("allergies")?.length || 0} Listed
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="List your allergies (separated by commas)"
                    value={watch("allergies")?.join(", ")}
                    onChange={(e) => setValue("allergies", e.target.value.split(",").map(s => s.trim()))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Medical Conditions</h3>
                    <Badge variant="outline" className="text-[#04724D]">
                      {watch("medical_conditions")?.length || 0} Listed
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="List your current medical conditions (separated by commas)"
                    value={watch("medical_conditions")?.join(", ")}
                    onChange={(e) => setValue("medical_conditions", e.target.value.split(",").map(s => s.trim()))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Vaccination History</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVaccination}
                      className="text-[#04724D]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Vaccination
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {vaccinations.map((vaccination, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-4 md:grid-cols-2 items-center"
                      >
                        <Input
                          placeholder="Vaccine name"
                          value={vaccination.name}
                          onChange={(e) => {
                            const newVaccinations = [...vaccinations];
                            newVaccinations[index].name = e.target.value;
                            setVaccinations(newVaccinations);
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={vaccination.date}
                            onChange={(e) => {
                              const newVaccinations = [...vaccinations];
                              newVaccinations[index].date = e.target.value;
                              setVaccinations(newVaccinations);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVaccination(index)}
                            className="text-red-500"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Insurance Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_info.provider">Provider</Label>
                      <Input
                        id="insurance_info.provider"
                        {...register("insurance_info.provider")}
                        placeholder="Insurance provider"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insurance_info.policy_number">Policy Number</Label>
                      <Input
                        id="insurance_info.policy_number"
                        {...register("insurance_info.policy_number")}
                        placeholder="Policy number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insurance_info.group_number">Group Number</Label>
                      <Input
                        id="insurance_info.group_number"
                        {...register("insurance_info.group_number")}
                        placeholder="Group number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#04724D] hover:bg-[#04724D]/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Save className="h-4 w-4" />
                </motion.div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
