import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ScooterModel, PurchaseOrder, TestRideBooking, ServiceAppointment, OrderStatus, UserProfile, StripeConfiguration, ShoppingItem } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Scooter Model Queries
export function useGetScooterModels() {
  const { actor, isFetching } = useActor();

  return useQuery<ScooterModel[]>({
    queryKey: ['scooterModels'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScooterModels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScooterModel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (model: ScooterModel) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addScooterModel(model);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scooterModels'] });
    },
  });
}

export function useUpdateScooterModel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (model: ScooterModel) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScooterModel(model);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scooterModels'] });
    },
  });
}

export function useDeleteScooterModel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScooterModel(modelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scooterModels'] });
    },
  });
}

// Order Queries
export function useGetMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseOrder[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseOrder[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: PurchaseOrder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

// Test Ride Queries
export function useGetMyTestRides() {
  const { actor, isFetching } = useActor();

  return useQuery<TestRideBooking[]>({
    queryKey: ['myTestRides'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTestRides();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTestRides() {
  const { actor, isFetching } = useActor();

  return useQuery<TestRideBooking[]>({
    queryKey: ['allTestRides'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestRides();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookTestRide() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: TestRideBooking) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookTestRide(booking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTestRides'] });
      queryClient.invalidateQueries({ queryKey: ['allTestRides'] });
    },
  });
}

export function useUpdateTestRideStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestRideStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTestRides'] });
    },
  });
}

// Service Appointment Queries
export function useGetMyServiceAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceAppointment[]>({
    queryKey: ['myServiceAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyServiceAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllServiceAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceAppointment[]>({
    queryKey: ['allServiceAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServiceAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookServiceAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: ServiceAppointment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookServiceAppointment(appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServiceAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['allServiceAppointments'] });
    },
  });
}

export function useUpdateServiceAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, status }: { appointmentId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateServiceAppointmentStatus(appointmentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allServiceAppointments'] });
    },
  });
}

// Stripe Queries
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}
