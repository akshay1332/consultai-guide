import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { Assessment } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2, Brain, Heart, Activity, Smile, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { processMedicalAssessment } from "@/lib/gemini";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { supabase } from "@/lib/supabase";

const assessmentTypes = [
  {
    id: "heart",
    title: "Heart Health Assessment",
    description: "Comprehensive evaluation of cardiovascular health and risk factors",
    icon: Heart,
    color: "text-red-500",
    questions: [
      {
        id: "personal_info",
        question: "Please provide your age, gender, and ethnicity for more accurate assessment.",
        options: ["Under 30", "30-45", "46-60", "Over 60"]
      },
      {
        id: "family_history",
        question: "Do you have a family history of heart disease?",
        options: ["No history", "Parents only", "Grandparents only", "Multiple relatives"]
      },
      {
        id: "chest_pain",
        question: "Do you experience chest pain or discomfort?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "chest_pain_type",
        question: "If you experience chest pain, how would you describe it?",
        options: ["Sharp", "Dull", "Pressure", "Burning", "Not applicable"]
      },
      {
        id: "chest_pain_duration",
        question: "How long does the chest pain typically last?",
        options: ["Few seconds", "Few minutes", "Hours", "Varies", "Not applicable"]
      },
      {
        id: "shortness_breath",
        question: "Do you experience shortness of breath during physical activity?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "shortness_breath_rest",
        question: "Do you experience shortness of breath at rest?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "palpitations",
        question: "Do you experience heart palpitations or irregular heartbeat?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "dizziness",
        question: "How often do you feel dizzy or lightheaded?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "exercise",
        question: "How often do you engage in physical exercise?",
        options: ["Never", "1-2 times/week", "3-4 times/week", "5+ times/week"]
      },
      {
        id: "exercise_intensity",
        question: "What is your typical exercise intensity level?",
        options: ["Light", "Moderate", "Vigorous", "Varies", "None"]
      },
      {
        id: "smoking",
        question: "Do you smoke or have a history of smoking?",
        options: ["Never smoked", "Former smoker", "Current light smoker", "Current heavy smoker"]
      },
      {
        id: "alcohol",
        question: "How would you describe your alcohol consumption?",
        options: ["None", "Occasional", "Moderate", "Heavy"]
      },
      {
        id: "diet",
        question: "How would you rate your diet in terms of heart health?",
        options: ["Very healthy", "Moderately healthy", "Needs improvement", "Poor"]
      },
      {
        id: "stress",
        question: "How would you rate your stress levels?",
        options: ["Low", "Moderate", "High", "Very high"]
      },
      {
        id: "sleep",
        question: "How many hours of sleep do you typically get?",
        options: ["Less than 5", "5-6", "7-8", "More than 8"]
      },
      {
        id: "medications",
        question: "Are you currently taking any heart-related medications?",
        options: ["None", "Blood pressure meds", "Cholesterol meds", "Multiple medications"]
      },
      {
        id: "blood_pressure",
        question: "What is your typical blood pressure reading?",
        options: ["Normal", "Elevated", "High", "Don't know"]
      },
      {
        id: "cholesterol",
        question: "When was your last cholesterol check?",
        options: ["Within 6 months", "Within 1 year", "Over 1 year", "Never checked"]
      },
      {
        id: "diabetes",
        question: "Do you have diabetes or pre-diabetes?",
        options: ["No", "Pre-diabetes", "Type 1 Diabetes", "Type 2 Diabetes"]
      }
    ]
  },
  {
    id: "brain",
    title: "Cognitive Health Assessment",
    description: "Evaluation of memory, focus, and cognitive function",
    icon: Brain,
    color: "text-blue-500",
    questions: [
      {
        id: "age_education",
        question: "Please specify your age group and education level.",
        options: ["Under 30 College", "30-50 College", "Over 50 College", "Other"]
      },
      {
        id: "memory_recent",
        question: "How often do you have trouble remembering recent events?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "memory_names",
        question: "Do you have difficulty remembering names of new people?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "memory_items",
        question: "How often do you misplace items?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "concentration_tasks",
        question: "Do you have difficulty concentrating on complex tasks?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "concentration_reading",
        question: "How often do you lose focus while reading?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "confusion",
        question: "How often do you feel confused or disoriented?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "decision_making",
        question: "Do you have trouble making decisions?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "language",
        question: "Do you have difficulty finding the right words?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "spatial_awareness",
        question: "Do you have trouble with directions or navigation?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "problem_solving",
        question: "How would you rate your problem-solving abilities?",
        options: ["Excellent", "Good", "Fair", "Poor"]
      },
      {
        id: "multitasking",
        question: "How well can you handle multiple tasks simultaneously?",
        options: ["Very well", "Well", "With difficulty", "Cannot multitask"]
      },
      {
        id: "sleep_quality",
        question: "How would you rate your sleep quality?",
        options: ["Excellent", "Good", "Fair", "Poor"]
      },
      {
        id: "physical_activity",
        question: "How often do you engage in mental exercises?",
        options: ["Daily", "Weekly", "Monthly", "Never"]
      },
      {
        id: "social_interaction",
        question: "How often do you engage in social activities?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"]
      },
      {
        id: "mood_changes",
        question: "Have you noticed changes in your mood?",
        options: ["No changes", "Slight changes", "Moderate changes", "Significant changes"]
      },
      {
        id: "medications",
        question: "Are you taking any medications that might affect cognition?",
        options: ["None", "Sleep medications", "Anxiety/Depression meds", "Other"]
      },
      {
        id: "family_history",
        question: "Is there a family history of cognitive disorders?",
        options: ["No", "Yes - Parents", "Yes - Grandparents", "Unknown"]
      },
      {
        id: "lifestyle",
        question: "How would you rate your overall lifestyle habits?",
        options: ["Very healthy", "Moderately healthy", "Needs improvement", "Poor"]
      },
      {
        id: "stress_levels",
        question: "How would you rate your current stress levels?",
        options: ["Low", "Moderate", "High", "Very high"]
      }
    ]
  },
  {
    id: "mental",
    title: "Mental Health Screening",
    description: "Assessment of emotional well-being and mental health",
    icon: Smile,
    color: "text-green-500",
    questions: [
      {
        id: "personal_info",
        question: "Please specify your age group and current life situation.",
        options: ["18-25 Student", "26-35 Working", "36-50 Working", "50+ Working", "Retired", "Other"]
      },
      {
        id: "living_situation",
        question: "What is your current living situation?",
        options: ["Living alone", "With family", "With roommates", "With partner", "Other"]
      },
      {
        id: "mood_general",
        question: "How would you describe your general mood over the past two weeks?",
        options: ["Very positive", "Mostly positive", "Neutral", "Mostly negative", "Very negative"]
      },
      {
        id: "mood_fluctuation",
        question: "How much does your mood fluctuate during the day?",
        options: ["Minimal changes", "Slight changes", "Moderate changes", "Significant changes", "Extreme changes"]
      },
      {
        id: "anxiety_frequency",
        question: "How often do you feel nervous, anxious, or on edge?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "anxiety_physical",
        question: "Do you experience physical symptoms of anxiety (rapid heartbeat, sweating, trembling)?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
      },
      {
        id: "sleep_quality",
        question: "How would you rate your sleep quality?",
        options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
      },
      {
        id: "sleep_duration",
        question: "How many hours of sleep do you typically get per night?",
        options: ["Less than 5", "5-6", "7-8", "More than 8"]
      },
      {
        id: "appetite",
        question: "Have you noticed any changes in your appetite or eating habits?",
        options: ["No changes", "Slight decrease", "Significant decrease", "Slight increase", "Significant increase"]
      },
      {
        id: "energy",
        question: "How would you rate your energy levels throughout the day?",
        options: ["Very high", "High", "Moderate", "Low", "Very low"]
      },
      {
        id: "concentration",
        question: "How is your ability to concentrate on tasks?",
        options: ["Excellent", "Good", "Fair", "Poor", "Very poor"]
      },
      {
        id: "social_interest",
        question: "How interested are you in socializing with others?",
        options: ["Very interested", "Moderately interested", "Slightly interested", "Not interested"]
      },
      {
        id: "stress_management",
        question: "How well do you feel you manage stress?",
        options: ["Very well", "Well", "Moderately", "Poorly", "Very poorly"]
      },
      {
        id: "support_system",
        question: "Do you have a support system you can rely on?",
        options: ["Strong support", "Moderate support", "Limited support", "No support"]
      },
      {
        id: "work_impact",
        question: "How much do mental health concerns impact your work/studies?",
        options: ["No impact", "Slight impact", "Moderate impact", "Significant impact", "Severe impact"]
      },
      {
        id: "relationships_impact",
        question: "How much do mental health concerns affect your relationships?",
        options: ["No impact", "Slight impact", "Moderate impact", "Significant impact", "Severe impact"]
      },
      {
        id: "coping_mechanisms",
        question: "What coping mechanisms do you typically use when feeling stressed?",
        options: ["Exercise", "Meditation", "Talking to others", "Isolation", "Unhealthy habits"]
      },
      {
        id: "treatment_history",
        question: "Have you ever received mental health treatment?",
        options: ["Never", "Currently in treatment", "Past treatment", "Considering treatment"]
      },
      {
        id: "medication",
        question: "Are you currently taking any mental health medications?",
        options: ["No medications", "Antidepressants", "Anti-anxiety", "Multiple medications", "Other"]
      },
      {
        id: "future_outlook",
        question: "How do you feel about your future?",
        options: ["Very optimistic", "Somewhat optimistic", "Neutral", "Somewhat pessimistic", "Very pessimistic"]
      }
    ]
  },
  {
    id: "depression",
    title: "Depression Screening",
    description: "Comprehensive depression risk assessment",
    icon: AlertTriangle,
    color: "text-yellow-500",
    questions: [
      {
        id: "mood_frequency",
        question: "How often do you feel down, depressed, or hopeless?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "interest_loss",
        question: "How often do you have little interest or pleasure in doing things?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "sleep_changes",
        question: "Have you experienced changes in your sleep patterns?",
        options: ["No changes", "Sleeping less", "Sleeping more", "Irregular patterns"]
      },
      {
        id: "fatigue",
        question: "How often do you feel tired or have little energy?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "appetite_changes",
        question: "Have you noticed changes in your appetite?",
        options: ["No changes", "Decreased appetite", "Increased appetite", "Significant weight changes"]
      },
      {
        id: "self_worth",
        question: "How often do you feel bad about yourself or feel like a failure?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "concentration_difficulty",
        question: "Do you have trouble concentrating on things?",
        options: ["Never", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "psychomotor",
        question: "Have others noticed you moving or speaking more slowly or being more restless?",
        options: ["No", "Slightly", "Moderately", "Significantly"]
      },
      {
        id: "suicidal_thoughts",
        question: "Have you had thoughts that you would be better off not being alive?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "daily_activities",
        question: "How difficult is it to do your daily work or activities?",
        options: ["Not difficult", "Somewhat difficult", "Very difficult", "Extremely difficult"]
      },
      {
        id: "social_withdrawal",
        question: "Have you been withdrawing from social interactions?",
        options: ["Not at all", "Slightly", "Moderately", "Significantly"]
      },
      {
        id: "guilt",
        question: "Do you experience excessive guilt or self-blame?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "physical_symptoms",
        question: "Do you experience unexplained physical symptoms (headaches, body aches)?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "decision_making",
        question: "How difficult is it to make decisions?",
        options: ["Not difficult", "Somewhat difficult", "Very difficult", "Extremely difficult"]
      },
      {
        id: "hopelessness",
        question: "How often do you feel hopeless about the future?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "self_care",
        question: "How well are you maintaining self-care routines?",
        options: ["Very well", "Adequately", "With difficulty", "Poorly"]
      },
      {
        id: "emotional_support",
        question: "Do you have someone to talk to about your feelings?",
        options: ["Multiple people", "One person", "Limited support", "No one"]
      },
      {
        id: "treatment_history",
        question: "Have you ever been treated for depression?",
        options: ["Never", "Currently in treatment", "Past treatment", "Considering treatment"]
      },
      {
        id: "coping_strategies",
        question: "What strategies do you use to cope with depressive feelings?",
        options: ["Healthy activities", "Talking to others", "Isolation", "Unhealthy habits"]
      },
      {
        id: "life_changes",
        question: "Have you experienced any significant life changes recently?",
        options: ["None", "Minor changes", "Moderate changes", "Major changes"]
      }
    ]
  },
  {
    id: "vitals",
    title: "Vital Signs Assessment",
    description: "Track and monitor your vital health indicators",
    icon: Activity,
    color: "text-purple-500",
    questions: [
      {
        id: "personal_info",
        question: "Please specify your age and gender for accurate vital signs analysis.",
        options: ["18-30 Male", "18-30 Female", "31-50 Male", "31-50 Female", "51+ Male", "51+ Female"]
      },
      {
        id: "blood_pressure_systolic",
        question: "What is your typical systolic blood pressure (top number)?",
        options: ["Below 120", "120-129", "130-139", "140 or higher", "Don't Know"]
      },
      {
        id: "blood_pressure_diastolic",
        question: "What is your typical diastolic blood pressure (bottom number)?",
        options: ["Below 80", "80-89", "90 or higher", "Don't Know"]
      },
      {
        id: "heart_rate_rest",
        question: "What is your typical resting heart rate?",
        options: ["Below 60 bpm", "60-100 bpm", "Above 100 bpm", "Don't Know"]
      },
      {
        id: "heart_rate_exercise",
        question: "How does your heart rate respond to light exercise?",
        options: ["Normal increase", "Rapid increase", "Slow to increase", "Don't Know"]
      },
      {
        id: "temperature",
        question: "What is your typical body temperature?",
        options: ["97.8-99.1°F (36.5-37.3°C)", "Below normal", "Above normal", "Varies significantly"]
      },
      {
        id: "respiratory_rate",
        question: "How many breaths do you typically take per minute at rest?",
        options: ["12-16", "17-20", "More than 20", "Don't Know"]
      },
      {
        id: "oxygen_saturation",
        question: "If known, what is your typical oxygen saturation level?",
        options: ["95-100%", "90-94%", "Below 90%", "Don't Know"]
      },
      {
        id: "temperature_variations",
        question: "Do you experience unusual temperature variations?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "blood_pressure_consistency",
        question: "How consistent are your blood pressure readings?",
        options: ["Very consistent", "Somewhat variable", "Highly variable", "Don't monitor"]
      },
      {
        id: "pulse_quality",
        question: "How would you describe your pulse rhythm?",
        options: ["Regular", "Occasionally irregular", "Frequently irregular", "Don't Know"]
      },
      {
        id: "exercise_vitals",
        question: "How do your vital signs respond to exercise?",
        options: ["Normal response", "Excessive response", "Minimal response", "Don't monitor"]
      },
      {
        id: "recovery_time",
        question: "How long does it take your heart rate to return to normal after exercise?",
        options: ["1-3 minutes", "4-5 minutes", "More than 5 minutes", "Don't Know"]
      },
      {
        id: "monitoring_frequency",
        question: "How often do you monitor your vital signs?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"]
      },
      {
        id: "medication_effects",
        question: "Do any medications affect your vital signs?",
        options: ["No medications", "Minor effects", "Significant effects", "Don't Know"]
      },
      {
        id: "position_changes",
        question: "Do you experience dizziness with position changes?",
        options: ["Never", "Rarely", "Sometimes", "Often"]
      },
      {
        id: "vital_trends",
        question: "Have you noticed any trends in your vital signs over time?",
        options: ["Stable", "Improving", "Worsening", "No monitoring"]
      },
      {
        id: "stress_impact",
        question: "How does stress affect your vital signs?",
        options: ["No effect", "Mild effect", "Moderate effect", "Significant effect"]
      },
      {
        id: "sleep_impact",
        question: "How do your vital signs change during sleep?",
        options: ["Normal changes", "Significant changes", "Don't Know", "Use sleep tracker"]
      },
      {
        id: "lifestyle_impact",
        question: "How do lifestyle factors affect your vital signs?",
        options: ["Minimal impact", "Moderate impact", "Significant impact", "Don't monitor"]
      }
    ]
  }
];

type AssessmentWithResults = typeof assessmentTypes[0] & {
  results?: any;
  completed_at?: string;
  answers?: Record<string, string>;
};

export default function Assessments() {
  const { user } = useAuth();
  const { data: assessments, loading, error } = useRealtimeSubscription<Assessment>(
    'assessments',
    user?.id || ''
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentWithResults | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);

  const handleStartAssessment = (assessment: typeof assessmentTypes[0]) => {
    setSelectedAssessment(assessment);
    setCurrentStep(0);
    setAnswers({});
    setAssessmentResult(null);
    setShowAssessmentDialog(true);
  };

  const handleCancelAssessment = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    setShowAssessmentDialog(false);
    setSelectedAssessment(null);
    setCurrentStep(0);
    setAnswers({});
    setAssessmentResult(null);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (!selectedAssessment) return;
    if (currentStep < selectedAssessment.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssessment || !user) return;
    
    setIsSubmitting(true);
    try {
      // Process assessment with Gemini AI
      const result = await processMedicalAssessment({
        assessmentType: selectedAssessment.id,
        answers,
        userId: user.id
      });
      
      setAssessmentResult(result);
      
      // Save assessment to database
      const { data: savedAssessment, error: saveError } = await supabase
        .from('assessments')
        .insert({
          user_id: user.id,
          title: selectedAssessment.title,
          description: selectedAssessment.description,
          results: {
            summary: result.summary,
            recommendations: result.recommendations,
            risk_level: result.risk_level,
            follow_up_required: result.follow_up_required,
            answers: answers,
            assessment_type: selectedAssessment.id
          },
          status: 'completed',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        console.error("Error saving assessment:", saveError);
        throw saveError;
      }
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (assessmentResult: any, selectedAssessment: any, answers: Record<string, string>) => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let currentY = height - 50;
    const margin = 50;
    const lineHeight = 20;

    // Header
    page.drawText('ConsultAI Health Assessment Report', {
      x: margin,
      y: currentY,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    currentY -= lineHeight * 2;

    // Assessment Type
    page.drawText(`${selectedAssessment.title}`, {
      x: margin,
      y: currentY,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    currentY -= lineHeight * 1.5;

    // Date
    page.drawText(`Date: ${format(new Date(), 'PPP')}`, {
      x: margin,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    currentY -= lineHeight * 2;

    // Summary Section
    page.drawText('Assessment Summary', {
      x: margin,
      y: currentY,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    currentY -= lineHeight;

    const summaryLines = splitTextToLines(assessmentResult.summary, 80);
    summaryLines.forEach((line) => {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= lineHeight;
    });
    currentY -= lineHeight;

    // Risk Level
    page.drawText(`Risk Level: ${assessmentResult.risk_level.toUpperCase()}`, {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: assessmentResult.risk_level === 'high' ? rgb(0.8, 0.2, 0.2) :
            assessmentResult.risk_level === 'moderate' ? rgb(0.8, 0.6, 0.2) :
            rgb(0.2, 0.6, 0.2),
    });
    currentY -= lineHeight * 2;

    // Questions and Answers Section
    page.drawText('Assessment Details', {
      x: margin,
      y: currentY,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    currentY -= lineHeight * 1.5;

    selectedAssessment.questions.forEach((question: any) => {
      // Add new page if needed
      if (currentY < 100) {
        page = pdfDoc.addPage();
        currentY = height - 50;
      }

      // Question
      const questionLines = splitTextToLines(question.question, 80);
      questionLines.forEach((line) => {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= lineHeight;
      });

      // Answer
      const answer = answers[question.id] || 'Not answered';
      page.drawText(`Answer: ${answer}`, {
        x: margin + 20,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= lineHeight * 1.5;
    });

    // Add new page if needed
    if (currentY < 200) {
      page = pdfDoc.addPage();
      currentY = height - 50;
    }

    // Recommendations Section
    page.drawText('Recommendations', {
      x: margin,
      y: currentY,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    currentY -= lineHeight * 1.5;

    assessmentResult.recommendations.forEach((rec: string) => {
      const lines = splitTextToLines(rec, 80);
      lines.forEach((line) => {
        if (currentY < 100) {
          page = pdfDoc.addPage();
          currentY = height - 50;
        }
        page.drawText(`• ${line}`, {
          x: margin,
          y: currentY,
          size: 12,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        currentY -= lineHeight;
      });
      currentY -= lineHeight / 2;
    });

    // Footer on each page
    pdfDoc.getPages().forEach(p => {
      p.drawText('ConsultAI - Professional Health Assessment', {
        x: margin,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      p.drawText('This report is generated by AI and should be reviewed by a healthcare professional.', {
        x: margin,
        y: 30,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedAssessment.title.toLowerCase().replace(/\s+/g, '-')}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const splitTextToLines = (text: string, maxCharsPerLine: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading assessments: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Health Assessments</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment" disabled={!selectedAssessment}>
            Active Assessment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assessmentTypes.map((assessment) => (
              <Card key={assessment.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <assessment.icon className={`h-5 w-5 ${assessment.color}`} />
                    <CardTitle>{assessment.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{assessment.description}</p>
                  <Button 
                    onClick={() => handleStartAssessment(assessment)}
                    className="w-full"
                  >
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {assessments && assessments.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {assessments.map((assessment) => (
                    <li 
                      key={assessment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed {format(new Date(assessment.completed_at || ''), 'PPp')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                          {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const results = assessment.results as any;
                            const matchingAssessment = assessmentTypes.find(
                              type => type.id === results.assessment_type
                            );
                            if (matchingAssessment) {
                              setSelectedAssessment({
                                ...matchingAssessment,
                                results: results,
                                completed_at: assessment.completed_at,
                                answers: results.answers || {}
                              });
                              setAssessmentResult(results);
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Assessment Dialog */}
      <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedAssessment && (
                  <>
                    <selectedAssessment.icon className={`h-5 w-5 ${selectedAssessment.color}`} />
                    {selectedAssessment.title}
                  </>
                )}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelAssessment}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedAssessment && (
            <div className="mt-4 space-y-8">
              <div className="flex gap-8">
                <div className="w-1/4">
                  <Stepper
                    steps={selectedAssessment.questions.map((q, i) => ({
                      title: `Step ${i + 1}`,
                      description: q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question
                    }))}
                    currentStep={currentStep}
                  />
                </div>

                <div className="flex-1 space-y-6">
                  <Progress 
                    value={(currentStep + 1) / selectedAssessment.questions.length * 100} 
                    className="w-full"
                  />

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">
                      {selectedAssessment.questions[currentStep].question}
                    </h3>
                    
                    <RadioGroup
                      value={answers[selectedAssessment.questions[currentStep].id] || ''}
                      onValueChange={(value) => 
                        handleAnswer(selectedAssessment.questions[currentStep].id, value)
                      }
                      className="space-y-3"
                    >
                      {selectedAssessment.questions[currentStep].options.map((option) => (
                        <div key={option} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent">
                          <RadioGroupItem 
                            value={option} 
                            id={option}
                          />
                          <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    
                    {currentStep === selectedAssessment.questions.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Submit Assessment'
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={!answers[selectedAssessment.questions[currentStep].id]}
                        className="bg-primary"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this assessment? All progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Yes, Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assessment Results */}
      {assessmentResult && (
        <Dialog open={true} onOpenChange={() => setAssessmentResult(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAssessment && (
                  <>
                    <selectedAssessment.icon className={`h-5 w-5 ${selectedAssessment.color}`} />
                    <span>{selectedAssessment.title} Results</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Overall Status</h4>
                      <p className="mt-1">{assessmentResult.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Risk Level</h4>
                      <Badge 
                        className={cn(
                          "mt-1",
                          assessmentResult.risk_level === 'high' && "bg-red-500",
                          assessmentResult.risk_level === 'moderate' && "bg-yellow-500",
                          assessmentResult.risk_level === 'low' && "bg-green-500"
                        )}
                      >
                        {assessmentResult.risk_level.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questions and Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedAssessment?.questions.map((question, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <p className="font-medium mb-2">{question.question}</p>
                        <p className="text-muted-foreground">
                          Answer: {selectedAssessment.answers?.[question.id] || 'Not answered'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {assessmentResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAssessmentResult(null);
                    setSelectedAssessment(null);
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => generatePDF(assessmentResult, selectedAssessment, selectedAssessment.answers || {})}
                >
                  Download Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 