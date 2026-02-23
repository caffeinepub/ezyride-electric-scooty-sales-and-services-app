import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-center">Payment Failed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Your payment was not completed. Please try again or contact support if the issue persists.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate({ to: '/' })}
                className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
