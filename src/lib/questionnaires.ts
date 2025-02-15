export interface QuestionnaireSection {
  id: string;
  title: string;
  priority: number;
  questions: Array<{
    id: string;
    question: string;
    type: "select" | "multiselect";
    options: string[];
    required?: boolean;
  }>;
}

export const sections: QuestionnaireSection[] = [
  {
    id: "general",
    title: "General Health Assessment",
    priority: 1,
    questions: [
      {
        id: "general_health",
        question: "How would you rate your overall health?",
        type: "select",
        options: ["Excellent", "Good", "Fair", "Poor"],
        required: true
      },
      {
        id: "exercise_frequency",
        question: "How often do you exercise?",
        type: "select",
        options: ["Daily", "A few times a week", "Once a week", "Rarely"],
      },
      {
        id: "diet_quality",
        question: "How would you describe your diet?",
        type: "select",
        options: ["Very healthy", "Healthy", "Average", "Unhealthy"],
      },
    ]
  },
  {
    id: "mental_health",
    title: "Mental Well-being",
    priority: 2,
    questions: [
      {
        id: "stress_level",
        question: "How often do you feel stressed?",
        type: "select",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
        required: true
      },
      {
        id: "sleep_quality",
        question: "How would you rate your sleep quality?",
        type: "select",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      {
        id: "mood_changes",
        question: "Have you noticed any significant mood changes recently?",
        type: "select",
        options: ["Yes", "No"],
      },
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle Habits",
    priority: 3,
    questions: [
      {
        id: "smoking_status",
        question: "Do you smoke?",
        type: "select",
        options: ["Yes, daily", "Occasionally", "I used to smoke", "Never"],
        required: true
      },
      {
        id: "alcohol_consumption",
        question: "How often do you consume alcohol?",
        type: "select",
        options: ["Daily", "A few times a week", "Rarely", "Never"],
      },
    ]
  }
];
