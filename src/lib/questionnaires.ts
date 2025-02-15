export interface Question {
  id: string;
  question: string;
  type: 'text' | 'multiselect' | 'select' | 'number' | 'date' | 'scale';
  options?: string[];
  required?: boolean;
  validation?: (value: any) => boolean;
  followUp?: Question[];
  condition?: {
    field: string;
    value: any;
  };
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  priority: number;
  isEmergencySection?: boolean;
}

export interface QuestionnaireResponse {
  sectionId: string;
  answers: Record<string, any>;
  timestamp: Date;
}

// Emergency assessment questions to identify critical conditions
const emergencyAssessment: Question[] = [
  {
    id: "chest_pain",
    question: "Are you experiencing severe chest pain or pressure?",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  },
  {
    id: "breathing_difficulty",
    question: "Are you having severe difficulty breathing?",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  },
  {
    id: "consciousness",
    question: "Have you experienced any loss of consciousness?",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  }
];

export const initialQuestionnaire: QuestionnaireSection[] = [
  {
    id: "emergency_triage",
    title: "Emergency Assessment",
    description: "Quick assessment of urgent medical conditions",
    questions: emergencyAssessment,
    priority: 0,
    isEmergencySection: true
  },
  {
    id: "demographics",
    title: "Patient Demographics & Basic Information",
    description: "Essential personal and contact information",
    priority: 1,
    questions: [
      {
        id: "name",
        question: "What is your full name?",
        type: "text",
        required: true,
      },
      {
        id: "dob",
        question: "What is your date of birth?",
        type: "date",
        required: true,
      },
      {
        id: "gender",
        question: "What is your gender?",
        type: "select",
        options: ["Male", "Female", "Other", "Prefer not to say"],
        required: true,
      },
      {
        id: "height",
        question: "What is your height (in cm)?",
        type: "number",
        required: true,
      },
      {
        id: "weight",
        question: "What is your weight (in kg)?",
        type: "number",
        required: true,
      },
      {
        id: "ethnicity",
        question: "Which of these best describes your family's background? This helps me give you better care.",
        type: "select",
        options: [
          "Asian (from countries like China, Japan, India)",
          "Black or African",
          "Hispanic or Latino",
          "White or European",
          "Mixed (more than one background)",
          "I'd rather not say"
        ],
      },
      {
        id: "occupation",
        question: "What is your occupation and typical work hours?",
        type: "text",
        required: true,
      }
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Health Habits",
    questions: [
      {
        id: "physical_activity",
        question: "How would you describe your level of physical activity?",
        type: "select",
        options: ["Sedentary", "Light", "Moderate", "High intensity"],
        required: true,
      },
      {
        id: "diet",
        question: "Please describe your diet and eating habits:",
        type: "multiselect",
        options: [
          "Regular balanced diet",
          "Vegetarian",
          "Vegan",
          "High-protein",
          "Low-carb",
          "Other dietary restrictions"
        ],
      },
      {
        id: "sleep",
        question: "How many hours of sleep do you typically get per night?",
        type: "select",
        options: ["Less than 6", "6-7", "7-8", "8-9", "More than 9"],
        required: true,
      },
      {
        id: "substances",
        question: "Do you use any of the following substances?",
        type: "multiselect",
        options: [
          "Tobacco/Smoking",
          "Alcohol",
          "Recreational drugs",
          "None"
        ],
      }
    ]
  },
  {
    id: "chief_complaint",
    title: "Primary Health Concern",
    description: "Main reason for consultation",
    priority: 2,
    questions: [
      {
        id: "main_concern",
        question: "What is your main symptom or health concern today? Please describe it in your own words.",
        type: "text",
        required: true,
      },
      {
        id: "symptom_onset",
        question: "When did you first notice this symptom/concern?",
        type: "text",
        required: true,
      },
      {
        id: "symptom_pattern",
        question: "Is the symptom continuous or does it come and go? Please describe any patterns.",
        type: "text",
        required: true,
      },
      {
        id: "symptom_severity",
        question: "On a scale from 1-10, how would you rate the severity of your symptoms?",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        required: true,
      }
    ]
  },
  {
    id: "medical_history",
    title: "Past Medical History",
    description: "Previous health conditions and treatments",
    priority: 3,
    questions: [
      {
        id: "chronic_conditions",
        question: "Do you have any of the following chronic medical conditions? (Select all that apply)",
        type: "multiselect",
        options: [
          "Diabetes",
          "Hypertension (High Blood Pressure)",
          "Heart Disease",
          "Asthma/Respiratory conditions",
          "Thyroid disorders",
          "Autoimmune conditions",
          "Cancer",
          "Mental health conditions",
          "None"
        ],
      },
      {
        id: "surgeries",
        question: "Have you had any previous surgeries or hospitalizations?",
        type: "text",
      },
      {
        id: "medications",
        question: "Please list any current medications, including dosage and frequency:",
        type: "text",
      },
      {
        id: "allergies",
        question: "Do you have any allergies to medications, foods, or environmental factors?",
        type: "text",
      }
    ]
  },
  {
    id: "family_history",
    title: "Family History",
    description: "Health conditions in family members",
    priority: 4,
    questions: [
      {
        id: "family_conditions",
        question: "Do any of these conditions run in your family? (Select all that apply)",
        type: "multiselect",
        options: [
          "Heart disease",
          "Diabetes",
          "Cancer",
          "High blood pressure",
          "Stroke",
          "Mental health conditions",
          "Autoimmune diseases",
          "Respiratory conditions",
          "Kidney diseases",
          "Liver diseases",
          "Neurological disorders",
          "Blood disorders",
          "None"
        ],
      },
      {
        id: "family_details",
        question: "For the conditions you selected, please specify which family members are affected (e.g., mother, father, sibling):",
        type: "text",
        required: true,
      },
      {
        id: "age_of_onset",
        question: "At what age did these conditions start in your family members?",
        type: "text",
        required: true,
      }
    ]
  },
  {
    id: "symptom_details",
    title: "Detailed Symptom Assessment",
    description: "Comprehensive evaluation of symptoms",
    priority: 5,
    questions: [
      {
        id: "symptom_frequency",
        question: "How often do you experience your main symptoms?",
        type: "select",
        options: [
          "Multiple times per day",
          "Daily",
          "Several times a week",
          "Weekly",
          "Monthly",
          "Occasionally"
        ],
        required: true,
      },
      {
        id: "symptom_triggers",
        question: "What triggers or worsens your symptoms? (Select all that apply)",
        type: "multiselect",
        options: [
          "Physical activity",
          "Stress or anxiety",
          "Certain foods",
          "Weather changes",
          "Time of day",
          "After meals",
          "During sleep",
          "Work activities",
          "None identified",
          "Other"
        ],
      },
      {
        id: "relief_factors",
        question: "What helps relieve your symptoms? (Select all that apply)",
        type: "multiselect",
        options: [
          "Rest",
          "Over-the-counter medications",
          "Prescription medications",
          "Exercise",
          "Heat therapy",
          "Cold therapy",
          "Dietary changes",
          "Relaxation techniques",
          "Nothing helps",
          "Other"
        ],
      }
    ]
  },
  {
    id: "treatment_history",
    title: "Previous Treatments",
    description: "Past treatments and their effectiveness",
    priority: 6,
    questions: [
      {
        id: "previous_treatments",
        question: "Which treatments have you tried before? (Select all that apply)",
        type: "multiselect",
        options: [
          "Prescription medications",
          "Over-the-counter medications",
          "Physical therapy",
          "Surgery",
          "Alternative medicine",
          "Lifestyle changes",
          "Dietary modifications",
          "Mental health therapy",
          "None",
          "Other"
        ],
      },
      {
        id: "treatment_effectiveness",
        question: "How effective were the previous treatments?",
        type: "select",
        options: [
          "Very effective",
          "Somewhat effective",
          "Slightly effective",
          "Not effective",
          "Made symptoms worse",
          "Not applicable"
        ],
      }
    ]
  },
  {
    id: "additional_notes",
    title: "Additional Information",
    description: "Other relevant health information",
    priority: 7,
    questions: [
      {
        id: "patient_notes",
        question: "Please provide any additional information or concerns you'd like to share with the doctor:",
        type: "text",
        required: true,
      }
    ]
  },
  {
    id: "review_systems",
    title: "Review of Systems",
    description: "Systematic review of body systems",
    priority: 8,
    questions: [
      {
        id: "general_symptoms",
        question: "Are you experiencing any of these general symptoms? (Select all that apply)",
        type: "multiselect",
        options: [
          "Fever",
          "Fatigue",
          "Unexplained weight changes",
          "Night sweats",
          "Loss of appetite",
          "None"
        ],
      },
      {
        id: "pain_assessment",
        question: "If you're experiencing pain, please describe its location and nature:",
        type: "text",
      },
      {
        id: "additional_symptoms",
        question: "Are you experiencing any other symptoms or concerns you'd like to mention?",
        type: "text",
      }
    ]
  }
];

export function validateAnswer(question: Question, answer: any): boolean {
  if (question.required && !answer) return false;
  
  switch (question.type) {
    case 'number':
      return !isNaN(Number(answer));
    case 'date':
      return !isNaN(Date.parse(answer));
    case 'scale':
      const num = Number(answer);
      return !isNaN(num) && num >= 1 && num <= 10;
    default:
      if (question.validation) return question.validation(answer);
      return true;
  }
}

export function getNextQuestion(
  section: QuestionnaireSection,
  currentIndex: number,
  answers: Record<string, any>
): { question: Question; sectionComplete: boolean; isEmergency?: boolean } | null {
  if (currentIndex >= section.questions.length) {
    return null;
  }

  const question = section.questions[currentIndex];
  
  // Check if this question should be skipped based on previous answers
  if (question.condition) {
    const conditionMet = answers[question.condition.field] === question.condition.value;
    if (!conditionMet) {
      return getNextQuestion(section, currentIndex + 1, answers);
    }
  }

  const sectionComplete = currentIndex === section.questions.length - 1;
  const isEmergency = section.isEmergencySection && 
    answers[question.id] === "Yes";

  return { question, sectionComplete, isEmergency };
}

export function generateSummary(responses: QuestionnaireResponse[]): string {
  let summary = "Medical Consultation Summary:\n\n";

  // Sort responses by section priority
  const sortedResponses = responses.sort((a, b) => {
    const sectionA = initialQuestionnaire.find(s => s.id === a.sectionId);
    const sectionB = initialQuestionnaire.find(s => s.id === b.sectionId);
    return (sectionA?.priority || 0) - (sectionB?.priority || 0);
  });

  sortedResponses.forEach(response => {
    const section = initialQuestionnaire.find(s => s.id === response.sectionId);
    if (section) {
      summary += `${section.title}:\n`;
      Object.entries(response.answers).forEach(([questionId, answer]) => {
        const question = section.questions.find(q => q.id === questionId);
        if (question) {
          const formattedAnswer = Array.isArray(answer) ? answer.join(", ") : answer;
          summary += `- ${question.question}: ${formattedAnswer}\n`;
        }
      });
      summary += "\n";
    }
  });

  return summary;
}

// Add new helper functions for medical assessment
export function assessSymptomSeverity(responses: QuestionnaireResponse[]): {
  severity: 'low' | 'medium' | 'high' | 'emergency';
  criticalSymptoms: string[];
} {
  const criticalSymptoms: string[] = [];
  let severityScore = 0;

  responses.forEach(response => {
    const section = initialQuestionnaire.find(s => s.id === response.sectionId);
    if (section?.isEmergencySection) {
      Object.entries(response.answers).forEach(([questionId, answer]) => {
        if (answer === "Yes") {
          const question = section.questions.find(q => q.id === questionId);
          if (question) {
            criticalSymptoms.push(question.question);
            severityScore += 3;
          }
        }
      });
    }
  });

  if (severityScore >= 3) return { severity: 'emergency', criticalSymptoms };
  if (severityScore >= 2) return { severity: 'high', criticalSymptoms };
  if (severityScore >= 1) return { severity: 'medium', criticalSymptoms };
  return { severity: 'low', criticalSymptoms };
} 