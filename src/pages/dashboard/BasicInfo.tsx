
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BasicInfoForm = {
  date_of_birth: string;
  gender: string;
  height: number;
  weight: number;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

export default function BasicInfo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<BasicInfoForm>();

  const { data: basicInfo } = useQuery({
    queryKey: ["basic-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("basic_information")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BasicInfoForm) => {
      const { error } = await supabase
        .from("basic_information")
        .upsert({
          user_id: user?.id,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          blood_type: data.blood_type,
          allergies: data.allergies.split(",").map(item => item.trim()),
          medical_conditions: data.medical_conditions.split(",").map(item => item.trim()),
          emergency_contact: {
            name: data.emergency_contact_name,
            phone: data.emergency_contact_phone,
          },
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basic-info"] });
      toast.success("Basic information updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update basic information");
      console.error(error);
    },
  });

  useEffect(() => {
    if (basicInfo) {
      reset({
        date_of_birth: basicInfo.date_of_birth,
        gender: basicInfo.gender,
        height: basicInfo.height,
        weight: basicInfo.weight,
        blood_type: basicInfo.blood_type,
        allergies: basicInfo.allergies?.join(", "),
        medical_conditions: basicInfo.medical_conditions?.join(", "),
        emergency_contact_name: basicInfo.emergency_contact?.name,
        emergency_contact_phone: basicInfo.emergency_contact?.phone,
      });
    }
  }, [basicInfo, reset]);

  const onSubmit = (data: BasicInfoForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Basic Information</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select {...register("gender")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  {...register("height")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register("weight")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select {...register("blood_type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies"
                {...register("allergies")}
                placeholder="e.g., Peanuts, Penicillin, Latex"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Medical Conditions (comma-separated)</Label>
              <Input
                id="medical_conditions"
                {...register("medical_conditions")}
                placeholder="e.g., Asthma, Diabetes, Hypertension"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  {...register("emergency_contact_name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  {...register("emergency_contact_phone")}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
