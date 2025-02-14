import { AssessmentHistory } from "@/components/AssessmentHistory";

export default function Dashboard() {
  return (
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <AssessmentHistory />
    </div>
  );
} 