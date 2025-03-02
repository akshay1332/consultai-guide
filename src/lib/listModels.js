import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your API key
const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Make a request to list available models
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + API_KEY);
    const data = await response.json();
    
    console.log('Available models:');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

// Call the function
listModels(); 