import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor Main {
  // Authorization
  let accessControlState = AccessControl.initState();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Storage
  let storage = Storage.new();
  include MixinStorage(storage);

  // Data Types
  public type ScooterModel = {
    id : Text;
    name : Text;
    range : Nat;
    topSpeed : Nat;
    chargingTime : Nat;
    price : Nat;
    image : Storage.ExternalBlob;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type PurchaseOrder = {
    id : Text;
    customer : Principal;
    scooterModelId : Text;
    quantity : Nat;
    totalPrice : Nat;
    status : OrderStatus;
    timestamp : Int;
  };

  public type TestRideBooking = {
    id : Text;
    customer : Principal;
    scooterModelId : Text;
    date : Text;
    timeSlot : Text;
    status : Text;
    timestamp : Int;
  };

  public type ServiceType = {
    #maintenance;
    #batteryReplacement;
    #repairs;
  };

  public type ServiceAppointment = {
    id : Text;
    customer : Principal;
    serviceType : ServiceType;
    date : Text;
    timeSlot : Text;
    status : Text;
    timestamp : Int;
  };

  // Data Storage
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var scooterModels = textMap.empty<ScooterModel>();
  var purchaseOrders = textMap.empty<PurchaseOrder>();
  var testRideBookings = textMap.empty<TestRideBooking>();
  var serviceAppointments = textMap.empty<ServiceAppointment>();

  // Scooter Model Operations
  public query func getScooterModels() : async [ScooterModel] {
    Iter.toArray(textMap.vals(scooterModels));
  };

  public shared ({ caller }) func addScooterModel(model : ScooterModel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add scooter models");
    };
    scooterModels := textMap.put(scooterModels, model.id, model);
  };

  public shared ({ caller }) func updateScooterModel(model : ScooterModel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update scooter models");
    };
    scooterModels := textMap.put(scooterModels, model.id, model);
  };

  public shared ({ caller }) func deleteScooterModel(modelId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete scooter models");
    };
    scooterModels := textMap.delete(scooterModels, modelId);
  };

  // Purchase Order Operations
  public query ({ caller }) func getMyOrders() : async [PurchaseOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view orders");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(purchaseOrders),
        func(order : PurchaseOrder) : Bool {
          order.customer == caller;
        },
      )
    );
  };

  public query ({ caller }) func getAllOrders() : async [PurchaseOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all orders");
    };
    Iter.toArray(textMap.vals(purchaseOrders));
  };

  public shared ({ caller }) func createOrder(order : PurchaseOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create orders");
    };
    if (order.customer != caller) {
      Debug.trap("Unauthorized: Cannot create orders for other users");
    };
    purchaseOrders := textMap.put(purchaseOrders, order.id, order);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update order status");
    };
    switch (textMap.get(purchaseOrders, orderId)) {
      case null Debug.trap("Order not found");
      case (?order) {
        let updatedOrder = {
          order with
          status
        };
        purchaseOrders := textMap.put(purchaseOrders, orderId, updatedOrder);
      };
    };
  };

  // Test Ride Booking Operations
  public query ({ caller }) func getMyTestRides() : async [TestRideBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view test rides");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(testRideBookings),
        func(booking : TestRideBooking) : Bool {
          booking.customer == caller;
        },
      )
    );
  };

  public query ({ caller }) func getAllTestRides() : async [TestRideBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all test rides");
    };
    Iter.toArray(textMap.vals(testRideBookings));
  };

  public shared ({ caller }) func bookTestRide(booking : TestRideBooking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can book test rides");
    };
    if (booking.customer != caller) {
      Debug.trap("Unauthorized: Cannot book test rides for other users");
    };
    testRideBookings := textMap.put(testRideBookings, booking.id, booking);
  };

  public shared ({ caller }) func updateTestRideStatus(bookingId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update test ride status");
    };
    switch (textMap.get(testRideBookings, bookingId)) {
      case null Debug.trap("Test ride booking not found");
      case (?booking) {
        let updatedBooking = {
          booking with
          status
        };
        testRideBookings := textMap.put(testRideBookings, bookingId, updatedBooking);
      };
    };
  };

  // Service Appointment Operations
  public query ({ caller }) func getMyServiceAppointments() : async [ServiceAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view service appointments");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(serviceAppointments),
        func(appointment : ServiceAppointment) : Bool {
          appointment.customer == caller;
        },
      )
    );
  };

  public query ({ caller }) func getAllServiceAppointments() : async [ServiceAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all service appointments");
    };
    Iter.toArray(textMap.vals(serviceAppointments));
  };

  public shared ({ caller }) func bookServiceAppointment(appointment : ServiceAppointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can book service appointments");
    };
    if (appointment.customer != caller) {
      Debug.trap("Unauthorized: Cannot book service appointments for other users");
    };
    serviceAppointments := textMap.put(serviceAppointments, appointment.id, appointment);
  };

  public shared ({ caller }) func updateServiceAppointmentStatus(appointmentId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update service appointment status");
    };
    switch (textMap.get(serviceAppointments, appointmentId)) {
      case null Debug.trap("Service appointment not found");
      case (?appointment) {
        let updatedAppointment = {
          appointment with
          status
        };
        serviceAppointments := textMap.put(serviceAppointments, appointmentId, updatedAppointment);
      };
    };
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
