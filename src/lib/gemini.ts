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

export interface DietPlan {
  meals: Array<{
    type: string;
    suggestions: string[];
    timing: string;
    portions: string;
    notes: string;
  }>;
  guidelines: string[];
  restrictions: string[];
  hydration: string;
  supplements: Array<{
    name: string;
    dosage: string;
    timing: string;
  }>;
  duration: string;
  specialInstructions: string;
}

export interface ReportData {
  estimatedCondition: string;
  symptomsAnalysis: string;
  diagnosis: string;
  treatment: string[];
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
  recommendations: string[];
  precautions: string;
  followUp: string;
  dietPlan?: DietPlan;
  basicDetails?: {
    name: string;
    weight: number;
    height: number;
    allergies: string[];
    conditions: string[];
  };
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

export async function generateDietPlan(data: {
  condition: string;
  weight: number;
  height: number;
  allergies: string[];
  medications: Array<{ name: string; dosage: string }>;
}): Promise<DietPlan> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a comprehensive diet plan for a patient with the following details:
      
      Medical Condition: ${data.condition}
      Weight: ${data.weight} kg
      Height: ${data.height} cm
      Allergies: ${data.allergies.join(", ")}
      Current Medications: ${data.medications.map(m => `${m.name} (${m.dosage})`).join(", ")}
      
      Create a detailed diet plan that:
      1. Supports their medical condition
      2. Considers their allergies and medications
      3. Promotes overall health and recovery
      
      Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
      {
        "meals": [
          {
            "type": "breakfast/lunch/dinner/snack",
            "suggestions": ["list of food items"],
            "timing": "recommended timing",
            "portions": "portion sizes",
            "notes": "special instructions"
          }
        ],
        "guidelines": ["list of dietary guidelines"],
        "restrictions": ["list of foods to avoid"],
        "hydration": "daily water intake recommendation",
        "supplements": [
          {
            "name": "supplement name",
            "dosage": "recommended dosage",
            "timing": "when to take"
          }
        ],
        "duration": "how long to follow this diet",
        "specialInstructions": "any special considerations"
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanJson = text.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const dietPlan = JSON.parse(cleanJson) as DietPlan;
      return dietPlan;
    } catch (parseError) {
      console.error("Error parsing diet plan JSON:", parseError);
      throw new Error("Failed to generate diet plan");
    }
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw error;
  }
}

export async function generateMedicalReport(data: {
  basicDetails: any;
  chiefComplaint: string;
  dynamicQuestions: any[];
  answers: any[];
  location: any;
  context: string;
}): Promise<ReportData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on the following patient information, generate a comprehensive medical report:
      Patient Context: ${data.context}
      
      Chief Complaint: ${data.chiefComplaint}
      
      Patient Responses:
      ${data.answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n')}
      
      Generate a detailed medical report that includes disease estimation based on symptoms and appropriate medication recommendations.
      
      Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
      {
        "estimatedCondition": "detailed description of the estimated condition/disease based on symptoms",
        "symptomsAnalysis": "detailed analysis of the symptoms and their correlation",
        "diagnosis": "detailed diagnosis including possible differential diagnoses",
        "treatment": ["array of specific treatment steps"],
        "medications": [
          {
            "name": "specific medication name",
            "dosage": "precise dosage information",
            "duration": "specific duration of treatment",
            "instructions": "detailed instructions including timing and precautions"
          }
        ],
        "recommendations": ["array of detailed lifestyle and self-care recommendations"],
        "precautions": "specific precautions and warning signs to watch for",
        "followUp": "specific follow-up instructions including timeframe"
      }
      
      Important:
      1. Be specific with medication names and dosages
      2. Consider patient's allergies and existing conditions
      3. Include clear warning signs that require immediate medical attention
      4. Provide evidence-based recommendations
      5. Always include the standard medical disclaimer`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanJson = text.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const reportData = JSON.parse(cleanJson) as ReportData;
      
      // Validate the structure
      if (!reportData.estimatedCondition || !reportData.symptomsAnalysis || 
          !reportData.diagnosis || !Array.isArray(reportData.treatment) || 
          !Array.isArray(reportData.medications) || !Array.isArray(reportData.recommendations) || 
          !reportData.precautions || !reportData.followUp) {
        throw new Error("Invalid report structure");
      }
      
      // Generate diet plan based on the diagnosis
      const dietPlan = await generateDietPlan({
        condition: reportData.estimatedCondition,
        weight: data.basicDetails.weight,
        height: data.basicDetails.height,
        allergies: data.basicDetails.allergies || [],
        medications: reportData.medications
      });

      reportData.dietPlan = dietPlan;
      
      return reportData;
    } catch (parseError) {
      console.error("Error parsing report JSON:", parseError);
      // Provide a fallback structured response
      return {
        estimatedCondition: "Unable to estimate condition at this time",
        symptomsAnalysis: "Symptom analysis requires professional medical evaluation",
        diagnosis: "Unable to generate diagnosis at this time",
        treatment: ["Please consult with a healthcare provider for proper treatment"],
        medications: [{
          name: "No medications prescribed",
          dosage: "N/A",
          duration: "N/A",
          instructions: "Please consult with a healthcare provider"
        }],
        recommendations: ["Please consult with a healthcare provider for personalized recommendations"],
        precautions: "If symptoms worsen, seek immediate medical attention",
        followUp: "Schedule an appointment with a healthcare provider for proper evaluation",
        dietPlan: {
          meals: [],
          guidelines: [],
          restrictions: [],
          hydration: "",
          supplements: [],
          duration: "",
          specialInstructions: ""
        }
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