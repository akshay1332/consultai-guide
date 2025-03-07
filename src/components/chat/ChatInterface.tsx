import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MapPin, User, Bot, X, Clock, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { generateMedicalReport } from "@/lib/gemini";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Location,
  BasicDetails,
  ChatMessage,
  Question,
  ALLERGY_OPTIONS,
  CONDITION_OPTIONS,
  CHIEF_COMPLAINTS,
  generateDynamicQuestions,
  reverseGeocode,
  getStaticMapUrl,
  generateSummary,
} from "@/lib/consultation";
import { storeReport, downloadReport } from "@/lib/reports";
import { DietPlanCard } from "@/components/ui/DietPlanCard";

interface ChatInterfaceProps {
  sessionId: string;
  onSessionComplete: (sessionId: string, reportData: any) => void;
  onCloseSession: () => void;
}

export default function ChatInterface({ sessionId, onSessionComplete, onCloseSession }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
  const [currentStage, setCurrentStage] = useState<string>("location");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReport, setShowReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      role: "assistant",
      content: "👋 Welcome to ConsultAI! Let's start by getting your location to provide relevant medical facilities near you.",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Replace the existing auto-scroll effect with this improved version
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          const coords: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address
          };
          setLocation(coords);
          setCurrentStage("basic_details");
          
          addMessage({
            role: "assistant",
            content: "Great! Now, let's get some basic information about you. What's your full name?",
            timestamp: new Date(),
          });
          setProgress(20);
        },
        (error) => {
          addMessage({
            role: "assistant",
            content: "Unable to get your location. Please enter your address manually.",
            timestamp: new Date(),
          });
        }
      );
    }
  };

  const handleBasicDetailsInput = (field: string, value: string | string[]) => {
    // Add user's response as a message
    if (field !== "allergies" && field !== "conditions") {
      addMessage({
        role: "user",
        content: Array.isArray(value) ? value.join(", ") : value,
        timestamp: new Date(),
      });
    }

    setBasicDetails(prev => ({
      ...prev!,
      [field]: value
    }));

    // Move to next field or stage
    const fields = ["name", "weight", "height", "allergies", "conditions"];
    const currentIndex = fields.indexOf(field);
    
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      const questions = {
        weight: "What is your weight in kg?",
        height: "What is your height in cm?",
        allergies: "Do you have any allergies? (Select all that apply)",
        conditions: "Do you have any chronic conditions? (Select all that apply)"
      };
      
      addMessage({
        role: "assistant",
        content: questions[nextField as keyof typeof questions],
        timestamp: new Date(),
      });
    } else {
      setCurrentStage("chief_complaint");
      addMessage({
        role: "assistant",
        content: "What is your main medical concern today?",
        timestamp: new Date(),
      });
      setProgress(40);
    }
  };

  const handleMultiSelect = (field: "allergies" | "conditions", values: string[]) => {
    setSelectedOptions(values);
    if (values.includes("None")) {
      values = ["None"];
    }
    handleBasicDetailsInput(field, values);
  };

  const handleChiefComplaintSelection = async (complaint: string) => {
    addMessage({
      role: "user",
      content: complaint,
      timestamp: new Date(),
    });

    setChiefComplaint(complaint);
    setIsLoading(true);

    try {
      if (!basicDetails) throw new Error("Basic details required");
      
      // Generate dynamic questions based on chief complaint
      const context = generateSummary(basicDetails, complaint);
      const questions = await generateDynamicQuestions(complaint, context);
      setDynamicQuestions(questions);
      setCurrentStage("dynamic_questions");
      setCurrentQuestionIndex(0);
      
      addMessage({
        role: "assistant",
        content: questions[0].question,
        timestamp: new Date(),
      });
      setProgress(60);
    } catch (error) {
      console.error("Error generating questions:", error);
      addMessage({
        role: "assistant",
        content: "I apologize, but I'm having trouble generating questions. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicQuestionAnswer = async (answer: string | string[]) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: Array.isArray(answer) ? answer.join(", ") : answer,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    if (currentQuestionIndex < dynamicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextQuestion = dynamicQuestions[currentQuestionIndex + 1];
      
      addMessage({
        role: "assistant",
        content: nextQuestion.question,
        timestamp: new Date(),
      });
      setProgress(60 + (currentQuestionIndex + 1) * (20 / dynamicQuestions.length));
    } else {
      await generateFinalReport();
    }
  };

  const generateFinalReport = async () => {
    if (!location || !basicDetails) return;
    
    setIsLoading(true);
    addMessage({
      role: "assistant",
      content: "Thank you for providing all the information. I'm analyzing your symptoms and generating your medical report now...",
      timestamp: new Date(),
    });

    try {
      const context = generateSummary(basicDetails, chiefComplaint);
      
      // Collect all answers for analysis
      const answers = dynamicQuestions.map((q, index) => ({
        question: q.question,
        answer: messages.find(m => 
          m.role === "user" && 
          messages.findIndex(msg => msg.content === q.question) < messages.indexOf(m)
        )?.content || ""
      }));

      const reportData = await generateMedicalReport({
        basicDetails,
        chiefComplaint,
        dynamicQuestions,
        answers,
        location,
        context
      });

      // Store the report in the database
      const storedReport = await storeReport(sessionId, reportData);
      
      if (storedReport) {
        setGeneratedReport(storedReport);
        setShowReport(true);
        
        addMessage({
          role: "assistant",
          content: "I've analyzed your symptoms and generated a detailed medical report. Please review it carefully.",
          timestamp: new Date(),
        });
        
        // Add a summary message with key findings
        addMessage({
          role: "assistant",
          content: `Based on your symptoms, I estimate you may have: ${storedReport.estimatedCondition}\n\nRecommended next steps:\n${storedReport.recommendations}`,
          timestamp: new Date(),
        });
        
        setProgress(100);
      } else {
        throw new Error("Failed to store report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      addMessage({
        role: "assistant",
        content: "I apologize, but I encountered an error while generating your report. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
    onSessionComplete(sessionId, generatedReport);
    onCloseSession();
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const answer = userInput.trim();
    setUserInput("");
    handleDynamicQuestionAnswer(answer);
  };

  const renderCurrentStageUI = () => {
    switch (currentStage) {
      case "location":
        return (
          <div className="space-y-4">
            <Button
              onClick={handleLocationShare}
              className="w-full bg-[#04724D] hover:bg-[#04724D]/90 text-white font-medium"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Share Location
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#04724D] text-[#04724D] hover:bg-[#04724D]/10 font-medium"
              onClick={() => setCurrentStage("manual_location")}
            >
              Enter Location Manually
            </Button>
          </div>
        );

      case "basic_details":
        return (
          <div className="space-y-4">
            {!basicDetails?.name && (
              <div className="flex gap-2">
                <Input
                  placeholder="Your full name"
                  className="flex-1 border-[#04724D] focus:ring-[#04724D] text-gray-900 font-medium"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      handleBasicDetailsInput("name", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button 
                  className="bg-[#04724D] hover:bg-[#04724D]/90"
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if (input.value) {
                      handleBasicDetailsInput("name", input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            {basicDetails?.name && !basicDetails?.weight && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Weight in kg"
                  className="flex-1 border-[#04724D] focus:ring-[#04724D] text-gray-900 font-medium"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      handleBasicDetailsInput("weight", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button 
                  className="bg-[#04724D] hover:bg-[#04724D]/90"
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if (input.value) {
                      handleBasicDetailsInput("weight", input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            {basicDetails?.weight && !basicDetails?.height && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Height in cm"
                  className="flex-1 border-[#04724D] focus:ring-[#04724D] text-gray-900 font-medium"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      handleBasicDetailsInput("height", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button 
                  className="bg-[#04724D] hover:bg-[#04724D]/90"
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if (input.value) {
                      handleBasicDetailsInput("height", input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            {basicDetails?.height && !basicDetails?.allergies && (
              <div className="space-y-2 bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">Select your allergies:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGY_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${option}`}
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (option === "None") {
                              handleMultiSelect("allergies", ["None"]);
                            } else {
                              handleMultiSelect("allergies", [...selectedOptions.filter(o => o !== "None"), option]);
                            }
                          } else {
                            handleMultiSelect("allergies", selectedOptions.filter(o => o !== option));
                          }
                        }}
                        className="border-[#04724D] data-[state=checked]:bg-[#04724D]"
                      />
                      <label
                        htmlFor={`allergy-${option}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-4 bg-[#04724D] hover:bg-[#04724D]/90 font-medium"
                  onClick={() => {
                    if (selectedOptions.length > 0) {
                      handleBasicDetailsInput("allergies", selectedOptions);
                      setSelectedOptions([]);
                    }
                  }}
                >
                  Confirm Selection
                </Button>
              </div>
            )}
            {basicDetails?.allergies && !basicDetails?.conditions && (
              <div className="space-y-2 bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">Select your conditions:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITION_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${option}`}
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (option === "None") {
                              handleMultiSelect("conditions", ["None"]);
                            } else {
                              handleMultiSelect("conditions", [...selectedOptions.filter(o => o !== "None"), option]);
                            }
                          } else {
                            handleMultiSelect("conditions", selectedOptions.filter(o => o !== option));
                          }
                        }}
                        className="border-[#04724D] data-[state=checked]:bg-[#04724D]"
                      />
                      <label
                        htmlFor={`condition-${option}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-4 bg-[#04724D] hover:bg-[#04724D]/90 font-medium"
                  onClick={() => {
                    if (selectedOptions.length > 0) {
                      handleBasicDetailsInput("conditions", selectedOptions);
                      setSelectedOptions([]);
                    }
                  }}
                >
                  Confirm Selection
                </Button>
              </div>
            )}
          </div>
        );

      case "chief_complaint":
        return (
          <div className="space-y-2 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Select your main concern:</h3>
            <div className="grid grid-cols-2 gap-2">
              {CHIEF_COMPLAINTS.map((complaint) => (
                <Button
                  key={complaint}
                  variant="outline"
                  className={`justify-start font-medium ${
                    chiefComplaint === complaint
                      ? "border-[#04724D] bg-[#04724D] text-white"
                      : "border-gray-200 text-gray-900 hover:border-[#04724D] hover:bg-[#04724D]/10"
                  }`}
                  onClick={() => handleChiefComplaintSelection(complaint)}
                >
                  {complaint}
                </Button>
              ))}
            </div>
          </div>
        );

      case "dynamic_questions":
        if (!dynamicQuestions[currentQuestionIndex]) return null;
        
        const question = dynamicQuestions[currentQuestionIndex];
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm animate-fadeIn">
              <h3 className="font-medium text-gray-900 mb-4">{question.question}</h3>
              <div className="grid grid-cols-1 gap-2">
                {question.options?.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="justify-start font-medium border-gray-200 text-gray-900 hover:border-[#04724D] hover:bg-[#04724D]/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => handleDynamicQuestionAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <form onSubmit={handleInputSubmit} className="flex gap-2 animate-slideUp">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Or type your own answer..."
                className="flex-1 border-[#04724D] focus:ring-[#04724D] text-gray-900 font-medium transition-all duration-200"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-[#04724D] hover:bg-[#04724D]/90 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="flex flex-col h-[600px] max-w-2xl mx-auto bg-gradient-to-br from-[#F4F4F9] to-[#B8DBD9]/20 shadow-xl animate-fadeIn">
        <div className="p-4 border-b bg-[#04724D] text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 animate-bounce" />
              <h2 className="font-bold text-lg">ConsultAI Assistant</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseSession}
              className="hover:bg-white/10 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Progress value={progress} className="mt-4 bg-white/20 transition-all duration-500" />
        </div>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } items-end gap-2 animate-slideIn`}
              >
                {message.role === "assistant" && (
                  <Bot className="w-6 h-6 text-[#04724D] animate-bounce" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 transform transition-all duration-200 hover:scale-[1.01] ${
                    message.role === "user"
                      ? "bg-[#04724D] text-white"
                      : "bg-white shadow-sm border border-[#B8DBD9] text-gray-900"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                  <div className={`text-xs ${
                    message.role === "user" ? "text-white/70" : "text-gray-500"
                  } mt-1 flex items-center gap-1`}>
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === "user" && (
                  <User className="w-6 h-6 text-[#04724D] animate-bounce" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2 animate-pulse">
                <Bot className="w-6 h-6 text-[#04724D]" />
                <div className="bg-white shadow-sm border border-[#B8DBD9] rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-[#04724D]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#B8DBD9] bg-white/80 backdrop-blur-sm animate-slideUp">
          {renderCurrentStageUI()}
        </div>
      </Card>

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medical Consultation Report</DialogTitle>
            <DialogDescription>
              Please review your medical report carefully
            </DialogDescription>
          </DialogHeader>

          {generatedReport && (
            <div className="space-y-8 py-4">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name: {basicDetails?.name}</p>
                    <p className="text-gray-600">Height: {basicDetails?.height} cm</p>
                    <p className="text-gray-600">Weight: {basicDetails?.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Allergies: {basicDetails?.allergies?.join(", ") || "None"}</p>
                    <p className="text-gray-600">Chronic Conditions: {basicDetails?.conditions?.join(", ") || "None"}</p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint and Estimated Condition */}
              <div className="space-y-4">
                <div className="bg-[#04724D]/5 p-4 rounded-lg border border-[#04724D]/20">
                  <h3 className="font-semibold text-lg text-[#04724D] mb-2">Primary Concern</h3>
                  <p className="text-gray-700">{chiefComplaint}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-[#04724D] mb-2">Estimated Condition</h3>
                  <p className="text-gray-700">{generatedReport.report_data.estimatedCondition}</p>
                </div>
              </div>

              {/* Symptoms Analysis */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Symptoms Analysis</h3>
                <p className="text-gray-700 whitespace-pre-line">{generatedReport.report_data.symptomsAnalysis}</p>
              </div>

              {/* Diagnosis */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Medical Assessment</h3>
                <p className="text-gray-700">{generatedReport.report_data.diagnosis}</p>
              </div>

              {/* Treatment Plan */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Treatment Plan</h3>
                <ul className="list-disc list-inside space-y-2">
                  {generatedReport.report_data.treatment.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ul>
              </div>

              {/* Medications */}
              <div>
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Recommended Medications</h3>
                <div className="grid gap-4">
                  {generatedReport.report_data.medications.map((med, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-[#04724D] mb-2">{med.name}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-gray-700"><span className="font-medium">Dosage:</span> {med.dosage}</p>
                          <p className="text-gray-700"><span className="font-medium">Duration:</span> {med.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-700"><span className="font-medium">Instructions:</span></p>
                          <p className="text-gray-600">{med.instructions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Lifestyle Recommendations</h3>
                <ul className="list-disc list-inside space-y-2">
                  {generatedReport.report_data.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Precautions */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg text-red-700 mb-2">⚠️ Important Precautions & Warning Signs</h3>
                <p className="text-red-700 whitespace-pre-line">{generatedReport.report_data.precautions}</p>
              </div>

              {/* Follow-up Plan */}
              <div className="bg-[#04724D]/5 p-4 rounded-lg border border-[#04724D]/20">
                <h3 className="font-semibold text-lg text-[#04724D] mb-2">Follow-up Instructions</h3>
                <p className="text-gray-700">{generatedReport.report_data.followUp}</p>
              </div>

              {/* Diet Plan */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg text-[#04724D] mb-4">Personalized Diet Plan</h3>
                <DietPlanCard dietPlan={generatedReport.report_data.dietPlan} isDetailed={false} />
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/dashboard/diet-plans"}
                    className="border-[#04724D] text-[#04724D] hover:bg-[#04724D]/10"
                  >
                    View Full Diet Plan
                  </Button>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">⚕️ Important Medical Disclaimer</h3>
                <p className="text-yellow-700 text-sm">
                  This is an AI-generated medical consultation report. The information provided is for general guidance only 
                  and should not be considered as professional medical advice. Please consult with a qualified healthcare 
                  provider for proper diagnosis and treatment. If you experience severe symptoms or your condition worsens, 
                  seek immediate medical attention.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => downloadReport(generatedReport)}
              className="border-[#04724D] text-[#04724D] hover:bg-[#04724D]/10"
            >
              Download Report
            </Button>
            <Button
              onClick={handleCloseReport}
              className="bg-[#04724D] hover:bg-[#04724D]/90"
            >
              Close Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}