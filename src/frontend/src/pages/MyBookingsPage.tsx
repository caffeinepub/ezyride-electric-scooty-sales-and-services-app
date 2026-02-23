import { useGetMyTestRides, useGetMyServiceAppointments } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar, Wrench } from 'lucide-react';

export default function MyBookingsPage() {
  const { data: testRides, isLoading: testRidesLoading } = useGetMyTestRides();
  const { data: serviceAppointments, isLoading: serviceLoading } = useGetMyServiceAppointments();

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View your test rides and service appointments</p>
        </div>

        <Tabs defaultValue="testrides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testrides">Test Rides</TabsTrigger>
            <TabsTrigger value="service">Service Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="testrides">
            {testRidesLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : testRides && testRides.length > 0 ? (
              <div className="space-y-4">
                {testRides.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-electric-blue" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Test Ride Booking</CardTitle>
                            <p className="text-sm text-muted-foreground">Model: {booking.scooterModelId}</p>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-semibold">{booking.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time Slot</p>
                          <p className="font-semibold">{booking.timeSlot}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-semibold capitalize">{booking.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No test ride bookings yet. Book your first test ride today!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="service">
            {serviceLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : serviceAppointments && serviceAppointments.length > 0 ? (
              <div className="space-y-4">
                {serviceAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-electric-green/10 flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-electric-green" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Service Appointment</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">{appointment.serviceType}</p>
                          </div>
                        </div>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-semibold">{appointment.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time Slot</p>
                          <p className="font-semibold">{appointment.timeSlot}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-semibold capitalize">{appointment.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No service appointments yet. Book a service appointment today!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
