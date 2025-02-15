import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#04724D]">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-500">
            Path: {location.pathname}
          </p>
        </div>
        
        <Link to="/dashboard">
          <Button className="bg-[#04724D] hover:bg-[#04724D]/90">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
