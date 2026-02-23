import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">Payment Successful!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Your order has been placed successfully. We'll send you a confirmation email shortly.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate({ to: '/my-orders' })}
                className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
              >
                View My Orders
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
