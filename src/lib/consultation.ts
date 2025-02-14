import { processMedicalChat } from "./gemini";

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface BasicDetails {
  name: string;
  weight: number;
  height: number;
  allergies: string[];
  conditions: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Question {
  id: string;
  question: string;
  type: "text" | "number" | "select" | "multiselect";
  options?: string[];
}

export const ALLERGY_OPTIONS = [
  "None",
  "Penicillin",
  "Aspirin",
  "Latex",
  "Pollen",
  "Dust",
  "Food Allergies",
  "Other"
];

export const CONDITION_OPTIONS = [
  "None",
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Other"
];

export const CHIEF_COMPLAINTS = [
  "Fever",
  "Cough",
  "Headache",
  "Chest Pain",
  "Abdominal Pain",
  "Breathing Difficulty",
  "Joint Pain",
  "Skin Issues",
  "Other"
];

export async function generateDynamicQuestions(complaint: string, context: string): Promise<Question[]> {
  try {
    const prompt = `Based on the patient's chief complaint of "${complaint}" and context: ${context}
    Generate 10 relevant multiple choice questions to assess the patient's condition.
    
    Return ONLY a JSON array with this exact structure (no markdown, no explanations, just the raw JSON array):
    [
      {
        "id": "q1",
        "question": "clear question text",
        "type": "select",
        "options": ["option1", "option2", "option3", "option4"]
      }
    ]

    Requirements:
    - Generate EXACTLY 10 questions, no more
    - Each question must have 4-5 clear options
    - Focus on symptoms, severity, triggers, and impact on daily life
    - Questions should be specific to ${complaint}
    - Make options clear and distinct
    - No duplicate questions or options
    - No markdown formatting in the response
    - Return only the JSON array`;

    const response = await processMedicalChat([{ role: "user", content: prompt }], context);
    
    // Clean up the response to ensure it's valid JSON
    const cleanJson = response.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const questions = JSON.parse(cleanJson) as Question[];
      
      // Validate the questions array
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }

      // Take only the first 10 questions
      const validatedQuestions = questions.slice(0, 10).map((q, index) => {
        // Ensure each question has required fields
        return {
          id: `q${index + 1}`,
          question: q.question || `Question ${index + 1}`,
          type: "select" as const,
          options: Array.isArray(q.options) ? q.options.slice(0, 5) : [
            "Yes",
            "No",
            "Sometimes",
            "Not sure"
          ]
        };
      });

      return validatedQuestions;
    } catch (parseError) {
      console.error("Error parsing questions JSON:", parseError);
      // Provide fallback questions
      return [
        {
          id: "q1",
          question: `How long have you been experiencing ${complaint}?`,
          type: "select",
          options: [
            "Less than 24 hours",
            "1-3 days",
            "4-7 days",
            "More than a week"
          ]
        },
        {
          id: "q2",
          question: `How severe is your ${complaint}?`,
          type: "select",
          options: [
            "Mild - barely noticeable",
            "Moderate - noticeable but manageable",
            "Severe - affects daily activities",
            "Very severe - needs immediate attention"
          ]
        },
        {
          id: "q3",
          question: "Does anything make it better or worse?",
          type: "select",
          options: [
            "Gets better with rest",
            "Gets worse with activity",
            "Varies throughout the day",
            "No clear pattern"
          ]
        }
      ];
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  // For demo purposes, return a mock address
  // In production, integrate with a geocoding service like Google Maps
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export function getStaticMapUrl(latitude: number, longitude: number): string {
  // For demo purposes, return a static map URL
  // In production, use a proper maps service API
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&key=YOUR_API_KEY`;
}

export function generateSummary(basicDetails: BasicDetails, chiefComplaint: string): string {
  return `Patient Information:
    Name: ${basicDetails.name}
    Weight: ${basicDetails.weight} kg
    Height: ${basicDetails.height} cm
    Allergies: ${basicDetails.allergies.join(", ")}
    Chronic Conditions: ${basicDetails.conditions.join(", ")}
    Chief Complaint: ${chiefComplaint}`;
} 