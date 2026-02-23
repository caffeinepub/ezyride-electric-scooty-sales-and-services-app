import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetScooterModels, useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ScooterCard from '../components/ScooterCard';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Zap, Battery, Leaf, Shield, AlertCircle } from 'lucide-react';
import { ScooterModel, ShoppingItem } from '../backend';
import { toast } from 'sonner';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: scooters, isLoading } = useGetScooterModels();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const createCheckout = useCreateCheckoutSession();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handlePurchase = async (scooter: ScooterModel) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      return;
    }

    if (!isStripeConfigured) {
      toast.error('Payment system not configured. Please contact admin.');
      return;
    }

    setPurchasingId(scooter.id);
    try {
      const items: ShoppingItem[] = [
        {
          productName: scooter.name,
          productDescription: `Electric scooter with ${Number(scooter.range)}km range`,
          priceInCents: BigInt(Number(scooter.price) * 100),
          currency: 'usd',
          quantity: BigInt(1),
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const result = await createCheckout.mutateAsync({ items, successUrl, cancelUrl });
      const session = JSON.parse(result) as { id: string; url: string };
      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error(error);
    } finally {
      setPurchasingId(null);
    }
  };

  const handleTestRide = (scooter: ScooterModel) => {
    if (!isAuthenticated) {
      toast.error('Please login to book a test ride');
      return;
    }
    navigate({ to: '/test-ride', search: { modelId: scooter.id } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-electric-blue/10 via-electric-green/10 to-electric-purple/10">
        <div className="container py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/ezyride-logo-transparent.dim_200x200.png" 
                    alt="Ezyride Logo" 
                    className="w-16 h-16"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                      Ezyride
                    </h1>
                    <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
                      Bhavishya ki Sawari
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                Experience the perfect blend of performance, sustainability, and style with our premium electric scooters at MBEvHub virtual showroom.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                  onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Models
                </Button>
                {isAuthenticated && (
                  <Button size="lg" variant="outline" onClick={() => navigate({ to: '/test-ride' })}>
                    Book Test Ride
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/test-ride-hero.dim_1024x600.jpg"
                alt="Electric Scooter"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ezyride?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-electric-blue to-electric-green flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">High Performance</h3>
              <p className="text-muted-foreground">Powerful motors for smooth, fast rides</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-electric-green to-electric-purple flex items-center justify-center">
                <Battery className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Long Range</h3>
              <p className="text-muted-foreground">Extended battery life for longer journeys</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-electric-purple to-electric-blue flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Eco-Friendly</h3>
              <p className="text-muted-foreground">Zero emissions, sustainable transport</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-electric-blue to-electric-purple flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Safe & Reliable</h3>
              <p className="text-muted-foreground">Advanced safety features included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Electric Scooters</h2>

          {!isAuthenticated && (
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Login to purchase scooters or book test rides</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : scooters && scooters.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scooters.map((scooter) => (
                <ScooterCard
                  key={scooter.id}
                  scooter={scooter}
                  onPurchase={isAuthenticated ? handlePurchase : undefined}
                  onTestRide={isAuthenticated ? handleTestRide : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No scooter models available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/service-maintenance.dim_800x600.jpg"
                alt="Service & Maintenance"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Expert Service & Maintenance</h2>
              <p className="text-lg text-muted-foreground">
                Keep your scooter in perfect condition with our professional maintenance services at MBEvHub. From routine checkups to
                battery replacements, we've got you covered.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-electric-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-electric-green" />
                  </div>
                  <span>Regular maintenance and inspections</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-electric-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-electric-green" />
                  </div>
                  <span>Battery replacement and upgrades</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-electric-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-electric-green" />
                  </div>
                  <span>Quick repairs and troubleshooting</span>
                </li>
              </ul>
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                  onClick={() => navigate({ to: '/service' })}
                >
                  Book Service
                </Button>
              ) : (
                <Button size="lg" variant="outline" disabled>
                  Login to Book Service
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
