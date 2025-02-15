import { supabase } from './supabase';
import { generateDietPlan } from './gemini';
import type { DietPlan } from './gemini';
import type { StoredReport } from './reports';

export interface StoredDietPlan {
  id: string;
  report_id: string;
  user_id: string;
  diet_data: DietPlan;
  created_at: string;
  updated_at: string;
}

export async function createDietPlan(report: StoredReport): Promise<StoredDietPlan | null> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Generate diet plan using AI
    const dietPlan = await generateDietPlan({
      condition: report.report_data.estimatedCondition,
      weight: report.report_data.basicDetails?.weight || 0,
      height: report.report_data.basicDetails?.height || 0,
      allergies: report.report_data.basicDetails?.allergies || [],
      medications: report.report_data.medications || []
    });

    // Store in database with explicit user_id
    const { data, error } = await supabase
      .from('diet_plans')
      .insert({
        report_id: report.id,
        user_id: user.id,
        diet_data: dietPlan
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating diet plan:', error);
    return null;
  }
}

export async function getDietPlanByReportId(reportId: string): Promise<StoredDietPlan | null> {
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    return null;
  }
}

export async function getUserDietPlans(): Promise<StoredDietPlan[]> {
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*, reports(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user diet plans:', error);
    return [];
  }
}

export async function updateDietPlan(id: string, dietData: DietPlan): Promise<StoredDietPlan | null> {
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .update({ diet_data: dietData })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating diet plan:', error);
    return null;
  }
} 