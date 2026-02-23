import { useState } from 'react';
import { useGetScooterModels, useAddScooterModel, useUpdateScooterModel, useDeleteScooterModel, useGetAllOrders, useGetAllTestRides, useGetAllServiceAppointments, useUpdateOrderStatus, useUpdateTestRideStatus, useUpdateServiceAppointmentStatus, useIsCallerAdmin, useIsStripeConfigured } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Plus, Edit, Trash2, Package, Calendar, Wrench, Settings, AlertCircle } from 'lucide-react';
import { ScooterModel, OrderStatus, ExternalBlob } from '../backend';
import { toast } from 'sonner';
import StripeSetupModal from '../components/StripeSetupModal';

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: scooters, isLoading: scootersLoading } = useGetScooterModels();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: testRides, isLoading: testRidesLoading } = useGetAllTestRides();
  const { data: serviceAppointments, isLoading: serviceLoading } = useGetAllServiceAppointments();
  const { data: isStripeConfigured } = useIsStripeConfigured();

  const addScooter = useAddScooterModel();
  const updateScooter = useUpdateScooterModel();
  const deleteScooter = useDeleteScooterModel();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updateTestRideStatusMutation = useUpdateTestRideStatus();
  const updateServiceStatusMutation = useUpdateServiceAppointmentStatus();

  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ScooterModel | null>(null);
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    range: '',
    topSpeed: '',
    chargingTime: '',
    price: '',
    imageFile: null as File | null,
  });

  if (adminLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-20">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have admin access to this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleOpenModelDialog = (model?: ScooterModel) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        name: model.name,
        range: Number(model.range).toString(),
        topSpeed: Number(model.topSpeed).toString(),
        chargingTime: Number(model.chargingTime).toString(),
        price: Number(model.price).toString(),
        imageFile: null,
      });
    } else {
      setEditingModel(null);
      setFormData({
        name: '',
        range: '',
        topSpeed: '',
        chargingTime: '',
        price: '',
        imageFile: null,
      });
    }
    setModelDialogOpen(true);
  };

  const handleSaveModel = async () => {
    if (!formData.name || !formData.range || !formData.topSpeed || !formData.chargingTime || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!editingModel && !formData.imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      let imageBlob: ExternalBlob;

      if (formData.imageFile) {
        const arrayBuffer = await formData.imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array);
      } else if (editingModel) {
        imageBlob = editingModel.image;
      } else {
        toast.error('Image is required');
        return;
      }

      const modelData: ScooterModel = {
        id: editingModel?.id || `model-${Date.now()}`,
        name: formData.name,
        range: BigInt(formData.range),
        topSpeed: BigInt(formData.topSpeed),
        chargingTime: BigInt(formData.chargingTime),
        price: BigInt(formData.price),
        image: imageBlob,
      };

      if (editingModel) {
        await updateScooter.mutateAsync(modelData);
        toast.success('Model updated successfully');
      } else {
        await addScooter.mutateAsync(modelData);
        toast.success('Model added successfully');
      }

      setModelDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save model');
      console.error(error);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      await deleteScooter.mutateAsync(modelId);
      toast.success('Model deleted successfully');
    } catch (error) {
      toast.error('Failed to delete model');
      console.error(error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleUpdateTestRideStatus = async (bookingId: string, status: string) => {
    try {
      await updateTestRideStatusMutation.mutateAsync({ bookingId, status });
      toast.success('Test ride status updated');
    } catch (error) {
      toast.error('Failed to update test ride status');
      console.error(error);
    }
  };

  const handleUpdateServiceStatus = async (appointmentId: string, status: string) => {
    try {
      await updateServiceStatusMutation.mutateAsync({ appointmentId, status });
      toast.success('Service appointment status updated');
    } catch (error) {
      toast.error('Failed to update service status');
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">MBEvHub Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Ezyride electric scooter business</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStripeDialogOpen(true)}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          {isStripeConfigured ? 'Stripe Configured' : 'Configure Stripe'}
        </Button>
      </div>

      {!isStripeConfigured && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Stripe payment is not configured. Click "Configure Stripe" to enable online payments.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">Scooter Models</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="testrides">Test Rides</TabsTrigger>
          <TabsTrigger value="service">Service Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scooter Models</CardTitle>
                  <CardDescription>Manage your electric scooter inventory</CardDescription>
                </div>
                <Button onClick={() => handleOpenModelDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Model
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {scootersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : scooters && scooters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Top Speed</TableHead>
                      <TableHead>Charging Time</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scooters.map((scooter) => (
                      <TableRow key={scooter.id}>
                        <TableCell>
                          <img
                            src={scooter.image.getDirectURL()}
                            alt={scooter.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{scooter.name}</TableCell>
                        <TableCell>{Number(scooter.range)} km</TableCell>
                        <TableCell>{Number(scooter.topSpeed)} km/h</TableCell>
                        <TableCell>{Number(scooter.chargingTime)}h</TableCell>
                        <TableCell>${Number(scooter.price).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenModelDialog(scooter)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteModel(scooter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No models added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : orders && orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Model ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-sm">{order.customer.toString().slice(0, 8)}...</TableCell>
                        <TableCell>{order.scooterModelId}</TableCell>
                        <TableCell>{Number(order.quantity)}</TableCell>
                        <TableCell>${Number(order.totalPrice).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === OrderStatus.delivered ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={OrderStatus.pending}>Pending</SelectItem>
                              <SelectItem value={OrderStatus.confirmed}>Confirmed</SelectItem>
                              <SelectItem value={OrderStatus.shipped}>Shipped</SelectItem>
                              <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
                              <SelectItem value={OrderStatus.cancelled}>Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testrides">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Test Ride Bookings
              </CardTitle>
              <CardDescription>Manage test ride appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {testRidesLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : testRides && testRides.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Model ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testRides.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-sm">{booking.customer.toString().slice(0, 8)}...</TableCell>
                        <TableCell>{booking.scooterModelId}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.timeSlot}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => handleUpdateTestRideStatus(booking.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No test ride bookings yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Service Appointments
              </CardTitle>
              <CardDescription>Manage service and maintenance bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : serviceAppointments && serviceAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appointment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-mono text-sm">{appointment.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-sm">{appointment.customer.toString().slice(0, 8)}...</TableCell>
                        <TableCell className="capitalize">{appointment.serviceType}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.timeSlot}</TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={appointment.status}
                            onValueChange={(value) => handleUpdateServiceStatus(appointment.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No service appointments yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit Model' : 'Add New Model'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ezyride Pro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="range">Range (km)</Label>
                <Input
                  id="range"
                  type="number"
                  value={formData.range}
                  onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                  placeholder="80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topSpeed">Top Speed (km/h)</Label>
                <Input
                  id="topSpeed"
                  type="number"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chargingTime">Charging Time (hours)</Label>
                <Input
                  id="chargingTime"
                  type="number"
                  value={formData.chargingTime}
                  onChange={(e) => setFormData({ ...formData, chargingTime: e.target.value })}
                  placeholder="4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="1299"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModelDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSaveModel}
                disabled={addScooter.isPending || updateScooter.isPending}
                className="flex-1"
              >
                {addScooter.isPending || updateScooter.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StripeSetupModal open={stripeDialogOpen} onClose={() => setStripeDialogOpen(false)} />
    </div>
  );
}
