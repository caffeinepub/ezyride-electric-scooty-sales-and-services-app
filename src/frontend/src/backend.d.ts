import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ServiceAppointment {
    id: string;
    status: string;
    serviceType: ServiceType;
    customer: Principal;
    date: string;
    timestamp: bigint;
    timeSlot: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ScooterModel {
    id: string;
    chargingTime: bigint;
    name: string;
    image: ExternalBlob;
    price: bigint;
    topSpeed: bigint;
    range: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TestRideBooking {
    id: string;
    status: string;
    customer: Principal;
    date: string;
    scooterModelId: string;
    timestamp: bigint;
    timeSlot: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface PurchaseOrder {
    id: string;
    status: OrderStatus;
    customer: Principal;
    scooterModelId: string;
    timestamp: bigint;
    quantity: bigint;
    totalPrice: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum ServiceType {
    maintenance = "maintenance",
    repairs = "repairs",
    batteryReplacement = "batteryReplacement"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addScooterModel(model: ScooterModel): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookServiceAppointment(appointment: ServiceAppointment): Promise<void>;
    bookTestRide(booking: TestRideBooking): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(order: PurchaseOrder): Promise<void>;
    deleteScooterModel(modelId: string): Promise<void>;
    getAllOrders(): Promise<Array<PurchaseOrder>>;
    getAllServiceAppointments(): Promise<Array<ServiceAppointment>>;
    getAllTestRides(): Promise<Array<TestRideBooking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<PurchaseOrder>>;
    getMyServiceAppointments(): Promise<Array<ServiceAppointment>>;
    getMyTestRides(): Promise<Array<TestRideBooking>>;
    getScooterModels(): Promise<Array<ScooterModel>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateScooterModel(model: ScooterModel): Promise<void>;
    updateServiceAppointmentStatus(appointmentId: string, status: string): Promise<void>;
    updateTestRideStatus(bookingId: string, status: string): Promise<void>;
}
