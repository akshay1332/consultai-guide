export interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect";
  options?: string[];
  required?: boolean;
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  questions: Question[];
  priority: number;
}

export const sections: QuestionnaireSection[] = [
  {
    id: "general",
    title: "General Health Assessment",
    priority: 1,
    questions: [
      {
        id: "name",
        question: "What is your full name?",
        type: "text",
        required: true,
      },
      {
        id: "age",
        question: "How old are you?",
        type: "text",
        required: true,
      },
      {
        id: "gender",
        question: "What is your gender?",
        type: "select",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      {
        id: "location",
        question: "Where are you located?",
        type: "text",
        required: true,
      },
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle Information",
    priority: 2,
    questions: [
      {
        id: "exercise",
        question: "How often do you exercise?",
        type: "select",
        options: ["Daily", "Few times a week", "Rarely", "Never"],
      },
      {
        id: "diet",
        question: "Describe your diet",
        type: "multiselect",
        options: ["Vegetarian", "Vegan", "Paleo", "Ketogenic", "Mediterranean", "Other"],
      },
      {
        id: "sleep",
        question: "How many hours of sleep do you get on average?",
        type: "text",
      },
    ]
  },
  {
    id: "medical_history",
    title: "Medical History",
    priority: 3,
    questions: [
      {
        id: "conditions",
        question: "Do you have any pre-existing medical conditions?",
        type: "multiselect",
        options: ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "Arthritis", "None"],
      },
      {
        id: "allergies",
        question: "Do you have any allergies?",
        type: "multiselect",
        options: ["Pollen", "Dust", "Food", "Medications", "None"],
      },
      {
        id: "medications",
        question: "Are you currently taking any medications?",
        type: "text",
      },
    ]
  },
  {
    id: "symptoms",
    title: "Current Symptoms",
    priority: 4,
    questions: [
      {
        id: "symptom_fever",
        question: "Do you have a fever?",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        id: "symptom_cough",
        question: "Do you have a cough?",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        id: "symptom_fatigue",
        question: "Do you feel unusually tired or fatigued?",
        type: "select",
        options: ["Yes", "No"],
      },
    ]
  }
];

export const findSectionById = (id: string) => {
  return sections.find(section => section.id === id);
};

export const findQuestionById = (sectionId: string, questionId: string) => {
  const section = findSectionById(sectionId);
  if (!section) return undefined;
  return section.questions.find(question => question.id === questionId);
};
