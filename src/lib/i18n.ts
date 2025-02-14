import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      select_language: 'Select Language',
      select_condition: 'Select Condition',
      
      // Medical
      medical_disclaimer: 'This is an AI-powered medical consultation system. The information provided is for general guidance only and should not be considered as professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.',
      share_location: 'Share Location',
      start_session: 'Start New Session',
      end_session: 'End Session',
      generate_report: 'Generate Report',
      generating_report: 'Generating Report...',
      complete_consultation: 'Complete Consultation & Generate Report',
      error_processing_message: 'I apologize, but I\'m having trouble processing your message. Could you please rephrase that?',
      error_generating_report: 'I apologize, but I encountered an error while generating your report. Please try again or contact support.',
      
      // Chat
      type_message: 'Type your message...',
      type_answer: 'Type your answer...',
      chat_greeting: 'Hello! I\'m your medical assistant. To provide you with the best care, I\'ll need your location first.',
      location_success: 'Thank you for sharing your location. Now, I\'ll ask you some basic questions about your health.',
      location_error: 'I couldn\'t access your location. Please try again or check your browser settings.',
      
      // Questionnaire
      invalid_answer: 'I\'m sorry, but that answer doesn\'t seem valid. Could you please try again?',
      basic_info_complete: 'Thank you for providing your basic information. Now, please tell me what brings you here today.',
      
      // Basic Information
      height_question: 'What is your height (in cm)?',
      weight_question: 'What is your weight (in kg)?',
      allergies_question: 'Do you have any known allergies? Please list them.',
      chronic_conditions_question: 'Do you have any chronic medical conditions?',
      
      // Lifestyle
      physical_activity_question: 'How would you describe your level of physical activity?',
      smoking_question: 'Do you smoke?',
      alcohol_question: 'How often do you consume alcohol?',
      
      // Report
      report_title: 'Medical Consultation Report',
      generated_on: 'Generated on {{date}}',
      preliminary_assessment: 'Preliminary Assessment',
      recommendations: 'Recommendations',
      medications: 'Medications',
      lifestyle_changes: 'Lifestyle Changes',
      follow_up: 'Follow-up Care',
      patient_info: 'Patient Information',
      vital_signs: 'Vital Signs',
      medical_history: 'Medical History',
      current_symptoms: 'Current Symptoms',
      diagnosis: 'Diagnosis',
      treatment_plan: 'Treatment Plan',
      emergency_instructions: 'Emergency Instructions',
    },
  },
  es: {
    translation: {
      // Common
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      select_language: 'Seleccionar Idioma',
      select_condition: 'Seleccionar Condición',
      
      // Medical
      medical_disclaimer: 'Este es un sistema de consulta médica impulsado por IA. La información proporcionada es solo para orientación general y no debe considerarse como consejo médico profesional. Consulte con un proveedor de atención médica calificado para un diagnóstico y tratamiento adecuados.',
      share_location: 'Compartir Ubicación',
      start_session: 'Iniciar Nueva Sesión',
      end_session: 'Finalizar Sesión',
      generate_report: 'Generar Informe',
      generating_report: 'Generando Informe...',
      complete_consultation: 'Completar Consulta y Generar Informe',
      error_processing_message: 'Lo siento, pero tengo problemas para procesar tu mensaje. ¿Podrías reformularlo?',
      error_generating_report: 'Lo siento, pero encontré un error al generar tu informe. Por favor, inténtalo de nuevo o contacta con soporte.',
      
      // Chat
      type_message: 'Escribe tu mensaje...',
      type_answer: 'Escribe tu respuesta...',
      chat_greeting: '¡Hola! Soy tu asistente médico. Para brindarte la mejor atención, primero necesito tu ubicación.',
      location_success: 'Gracias por compartir tu ubicación. Ahora, te haré algunas preguntas básicas sobre tu salud.',
      location_error: 'No pude acceder a tu ubicación. Por favor, inténtalo de nuevo o verifica la configuración de tu navegador.',
      
      // Questionnaire
      invalid_answer: 'Lo siento, pero esa respuesta no parece válida. ¿Podrías intentarlo de nuevo?',
      basic_info_complete: 'Gracias por proporcionar tu información básica. Ahora, cuéntame qué te trae por aquí hoy.',
      
      // Basic Information
      height_question: '¿Cuál es tu altura (en cm)?',
      weight_question: '¿Cuál es tu peso (en kg)?',
      allergies_question: '¿Tienes alguna alergia conocida? Por favor, enuméralas.',
      chronic_conditions_question: '¿Tienes alguna condición médica crónica?',
      
      // Lifestyle
      physical_activity_question: '¿Cómo describirías tu nivel de actividad física?',
      smoking_question: '¿Fumas?',
      alcohol_question: '¿Con qué frecuencia consumes alcohol?',
      
      // Report
      report_title: 'Informe de Consulta Médica',
      generated_on: 'Generado el {{date}}',
      preliminary_assessment: 'Evaluación Preliminar',
      recommendations: 'Recomendaciones',
      medications: 'Medicamentos',
      lifestyle_changes: 'Cambios en el Estilo de Vida',
      follow_up: 'Seguimiento',
      patient_info: 'Información del Paciente',
      vital_signs: 'Signos Vitales',
      medical_history: 'Historia Médica',
      current_symptoms: 'Síntomas Actuales',
      diagnosis: 'Diagnóstico',
      treatment_plan: 'Plan de Tratamiento',
      emergency_instructions: 'Instrucciones de Emergencia',
    },
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next; 