use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

// Data structures for the shipping platform
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct User {
    pub id: Principal,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub user_type: UserType,
    pub created_at: u64,
    pub is_active: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum UserType {
    Customer,
    Driver,
    StoreOwner,
    Admin,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Shipment {
    pub id: String,
    pub sender_id: Principal,
    pub recipient_name: String,
    pub recipient_phone: String,
    pub pickup_address: Address,
    pub delivery_address: Address,
    pub package_details: PackageDetails,
    pub status: ShipmentStatus,
    pub driver_id: Option<Principal>,
    pub created_at: u64,
    pub updated_at: u64,
    pub estimated_delivery: Option<u64>,
    pub actual_delivery: Option<u64>,
    pub tracking_history: Vec<TrackingEvent>,
    pub payment_status: PaymentStatus,
    pub cost: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Address {
    pub street: String,
    pub city: String,
    pub state: String,
    pub postal_code: String,
    pub country: String,
    pub coordinates: Option<Coordinates>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PackageDetails {
    pub description: String,
    pub weight: f64,
    pub dimensions: Dimensions,
    pub value: f64,
    pub fragile: bool,
    pub special_instructions: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Dimensions {
    pub length: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum ShipmentStatus {
    Created,
    PickupScheduled,
    PickedUp,
    InTransit,
    OutForDelivery,
    Delivered,
    Failed,
    Returned,
    Cancelled,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum PaymentStatus {
    Pending,
    Paid,
    Failed,
    Refunded,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct TrackingEvent {
    pub timestamp: u64,
    pub status: ShipmentStatus,
    pub location: Option<String>,
    pub description: String,
    pub updated_by: Principal,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Driver {
    pub id: Principal,
    pub name: String,
    pub phone: String,
    pub vehicle_info: VehicleInfo,
    pub current_location: Option<Coordinates>,
    pub is_available: bool,
    pub rating: f64,
    pub total_deliveries: u32,
    pub joined_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct VehicleInfo {
    pub vehicle_type: String,
    pub license_plate: String,
    pub capacity: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ReturnRequest {
    pub id: String,
    pub shipment_id: String,
    pub requester_id: Principal,
    pub reason: String,
    pub status: ReturnStatus,
    pub created_at: u64,
    pub processed_at: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum ReturnStatus {
    Requested,
    Approved,
    Rejected,
    InProgress,
    Completed,
}

// Global state storage
thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
    static SHIPMENTS: RefCell<HashMap<String, Shipment>> = RefCell::new(HashMap::new());
    static DRIVERS: RefCell<HashMap<Principal, Driver>> = RefCell::new(HashMap::new());
    static RETURN_REQUESTS: RefCell<HashMap<String, ReturnRequest>> = RefCell::new(HashMap::new());
    static SHIPMENT_COUNTER: RefCell<u64> = RefCell::new(0);
    static RETURN_COUNTER: RefCell<u64> = RefCell::new(0);
}

// User management functions
#[update]
fn register_user(name: String, email: String, phone: String, user_type: UserType) -> Result<User, String> {
    let caller = ic_cdk::caller();
    
    // Check if user already exists
    let user_exists = USERS.with(|users| users.borrow().contains_key(&caller));
    if user_exists {
        return Err("User already registered".to_string());
    }

    let user = User {
        id: caller,
        name,
        email,
        phone,
        user_type,
        created_at: time(),
        is_active: true,
    };

    USERS.with(|users| {
        users.borrow_mut().insert(caller, user.clone());
    });

    Ok(user)
}

#[query]
fn get_user(user_id: Principal) -> Option<User> {
    USERS.with(|users| users.borrow().get(&user_id).cloned())
}

#[query]
fn get_current_user() -> Option<User> {
    let caller = ic_cdk::caller();
    USERS.with(|users| users.borrow().get(&caller).cloned())
}

// Shipment management functions
#[update]
fn create_shipment(
    recipient_name: String,
    recipient_phone: String,
    pickup_address: Address,
    delivery_address: Address,
    package_details: PackageDetails,
) -> Result<Shipment, String> {
    let caller = ic_cdk::caller();
    
    // Verify user exists and is authorized
    let user = USERS.with(|users| users.borrow().get(&caller).cloned());
    match user {
        Some(u) => match u.user_type {
            UserType::Customer | UserType::StoreOwner => {},
            _ => return Err("Unauthorized to create shipments".to_string()),
        },
        None => return Err("User not registered".to_string()),
    }

    let shipment_id = SHIPMENT_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        *c += 1;
        format!("SH{:06}", *c)
    });

    // Calculate cost based on distance and package details
    let cost = calculate_shipping_cost(&pickup_address, &delivery_address, &package_details);

    let shipment = Shipment {
        id: shipment_id.clone(),
        sender_id: caller,
        recipient_name,
        recipient_phone,
        pickup_address,
        delivery_address,
        package_details,
        status: ShipmentStatus::Created,
        driver_id: None,
        created_at: time(),
        updated_at: time(),
        estimated_delivery: None,
        actual_delivery: None,
        tracking_history: vec![TrackingEvent {
            timestamp: time(),
            status: ShipmentStatus::Created,
            location: None,
            description: "Shipment created".to_string(),
            updated_by: caller,
        }],
        payment_status: PaymentStatus::Pending,
        cost,
    };

    SHIPMENTS.with(|shipments| {
        shipments.borrow_mut().insert(shipment_id, shipment.clone());
    });

    Ok(shipment)
}

#[query]
fn get_shipment(shipment_id: String) -> Option<Shipment> {
    SHIPMENTS.with(|shipments| shipments.borrow().get(&shipment_id).cloned())
}

#[query]
fn get_user_shipments() -> Vec<Shipment> {
    let caller = ic_cdk::caller();
    SHIPMENTS.with(|shipments| {
        shipments
            .borrow()
            .values()
            .filter(|s| s.sender_id == caller)
            .cloned()
            .collect()
    })
}

#[update]
fn update_shipment_status(
    shipment_id: String,
    new_status: ShipmentStatus,
    location: Option<String>,
    description: String,
) -> Result<Shipment, String> {
    let caller = ic_cdk::caller();
    
    SHIPMENTS.with(|shipments| {
        let mut shipments_map = shipments.borrow_mut();
        match shipments_map.get_mut(&shipment_id) {
            Some(shipment) => {
                // Verify authorization
                if shipment.sender_id != caller && shipment.driver_id != Some(caller) {
                    // Check if caller is admin
                    let user = USERS.with(|users| users.borrow().get(&caller).cloned());
                    match user {
                        Some(u) => match u.user_type {
                            UserType::Admin => {},
                            _ => return Err("Unauthorized to update shipment".to_string()),
                        },
                        None => return Err("User not registered".to_string()),
                    }
                }

                shipment.status = new_status.clone();
                shipment.updated_at = time();
                
                // Add tracking event
                shipment.tracking_history.push(TrackingEvent {
                    timestamp: time(),
                    status: new_status,
                    location,
                    description,
                    updated_by: caller,
                });

                // Set actual delivery time if delivered
                if matches!(shipment.status, ShipmentStatus::Delivered) {
                    shipment.actual_delivery = Some(time());
                }

                Ok(shipment.clone())
            },
            None => Err("Shipment not found".to_string()),
        }
    })
}

// Driver management functions
#[update]
fn register_driver(
    name: String,
    phone: String,
    vehicle_info: VehicleInfo,
) -> Result<Driver, String> {
    let caller = ic_cdk::caller();
    
    // Check if driver already exists
    let driver_exists = DRIVERS.with(|drivers| drivers.borrow().contains_key(&caller));
    if driver_exists {
        return Err("Driver already registered".to_string());
    }

    let driver = Driver {
        id: caller,
        name,
        phone,
        vehicle_info,
        current_location: None,
        is_available: true,
        rating: 5.0,
        total_deliveries: 0,
        joined_at: time(),
    };

    DRIVERS.with(|drivers| {
        drivers.borrow_mut().insert(caller, driver.clone());
    });

    Ok(driver)
}

#[query]
fn get_available_drivers() -> Vec<Driver> {
    DRIVERS.with(|drivers| {
        drivers
            .borrow()
            .values()
            .filter(|d| d.is_available)
            .cloned()
            .collect()
    })
}

#[update]
fn assign_driver_to_shipment(shipment_id: String, driver_id: Principal) -> Result<Shipment, String> {
    let caller = ic_cdk::caller();
    
    // Verify caller is admin or the driver themselves
    let user = USERS.with(|users| users.borrow().get(&caller).cloned());
    let is_authorized = match user {
        Some(u) => matches!(u.user_type, UserType::Admin) || caller == driver_id,
        None => false,
    };

    if !is_authorized {
        return Err("Unauthorized to assign driver".to_string());
    }

    SHIPMENTS.with(|shipments| {
        let mut shipments_map = shipments.borrow_mut();
        match shipments_map.get_mut(&shipment_id) {
            Some(shipment) => {
                shipment.driver_id = Some(driver_id);
                shipment.status = ShipmentStatus::PickupScheduled;
                shipment.updated_at = time();
                
                shipment.tracking_history.push(TrackingEvent {
                    timestamp: time(),
                    status: ShipmentStatus::PickupScheduled,
                    location: None,
                    description: "Driver assigned and pickup scheduled".to_string(),
                    updated_by: caller,
                });

                Ok(shipment.clone())
            },
            None => Err("Shipment not found".to_string()),
        }
    })
}

// Return management functions
#[update]
fn create_return_request(shipment_id: String, reason: String) -> Result<ReturnRequest, String> {
    let caller = ic_cdk::caller();
    
    // Verify shipment exists and caller is authorized
    let shipment = SHIPMENTS.with(|shipments| {
        shipments.borrow().get(&shipment_id).cloned()
    });

    match shipment {
        Some(s) => {
            if s.sender_id != caller {
                return Err("Unauthorized to request return".to_string());
            }
            if !matches!(s.status, ShipmentStatus::Delivered) {
                return Err("Can only return delivered shipments".to_string());
            }
        },
        None => return Err("Shipment not found".to_string()),
    }

    let return_id = RETURN_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        *c += 1;
        format!("RT{:06}", *c)
    });

    let return_request = ReturnRequest {
        id: return_id.clone(),
        shipment_id,
        requester_id: caller,
        reason,
        status: ReturnStatus::Requested,
        created_at: time(),
        processed_at: None,
    };

    RETURN_REQUESTS.with(|returns| {
        returns.borrow_mut().insert(return_id, return_request.clone());
    });

    Ok(return_request)
}

#[query]
fn get_return_requests() -> Vec<ReturnRequest> {
    let caller = ic_cdk::caller();
    RETURN_REQUESTS.with(|returns| {
        returns
            .borrow()
            .values()
            .filter(|r| r.requester_id == caller)
            .cloned()
            .collect()
    })
}

// Utility functions
fn calculate_shipping_cost(
    _pickup: &Address,
    _delivery: &Address,
    package: &PackageDetails,
) -> f64 {
    // Simple cost calculation based on weight and value
    let base_cost = 10.0;
    let weight_cost = package.weight * 2.0;
    let value_cost = package.value * 0.01;
    let fragile_cost = if package.fragile { 5.0 } else { 0.0 };
    
    base_cost + weight_cost + value_cost + fragile_cost
}

// Analytics and reporting functions
#[query]
fn get_platform_stats() -> PlatformStats {
    let total_users = USERS.with(|users| users.borrow().len() as u32);
    let total_shipments = SHIPMENTS.with(|shipments| shipments.borrow().len() as u32);
    let total_drivers = DRIVERS.with(|drivers| drivers.borrow().len() as u32);
    
    let (delivered_shipments, pending_shipments) = SHIPMENTS.with(|shipments| {
        let shipments_map = shipments.borrow();
        let delivered = shipments_map
            .values()
            .filter(|s| matches!(s.status, ShipmentStatus::Delivered))
            .count() as u32;
        let pending = shipments_map
            .values()
            .filter(|s| !matches!(s.status, ShipmentStatus::Delivered | ShipmentStatus::Cancelled))
            .count() as u32;
        (delivered, pending)
    });

    PlatformStats {
        total_users,
        total_shipments,
        total_drivers,
        delivered_shipments,
        pending_shipments,
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PlatformStats {
    pub total_users: u32,
    pub total_shipments: u32,
    pub total_drivers: u32,
    pub delivered_shipments: u32,
    pub pending_shipments: u32,
}

// Export candid interface
ic_cdk::export_candid!();

