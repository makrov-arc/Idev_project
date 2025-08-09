import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// Canister IDs (will be set after deployment)
const BACKEND_CANISTER_ID = process.env.CANISTER_ID_IDEV_SHIPPING_ICP_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

// IDL (Interface Description Language) for the backend canister
const idlFactory = ({ IDL }) => {
  const UserType = IDL.Variant({
    'Customer': IDL.Null,
    'Driver': IDL.Null,
    'StoreOwner': IDL.Null,
    'Admin': IDL.Null,
  });

  const User = IDL.Record({
    'id': IDL.Principal,
    'name': IDL.Text,
    'email': IDL.Text,
    'phone': IDL.Text,
    'user_type': UserType,
    'created_at': IDL.Nat64,
    'is_active': IDL.Bool,
  });

  const Coordinates = IDL.Record({
    'latitude': IDL.Float64,
    'longitude': IDL.Float64,
  });

  const Address = IDL.Record({
    'street': IDL.Text,
    'city': IDL.Text,
    'state': IDL.Text,
    'postal_code': IDL.Text,
    'country': IDL.Text,
    'coordinates': IDL.Opt(Coordinates),
  });

  const Dimensions = IDL.Record({
    'length': IDL.Float64,
    'width': IDL.Float64,
    'height': IDL.Float64,
  });

  const PackageDetails = IDL.Record({
    'description': IDL.Text,
    'weight': IDL.Float64,
    'dimensions': Dimensions,
    'value': IDL.Float64,
    'fragile': IDL.Bool,
    'special_instructions': IDL.Opt(IDL.Text),
  });

  const ShipmentStatus = IDL.Variant({
    'Created': IDL.Null,
    'PickupScheduled': IDL.Null,
    'PickedUp': IDL.Null,
    'InTransit': IDL.Null,
    'OutForDelivery': IDL.Null,
    'Delivered': IDL.Null,
    'Failed': IDL.Null,
    'Returned': IDL.Null,
    'Cancelled': IDL.Null,
  });

  const PaymentStatus = IDL.Variant({
    'Pending': IDL.Null,
    'Paid': IDL.Null,
    'Failed': IDL.Null,
    'Refunded': IDL.Null,
  });

  const TrackingEvent = IDL.Record({
    'timestamp': IDL.Nat64,
    'status': ShipmentStatus,
    'location': IDL.Opt(IDL.Text),
    'description': IDL.Text,
    'updated_by': IDL.Principal,
  });

  const Shipment = IDL.Record({
    'id': IDL.Text,
    'sender_id': IDL.Principal,
    'recipient_name': IDL.Text,
    'recipient_phone': IDL.Text,
    'pickup_address': Address,
    'delivery_address': Address,
    'package_details': PackageDetails,
    'status': ShipmentStatus,
    'driver_id': IDL.Opt(IDL.Principal),
    'created_at': IDL.Nat64,
    'updated_at': IDL.Nat64,
    'estimated_delivery': IDL.Opt(IDL.Nat64),
    'actual_delivery': IDL.Opt(IDL.Nat64),
    'tracking_history': IDL.Vec(TrackingEvent),
    'payment_status': PaymentStatus,
    'cost': IDL.Float64,
  });

  const VehicleInfo = IDL.Record({
    'vehicle_type': IDL.Text,
    'license_plate': IDL.Text,
    'capacity': IDL.Float64,
  });

  const Driver = IDL.Record({
    'id': IDL.Principal,
    'name': IDL.Text,
    'phone': IDL.Text,
    'vehicle_info': VehicleInfo,
    'current_location': IDL.Opt(Coordinates),
    'is_available': IDL.Bool,
    'rating': IDL.Float64,
    'total_deliveries': IDL.Nat32,
    'joined_at': IDL.Nat64,
  });

  const ReturnStatus = IDL.Variant({
    'Requested': IDL.Null,
    'Approved': IDL.Null,
    'Rejected': IDL.Null,
    'InProgress': IDL.Null,
    'Completed': IDL.Null,
  });

  const ReturnRequest = IDL.Record({
    'id': IDL.Text,
    'shipment_id': IDL.Text,
    'requester_id': IDL.Principal,
    'reason': IDL.Text,
    'status': ReturnStatus,
    'created_at': IDL.Nat64,
    'processed_at': IDL.Opt(IDL.Nat64),
  });

  const PlatformStats = IDL.Record({
    'total_users': IDL.Nat32,
    'total_shipments': IDL.Nat32,
    'total_drivers': IDL.Nat32,
    'delivered_shipments': IDL.Nat32,
    'pending_shipments': IDL.Nat32,
  });

  return IDL.Service({
    'register_user': IDL.Func([IDL.Text, IDL.Text, IDL.Text, UserType], [IDL.Variant({ 'Ok': User, 'Err': IDL.Text })], []),
    'get_user': IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'get_current_user': IDL.Func([], [IDL.Opt(User)], ['query']),
    'create_shipment': IDL.Func([IDL.Text, IDL.Text, Address, Address, PackageDetails], [IDL.Variant({ 'Ok': Shipment, 'Err': IDL.Text })], []),
    'get_shipment': IDL.Func([IDL.Text], [IDL.Opt(Shipment)], ['query']),
    'get_user_shipments': IDL.Func([], [IDL.Vec(Shipment)], ['query']),
    'update_shipment_status': IDL.Func([IDL.Text, ShipmentStatus, IDL.Opt(IDL.Text), IDL.Text], [IDL.Variant({ 'Ok': Shipment, 'Err': IDL.Text })], []),
    'register_driver': IDL.Func([IDL.Text, IDL.Text, VehicleInfo], [IDL.Variant({ 'Ok': Driver, 'Err': IDL.Text })], []),
    'get_available_drivers': IDL.Func([], [IDL.Vec(Driver)], ['query']),
    'assign_driver_to_shipment': IDL.Func([IDL.Text, IDL.Principal], [IDL.Variant({ 'Ok': Shipment, 'Err': IDL.Text })], []),
    'create_return_request': IDL.Func([IDL.Text, IDL.Text], [IDL.Variant({ 'Ok': ReturnRequest, 'Err': IDL.Text })], []),
    'get_return_requests': IDL.Func([], [IDL.Vec(ReturnRequest)], ['query']),
    'get_platform_stats': IDL.Func([], [PlatformStats], ['query']),
  });
};

class ICPService {
  constructor() {
    this.authClient = null;
    this.actor = null;
    this.isAuthenticated = false;
    this.identity = null;
  }

  async init() {
    try {
      this.authClient = await AuthClient.create();
      this.isAuthenticated = await this.authClient.isAuthenticated();
      
      if (this.isAuthenticated) {
        this.identity = this.authClient.getIdentity();
        await this.createActor();
      }
    } catch (error) {
      console.error('Failed to initialize ICP service:', error);
    }
  }

  async createActor() {
    const agent = new HttpAgent({
      identity: this.identity,
      host: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app',
    });

    // Fetch root key for local development
    if (process.env.NODE_ENV === 'development') {
      await agent.fetchRootKey();
    }

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  }

  async login() {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.authClient.login({
        identityProvider: process.env.NODE_ENV === 'development' 
          ? `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}`
          : 'https://identity.ic0.app',
        onSuccess: async () => {
          this.isAuthenticated = true;
          this.identity = this.authClient.getIdentity();
          await this.createActor();
          resolve(true);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          reject(error);
        },
      });
    });
  }

  async logout() {
    if (this.authClient) {
      await this.authClient.logout();
      this.isAuthenticated = false;
      this.identity = null;
      this.actor = null;
    }
  }

  getPrincipal() {
    return this.identity?.getPrincipal();
  }

  // User management methods
  async registerUser(name, email, phone, userType) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const userTypeVariant = { [userType]: null };
    const result = await this.actor.register_user(name, email, phone, userTypeVariant);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  async getCurrentUser() {
    if (!this.actor) return null;
    return await this.actor.get_current_user();
  }

  async getUser(principalId) {
    if (!this.actor) return null;
    return await this.actor.get_user(Principal.fromText(principalId));
  }

  // Shipment management methods
  async createShipment(shipmentData) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const result = await this.actor.create_shipment(
      shipmentData.recipientName,
      shipmentData.recipientPhone,
      shipmentData.pickupAddress,
      shipmentData.deliveryAddress,
      shipmentData.packageDetails
    );
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  async getShipment(shipmentId) {
    if (!this.actor) return null;
    return await this.actor.get_shipment(shipmentId);
  }

  async getUserShipments() {
    if (!this.actor) return [];
    return await this.actor.get_user_shipments();
  }

  async updateShipmentStatus(shipmentId, status, location, description) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const statusVariant = { [status]: null };
    const result = await this.actor.update_shipment_status(
      shipmentId,
      statusVariant,
      location ? [location] : [],
      description
    );
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  // Driver management methods
  async registerDriver(name, phone, vehicleInfo) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const result = await this.actor.register_driver(name, phone, vehicleInfo);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  async getAvailableDrivers() {
    if (!this.actor) return [];
    return await this.actor.get_available_drivers();
  }

  async assignDriverToShipment(shipmentId, driverId) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const result = await this.actor.assign_driver_to_shipment(
      shipmentId,
      Principal.fromText(driverId)
    );
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  // Return management methods
  async createReturnRequest(shipmentId, reason) {
    if (!this.actor) throw new Error('Not authenticated');
    
    const result = await this.actor.create_return_request(shipmentId, reason);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }
    return result.Ok;
  }

  async getReturnRequests() {
    if (!this.actor) return [];
    return await this.actor.get_return_requests();
  }

  // Analytics methods
  async getPlatformStats() {
    if (!this.actor) return null;
    return await this.actor.get_platform_stats();
  }

  // Utility methods
  formatTimestamp(timestamp) {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  }

  formatPrincipal(principal) {
    return principal.toString();
  }
}

// Create singleton instance
const icpService = new ICPService();

export default icpService;

