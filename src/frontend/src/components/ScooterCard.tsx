import { ScooterModel } from '../backend';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Battery, Gauge, Clock, ShoppingCart } from 'lucide-react';

interface ScooterCardProps {
  scooter: ScooterModel;
  onPurchase?: (scooter: ScooterModel) => void;
  onTestRide?: (scooter: ScooterModel) => void;
}

export default function ScooterCard({ scooter, onPurchase, onTestRide }: ScooterCardProps) {
  const imageUrl = scooter.image.getDirectURL();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img src={imageUrl} alt={scooter.name} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{scooter.name}</span>
          <Badge className="bg-gradient-to-r from-electric-blue to-electric-green text-white">
            ${Number(scooter.price).toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <Battery className="w-5 h-5 text-electric-blue" />
            <span className="font-semibold">{Number(scooter.range)} km</span>
            <span className="text-xs text-muted-foreground">Range</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Gauge className="w-5 h-5 text-electric-green" />
            <span className="font-semibold">{Number(scooter.topSpeed)} km/h</span>
            <span className="text-xs text-muted-foreground">Top Speed</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Clock className="w-5 h-5 text-electric-purple" />
            <span className="font-semibold">{Number(scooter.chargingTime)}h</span>
            <span className="text-xs text-muted-foreground">Charging</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {onTestRide && (
          <Button variant="outline" className="flex-1" onClick={() => onTestRide(scooter)}>
            Test Ride
          </Button>
        )}
        {onPurchase && (
          <Button
            className="flex-1 bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
            onClick={() => onPurchase(scooter)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
