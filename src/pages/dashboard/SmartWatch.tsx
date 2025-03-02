import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertCircle,
  Heart,
  Activity,
  Watch,
  PlayCircle,
  Loader2,
  X,
  Bluetooth,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cn } from '@/lib/utils';

// Web Bluetooth API TypeScript declarations
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        filters?: Array<{ services: string[] }>;
        optionalServices?: string[];
      }): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    name?: string;
    gatt?: {
      connect(): Promise<BluetoothRemoteGATTServer>;
    };
    addEventListener(
      type: 'gattserverdisconnected',
      listener: EventListener
    ): void;
    removeEventListener(
      type: 'gattserverdisconnected',
      listener: EventListener
    ): void;
  }

  interface BluetoothRemoteGATTServer {
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
    connected: boolean;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(
      type: string,
      listener: EventListener
    ): void;
    removeEventListener(
      type: string,
      listener: EventListener
    ): void;
  }
}

interface HealthData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
}

interface AnalysisResult {
  riskLevel: string;
  potentialIssues: string[];
  treatment: string[];
  recommendedActivities: string[];
}

// Standard Bluetooth GATT Service UUIDs
const HEART_RATE_SERVICE = '0x180D';
const HEALTH_THERMOMETER_SERVICE = '0x1809';
const FITNESS_SERVICE = '0x183E'; // User Data Service
const STEP_COUNTER_SERVICE = '0x181C';

interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connecting: boolean;
}

export default function SmartWatch() {
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [devices, setDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    setScanning(true);
    setError(null);
    
    try {
      // Check if Bluetooth is supported
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth is not supported in your browser. Please use Chrome, Edge, or Opera.');
      }

      // Simulate finding devices (since Web Bluetooth API doesn't support device discovery)
      // In a real app, you would use the proper Bluetooth scanning API
      const mockDevices = [
        { id: '1', name: 'Mi Band 6', connecting: false },
        { id: '2', name: 'Apple Watch', connecting: false },
        { id: '3', name: 'Fitbit Versa', connecting: false },
        { id: '4', name: 'Samsung Galaxy Watch', connecting: false },
        { id: '5', name: 'Garmin Venu', connecting: false },
      ];
      
      setDevices(mockDevices);
    } catch (error) {
      console.error('Scan error:', error);
      setError(error instanceof Error ? error.message : 'Failed to scan for devices');
    } finally {
      setScanning(false);
    }
  };

  const connectToDevice = async (deviceInfo: BluetoothDeviceInfo) => {
    if (!navigator.bluetooth) {
      setError('Bluetooth is not supported in your browser. Please use Chrome, Edge, or Opera.');
      return;
    }

    // Update device status to connecting
    setDevices(prev => prev.map(d => 
      d.id === deviceInfo.id ? { ...d, connecting: true } : d
    ));

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate',
          'health_thermometer',
          'fitness_machine',
          'body_composition'
        ]
      });

      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Could not connect to the device');
      }

      // Successfully connected
      setIsConnected(true);
      setShowDeviceDialog(false);
      
      // Simulate health data
      const mockHealthData = {
        steps: Math.floor(Math.random() * 10000) + 2000,
        heartRate: Math.floor(Math.random() * 30) + 60,
        calories: Math.floor(Math.random() * 500) + 200,
        distance: parseFloat((Math.random() * 8 + 2).toFixed(1))
      };

      setHealthData(mockHealthData);

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setHealthData(null);
        console.log('Device disconnected');
      });

    } catch (error) {
      console.error('Connection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to device');
    } finally {
      // Reset device connecting status
      setDevices(prev => prev.map(d => 
        d.id === deviceInfo.id ? { ...d, connecting: false } : d
      ));
    }
  };

  const analyzeHealthData = async () => {
    if (!healthData) return;

    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze the following health metrics and provide a detailed health assessment:
        Steps: ${healthData.steps}
        Heart Rate: ${healthData.heartRate} bpm
        Calories Burned: ${healthData.calories}
        Distance: ${healthData.distance} km
        
        Please provide:
        1. Risk level (Low, Medium, High)
        2. Potential health issues
        3. Recommended treatments
        4. Suggested physical activities
        
        Format the response in a structured way.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response into sections
      const sections = text.split('\n\n');
      const analysisResult: AnalysisResult = {
        riskLevel: sections[0]?.includes('Low') ? 'Low' : 
                  sections[0]?.includes('Medium') ? 'Medium' : 'High',
        potentialIssues: sections[1]?.split('\n').filter(line => line.trim()) || [],
        treatment: sections[2]?.split('\n').filter(line => line.trim()) || [],
        recommendedActivities: sections[3]?.split('\n').filter(line => line.trim()) || []
      };

      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze health data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Smart Watch Integration</h1>
        <Button
          onClick={() => {
            setShowDeviceDialog(true);
            startScan();
          }}
          variant={isConnected ? "outline" : "default"}
          className="gap-2"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Watch className="w-4 h-4" />
          )}
          {isConnecting ? 'Connecting...' : 
           isConnected ? 'Connected' : 'Connect Smart Watch'}
        </Button>
      </div>

      {/* Bluetooth Device Selection Dialog */}
      <AnimatePresence>
        {showDeviceDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bluetooth className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Connect Device</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeviceDialog(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-3 mb-4">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => connectToDevice(device)}
                    disabled={device.connecting}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left",
                      "transition-all duration-200",
                      "hover:border-blue-500 hover:shadow-md",
                      "flex items-center justify-between",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Watch className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">
                          {device.connecting ? 'Connecting...' : 'Available'}
                        </p>
                      </div>
                    </div>
                    {device.connecting ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={startScan}
                  disabled={scanning}
                  className="gap-2"
                >
                  {scanning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="w-4 h-4" />
                  )}
                  {scanning ? 'Scanning...' : 'Scan Again'}
                </Button>
                <p className="text-sm text-gray-500">
                  {scanning ? 'Searching for devices...' : 'Select a device to connect'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isConnected && healthData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Steps</p>
              <p className="text-xl font-bold">{healthData.steps.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Heart Rate</p>
              <p className="text-xl font-bold">{healthData.heartRate} bpm</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <PlayCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Calories</p>
              <p className="text-xl font-bold">{healthData.calories} kcal</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-xl font-bold">{healthData.distance} km</p>
            </div>
          </Card>
        </div>
      )}

      {isConnected && healthData && (
        <div className="space-y-4">
          <Button
            onClick={analyzeHealthData}
            className="w-full gap-2"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Health Data'}
          </Button>

          {analysis && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Analysis Results
              </h2>
              
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Risk Level</h3>
                  <p className={`mt-1 ${
                    analysis.riskLevel === 'Low' ? 'text-green-600' :
                    analysis.riskLevel === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.riskLevel}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Potential Issues</h3>
                  <ul className="mt-1 list-disc list-inside">
                    {analysis.potentialIssues.map((issue, index) => (
                      <li key={index} className="text-gray-600">{issue}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Recommended Treatment</h3>
                  <ul className="mt-1 list-disc list-inside">
                    {analysis.treatment.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Suggested Activities</h3>
                  <ul className="mt-1 list-disc list-inside">
                    {analysis.recommendedActivities.map((activity, index) => (
                      <li key={index} className="text-gray-600">{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 