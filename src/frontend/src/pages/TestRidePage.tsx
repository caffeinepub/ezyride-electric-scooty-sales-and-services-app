import { useState } from 'react';
import { useGetScooterModels, useBookTestRide } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { TestRideBooking } from '../backend';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

export default function TestRidePage() {
  const { identity } = useInternetIdentity();
  const { data: scooters, isLoading } = useGetScooterModels();
  const bookTestRide = useBookTestRide();

  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const handleBooking = async () => {
    if (!identity) {
      toast.error('Please login to book a test ride');
      return;
    }

    if (!selectedModel || !selectedDate || !selectedTimeSlot) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const booking: TestRideBooking = {
        id: `testride-${Date.now()}`,
        customer: identity.getPrincipal(),
        scooterModelId: selectedModel,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTimeSlot,
        status: 'pending',
        timestamp: BigInt(Date.now()),
      };

      await bookTestRide.mutateAsync(booking);
      toast.success('Test ride booked successfully!');
      
      // Reset form
      setSelectedModel('');
      setSelectedDate(undefined);
      setSelectedTimeSlot('');
    } catch (error) {
      toast.error('Failed to book test ride');
      console.error(error);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Book a Test Ride at MBEvHub</h1>
          <p className="text-lg text-muted-foreground">
            Experience the thrill of electric riding at our virtual showroom. Choose your preferred model, date, and time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src="/assets/generated/test-ride-hero.dim_1024x600.jpg"
              alt="Test Ride"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Test Ride</CardTitle>
              <CardDescription>Select your preferences below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a scooter model" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading models...
                      </SelectItem>
                    ) : scooters && scooters.length > 0 ? (
                      scooters.map((scooter) => (
                        <SelectItem key={scooter.id} value={scooter.id}>
                          {scooter.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No models available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Select Time Slot</Label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleBooking}
                disabled={bookTestRide.isPending || !selectedModel || !selectedDate || !selectedTimeSlot}
                className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
              >
                {bookTestRide.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our expert team at MBEvHub will guide you through the features and help you experience the full potential of our electric scooters.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each test ride session lasts approximately 30 minutes, giving you plenty of time to get comfortable.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please bring a valid ID and wear comfortable clothing. Helmets and safety gear will be provided.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
