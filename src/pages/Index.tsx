
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-6 text-4xl font-bold">Virtual Doctor</h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Get instant medical consultations with our AI-powered virtual doctor.
        Professional health guidance at your fingertips.
      </p>
      <Button
        size="lg"
        onClick={() => navigate(user ? "/dashboard" : "/auth")}
      >
        {user ? "Go to Dashboard" : "Get Started"}
      </Button>
    </div>
  );
}
