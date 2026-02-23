import { useState } from 'react';
import { useBookServiceAppointment } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, Wrench, Battery, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ServiceAppointment, ServiceType } from '../backend';

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

const SERVICE_TYPES = [
  { value: ServiceType.maintenance, label: 'Regular Maintenance', icon: Wrench },
  { value: ServiceType.batteryReplacement, label: 'Battery Replacement', icon: Battery },
  { value: ServiceType.repairs, label: 'Repairs', icon: Settings },
];

export default function ServicePage() {
  const { identity } = useInternetIdentity();
  const bookService = useBookServiceAppointment();

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const handleBooking = async () => {
    if (!identity) {
      toast.error('Please login to book a service appointment');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const appointment: ServiceAppointment = {
        id: `service-${Date.now()}`,
        customer: identity.getPrincipal(),
        serviceType: selectedService as ServiceType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTimeSlot,
        status: 'pending',
        timestamp: BigInt(Date.now()),
      };

      await bookService.mutateAsync(appointment);
      toast.success('Service appointment booked successfully!');
      
      // Reset form
      setSelectedService('');
      setSelectedDate(undefined);
      setSelectedTimeSlot('');
    } catch (error) {
      toast.error('Failed to book service appointment');
      console.error(error);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Service & Maintenance at MBEvHub</h1>
          <p className="text-lg text-muted-foreground">
            Keep your scooter in perfect condition with our professional service team at MBEvHub virtual showroom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src="/assets/generated/service-maintenance.dim_800x600.jpg"
              alt="Service"
              className="rounded-2xl shadow-xl w-full mb-6"
            />
            <img
              src="/assets/generated/scooter-battery.dim_400x300.jpg"
              alt="Battery"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book Service Appointment</CardTitle>
              <CardDescription>Schedule your service visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((service) => {
                      const Icon = service.icon;
                      return (
                        <SelectItem key={service.value} value={service.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {service.label}
                          </div>
                        </SelectItem>
                      );
                    })}
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
                disabled={bookService.isPending || !selectedService || !selectedDate || !selectedTimeSlot}
                className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
              >
                {bookService.isPending ? 'Booking...' : 'Confirm Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-electric-blue" />
              </div>
              <CardTitle className="text-lg">Regular Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive checkup including brake inspection, tire pressure, and electrical system diagnostics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-electric-green/20 flex items-center justify-center mb-2">
                <Battery className="w-6 h-6 text-electric-green" />
              </div>
              <CardTitle className="text-lg">Battery Replacement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional battery replacement service with genuine parts and warranty coverage.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-electric-purple/20 flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-electric-purple" />
              </div>
              <CardTitle className="text-lg">Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Expert repair services for any issues with your electric scooter, backed by our quality guarantee.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
