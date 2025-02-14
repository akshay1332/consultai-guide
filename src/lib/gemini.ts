import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export interface ReportData {
  diagnosis: string;
  treatment: string[];
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
  recommendations: string[];
  followUp: string;
}

interface MedicalReport {
  diagnosis: string;
  recommendations: string[];
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
  lifestyle_changes: string[];
  follow_up: string;
  conditions_analysis?: Array<{
    condition: string;
    severity: string;
    current_management: string;
    recommendations: string[];
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      notes: string;
    }>;
    lifestyle_modifications: string[];
    monitoring_plan: string;
  }>;
  risk_assessment?: {
    identified_risks: string[];
    preventive_measures: string[];
    warning_signs: string[];
  };
  treatment_plan?: {
    immediate_actions: string[];
    short_term_goals: string[];
    long_term_management: string[];
    lifestyle_modifications: string[];
  };
}

const MEDICAL_DISCLAIMER = `
Note: This is an AI-powered medical consultation system. The information provided is for general guidance only and should not be considered as professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
`;

interface ChatMessage {
  role: string;
  content: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface AssessmentRequest {
  assessmentType: string;
  answers: Record<string, string>;
  userId: string;
}

interface AssessmentResult {
  summary: string;
  recommendations: string[];
  risk_level: 'low' | 'moderate' | 'high';
  follow_up_required: boolean;
}

export async function processMedicalChat(messages: Array<{ role: string; content: string }>, context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      You are an AI medical assistant conducting a patient consultation.
      Previous conversation:
      ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Context: ${context || ''}
      
      Provide a natural, empathetic response and ask specific follow-up questions.
      Keep your response concise and focused.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing chat:", error);
    throw error;
  }
}

export async function generateMedicalReport(data: {
  basicDetails: any;
  chiefComplaint: string;
  dynamicQuestions: any[];
  location: any;
  context: string;
}): Promise<ReportData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on the following patient information, generate a medical report:
      ${data.context}
      
      Generate a detailed medical report with the following sections:
      1. Diagnosis: Provide a clear diagnosis based on symptoms and history
      2. Treatment Plan: List specific treatment steps
      3. Medications: List medications with dosage and instructions
      4. Lifestyle Recommendations: Provide actionable recommendations
      5. Follow-up Plan: Specify when to follow up
      
      Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
      {
        "diagnosis": "string describing the diagnosis",
        "treatment": ["array of treatment steps"],
        "medications": [
          {
            "name": "medication name",
            "dosage": "dosage information",
            "duration": "how long to take",
            "instructions": "how to take"
          }
        ],
        "recommendations": ["array of lifestyle recommendations"],
        "followUp": "follow up instructions"
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanJson = text.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const reportData = JSON.parse(cleanJson) as ReportData;
      
      // Validate the structure
      if (!reportData.diagnosis || !Array.isArray(reportData.treatment) || 
          !Array.isArray(reportData.medications) || !Array.isArray(reportData.recommendations) || 
          !reportData.followUp) {
        throw new Error("Invalid report structure");
      }
      
      return reportData;
    } catch (parseError) {
      console.error("Error parsing report JSON:", parseError);
      // Provide a fallback structured response
      return {
        diagnosis: "Unable to generate diagnosis at this time",
        treatment: ["Please consult with a healthcare provider for proper treatment"],
        medications: [{
          name: "No medications prescribed",
          dosage: "N/A",
          duration: "N/A",
          instructions: "Please consult with a healthcare provider"
        }],
        recommendations: ["Please consult with a healthcare provider for personalized recommendations"],
        followUp: "Schedule an appointment with a healthcare provider for proper evaluation"
      };
    }
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

export async function findNearbyFacilities(
  location: { latitude: number; longitude: number },
  type: "pharmacy" | "clinic" | "hospital"
) {
  const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  
  if (!GOOGLE_PLACES_API_KEY) {
    return [
      {
        name: `Sample ${type}`,
        address: "123 Medical St",
        distance: "0.5 km",
        open_now: true,
      },
    ];
  }

  try {
    const radius = 5000; // 5km radius
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      distance: `${(place.distance / 1000).toFixed(1)} km`,
      open_now: place.opening_hours?.open_now ?? null,
      rating: place.rating,
      place_id: place.place_id,
    }));
  } catch (error) {
    console.error("Error finding nearby facilities:", error);
    return [
      {
        name: `Sample ${type}`,
        address: "123 Medical St",
        distance: "0.5 km",
        open_now: true,
      },
    ];
  }
}

export async function processMedicalAssessment(request: AssessmentRequest): Promise<AssessmentResult> {
  const { assessmentType, answers, userId } = request;
  
  // Construct the prompt for Gemini
  const prompt = `Analyze the following medical assessment responses for a ${assessmentType} assessment:
  
${Object.entries(answers)
  .map(([question, answer]) => `- ${question}: ${answer}`)
  .join('\n')}

Please provide:
1. A summary of the assessment
2. Key recommendations
3. Risk level assessment
4. Whether follow-up with a healthcare provider is recommended

Format the response in a structured way.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the AI response into structured format
    // This is a simplified example - you would need to properly parse the AI response
    return {
      summary: text.split('Summary:')[1]?.split('Recommendations:')[0]?.trim() || '',
      recommendations: text
        .split('Recommendations:')[1]
        ?.split('Risk Level:')[0]
        ?.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^-\s*/, '')) || [],
      risk_level: (text.toLowerCase().includes('high risk') ? 'high' : 
                  text.toLowerCase().includes('moderate risk') ? 'moderate' : 'low') as 'low' | 'moderate' | 'high',
      follow_up_required: text.toLowerCase().includes('follow-up recommended') || 
                         text.toLowerCase().includes('consult healthcare provider')
    };
  } catch (error) {
    console.error('Error processing medical assessment:', error);
    throw new Error('Failed to process medical assessment');
  }
} 