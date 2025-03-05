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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a specialized medical nutrition AI. Your task is to generate a diet plan in JSON format.
    
Patient Details:
Medical Condition: ${data.condition}
Weight: ${data.weight} kg
Height: ${data.height} cm
Allergies: ${data.allergies.join(", ") || "None reported"}
Current Medications: ${data.medications.map(m => `${m.name} (${m.dosage})`).join(", ") || "None"}

IMPORTANT: You must ONLY return a valid JSON object. Do not include any explanatory text, markdown, or code blocks.
The response must start with '{' and end with '}' and follow this EXACT structure:

{
  "meals": [
    {
      "type": "breakfast",
      "suggestions": ["Oatmeal (100g) with berries (50g)", "Greek yogurt (150g) with honey (15g)"],
      "timing": "7:00 AM - 8:00 AM",
      "portions": "Total meal: 300-350 calories",
      "notes": "Cook oatmeal with low-fat milk. Add cinnamon for blood sugar control."
    },
    {
      "type": "lunch",
      "suggestions": ["Grilled chicken breast (150g)", "Brown rice (100g)", "Steamed vegetables (200g)"],
      "timing": "12:00 PM - 1:00 PM",
      "portions": "Total meal: 400-450 calories",
      "notes": "Use olive oil for cooking. Steam vegetables to retain nutrients."
    }
  ],
  "guidelines": [
    "Eat every 3-4 hours to maintain stable blood sugar",
    "Choose whole grains over refined carbohydrates"
  ],
  "restrictions": [
    "Avoid processed sugars due to condition",
    "Limit sodium intake to 2000mg per day"
  ],
  "hydration": "Drink 8-10 glasses (2.5-3L) of water daily, spaced throughout the day",
  "supplements": [
    {
      "name": "Vitamin D3 (Nature Made brand)",
      "dosage": "2000 IU",
      "timing": "With breakfast"
    }
  ],
  "duration": "Follow this plan for 4 weeks, then reassess",
  "specialInstructions": "Take medications 1 hour before meals. Avoid grapefruit due to medication interactions."
}

The plan should be specifically tailored to the patient's condition, consider medication interactions, and account for allergies.
Include at least 3 meals and 2 snacks in the meals array.
Each meal should have 3-5 specific food suggestions with exact portions.
All measurements should be in metric units (g, ml, mg).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    let cleanJson = text.trim();
    
    // Remove any potential markdown or text before the JSON
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Invalid response format: No JSON object found");
    }
    
    cleanJson = cleanJson.slice(jsonStart, jsonEnd);
    
    try {
      const dietPlan = JSON.parse(cleanJson) as DietPlan;
      
      // Validate the structure
      if (!dietPlan.meals || !Array.isArray(dietPlan.meals) || dietPlan.meals.length === 0) {
        throw new Error("Invalid diet plan: missing or empty meals array");
      }
      
      if (!dietPlan.guidelines || !Array.isArray(dietPlan.guidelines)) {
        throw new Error("Invalid diet plan: missing guidelines");
      }
      
      if (!dietPlan.restrictions || !Array.isArray(dietPlan.restrictions)) {
        throw new Error("Invalid diet plan: missing restrictions");
      }
      
      if (!dietPlan.hydration) {
        throw new Error("Invalid diet plan: missing hydration information");
      }
      
      return dietPlan;
    } catch (parseError) {
      console.error("Error parsing diet plan JSON:", parseError);
      // Provide a fallback diet plan
      return {
        meals: [
          {
            type: "breakfast",
            suggestions: ["Oatmeal with fruits", "Whole grain toast with eggs"],
            timing: "7:00 AM - 8:00 AM",
            portions: "Standard serving sizes",
            notes: "Adjust portions based on hunger levels"
          }
        ],
        guidelines: ["Eat balanced meals", "Stay hydrated"],
        restrictions: ["Follow general dietary guidelines"],
        hydration: "Drink 8 glasses of water daily",
        supplements: [],
        duration: "Consult with healthcare provider",
        specialInstructions: "Please consult with a healthcare provider for personalized advice"
      };
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Based on the following patient information, generate a comprehensive medical report:
      Patient Context: ${data.context}
      
      Chief Complaint: ${data.chiefComplaint}
      
      Patient Responses:
      ${data.answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n')}
      
      Generate a detailed medical report that includes disease estimation based on symptoms and appropriate medication recommendations.
      
      IMPORTANT: You MUST return a valid JSON object with this exact structure. Do not include any explanatory text, markdown, or code blocks.
      The response must start with '{' and end with '}' and follow this EXACT structure:
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
      
      CRITICAL REQUIREMENTS:
      1. Be specific with medication names and dosages - NEVER return "No medications prescribed" or similar generic responses
      2. Always provide at least one medication recommendation with specific details
      3. Always provide a specific estimated condition based on the symptoms, not a generic response
      4. Always provide specific treatment steps, not generic advice to "consult a healthcare provider"
      5. Format your response as a valid JSON object only - no additional text before or after the JSON
      6. Do not use markdown formatting or code blocks in your response`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    let cleanJson = text.trim();
    
    // Remove any potential markdown or text before/after the JSON
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Invalid response format: No JSON object found");
    }
    
    cleanJson = cleanJson.slice(jsonStart, jsonEnd);
    
    try {
      const reportData = JSON.parse(cleanJson) as ReportData;
      
      // Validate the structure and ensure we have meaningful content
      if (!reportData.estimatedCondition || reportData.estimatedCondition.includes("Unable to estimate") || 
          reportData.estimatedCondition.includes("consult with a healthcare provider")) {
        reportData.estimatedCondition = `Possible ${data.chiefComplaint}-related condition based on reported symptoms`;
      }
      
      if (!reportData.symptomsAnalysis || reportData.symptomsAnalysis.includes("requires professional medical evaluation")) {
        reportData.symptomsAnalysis = `The reported symptoms of ${data.chiefComplaint} suggest potential underlying issues that should be evaluated by a healthcare professional.`;
      }
      
      if (!reportData.diagnosis || reportData.diagnosis.includes("Unable to generate diagnosis")) {
        reportData.diagnosis = `Preliminary assessment suggests symptoms consistent with ${data.chiefComplaint}-related conditions`;
      }
      
      if (!Array.isArray(reportData.treatment) || reportData.treatment.length === 0 || 
          reportData.treatment[0].includes("consult with a healthcare provider")) {
        reportData.treatment = [
          `Rest and monitor ${data.chiefComplaint} symptoms`,
          "Stay hydrated and maintain a balanced diet",
          "Consider over-the-counter remedies appropriate for symptoms",
          "Seek professional medical evaluation if symptoms persist or worsen"
        ];
      }
      
      if (!Array.isArray(reportData.medications) || reportData.medications.length === 0 || 
          reportData.medications[0].name.includes("No medications")) {
        
        // Add default medication based on chief complaint
        let defaultMedication = {
          name: "Acetaminophen (Tylenol)",
          dosage: "500-1000mg",
          duration: "As needed for symptom relief, not to exceed 3000mg per day",
          instructions: "Take with food. Do not combine with other medications containing acetaminophen."
        };
        
        if (data.chiefComplaint.toLowerCase().includes("pain")) {
          defaultMedication = {
            name: "Ibuprofen (Advil, Motrin)",
            dosage: "400-600mg",
            duration: "Every 6-8 hours as needed for pain, not to exceed 3200mg per day",
            instructions: "Take with food to reduce stomach irritation. Not recommended for those with kidney problems or certain heart conditions."
          };
        } else if (data.chiefComplaint.toLowerCase().includes("cough") || 
                  data.chiefComplaint.toLowerCase().includes("cold") || 
                  data.chiefComplaint.toLowerCase().includes("flu")) {
          defaultMedication = {
            name: "Dextromethorphan (Robitussin DM)",
            dosage: "10-20mg",
            duration: "Every 4 hours as needed, not to exceed 120mg per day",
            instructions: "May cause drowsiness. Drink plenty of water. Avoid alcohol."
          };
        } else if (data.chiefComplaint.toLowerCase().includes("allergy") || 
                  data.chiefComplaint.toLowerCase().includes("itch")) {
          defaultMedication = {
            name: "Cetirizine (Zyrtec)",
            dosage: "10mg",
            duration: "Once daily",
            instructions: "May cause drowsiness. Take at the same time each day for best results."
          };
        }
        
        reportData.medications = [defaultMedication];
      }
      
      if (!Array.isArray(reportData.recommendations) || reportData.recommendations.length === 0 || 
          reportData.recommendations[0].includes("consult with a healthcare provider")) {
        reportData.recommendations = [
          "Maintain adequate rest and sleep",
          "Stay hydrated with at least 8 glasses of water daily",
          "Eat a balanced diet rich in fruits and vegetables",
          "Avoid triggers that may worsen symptoms"
        ];
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
      
      // Create a structured fallback response that's more specific than the generic one
      return {
        estimatedCondition: `Possible ${data.chiefComplaint}-related condition based on reported symptoms`,
        symptomsAnalysis: `The reported symptoms of ${data.chiefComplaint} suggest potential underlying issues that should be evaluated by a healthcare professional.`,
        diagnosis: `Preliminary assessment suggests symptoms consistent with ${data.chiefComplaint}-related conditions`,
        treatment: [
          `Rest and monitor ${data.chiefComplaint} symptoms`,
          "Stay hydrated and maintain a balanced diet",
          "Consider over-the-counter remedies appropriate for symptoms",
          "Seek professional medical evaluation if symptoms persist or worsen"
        ],
        medications: [{
          name: "Acetaminophen (Tylenol)",
          dosage: "500-1000mg",
          duration: "As needed for symptom relief, not to exceed 3000mg per day",
          instructions: "Take with food. Do not combine with other medications containing acetaminophen."
        }],
        recommendations: [
          "Maintain adequate rest and sleep",
          "Stay hydrated with at least 8 glasses of water daily",
          "Eat a balanced diet rich in fruits and vegetables",
          "Avoid triggers that may worsen symptoms"
        ],
        precautions: `If ${data.chiefComplaint} symptoms worsen, or if you develop fever, severe pain, or difficulty breathing, seek immediate medical attention.`,
        followUp: "Schedule an appointment with your primary care physician within the next 7 days if symptoms persist.",
        dietPlan: {
          meals: [
            {
              type: "breakfast",
              suggestions: ["Oatmeal with fruits", "Whole grain toast with eggs"],
              timing: "7:00 AM - 8:00 AM",
              portions: "Standard serving sizes",
              notes: "Adjust portions based on hunger levels"
            },
            {
              type: "lunch",
              suggestions: ["Grilled chicken with vegetables", "Vegetable soup with whole grain bread"],
              timing: "12:00 PM - 1:00 PM",
              portions: "Standard serving sizes",
              notes: "Focus on lean proteins and vegetables"
            },
            {
              type: "dinner",
              suggestions: ["Baked fish with quinoa", "Stir-fried vegetables with tofu"],
              timing: "6:00 PM - 7:00 PM",
              portions: "Standard serving sizes",
              notes: "Light dinner to aid digestion before sleep"
            }
          ],
          guidelines: ["Eat balanced meals", "Stay hydrated", "Limit processed foods"],
          restrictions: ["Avoid excessive caffeine", "Limit alcohol consumption"],
          hydration: "Drink 8-10 glasses of water daily",
          supplements: [],
          duration: "Follow this plan until symptoms improve",
          specialInstructions: "Adjust diet based on individual tolerance and symptom response"
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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