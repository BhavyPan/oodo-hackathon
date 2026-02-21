export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";
export type VehicleType = "Truck" | "Van" | "Bike";
export type DriverStatus = "On Duty" | "Off Duty" | "Suspended" | "On Trip";
export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  status: VehicleStatus;
  region: string;
  lastService: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseExpiry: string;
  licenseCategories: VehicleType[];
  status: DriverStatus;
  safetyScore: number;
  tripsCompleted: number;
  phone: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  status: TripStatus;
  createdAt: string;
  completedAt?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
  odometer: number;
}

export const vehicles: Vehicle[] = [
  { id: "v1", name: "Freightliner M2", type: "Truck", licensePlate: "TRK-1001", maxCapacity: 8000, odometer: 124500, status: "On Trip", region: "North", lastService: "2025-12-10" },
  { id: "v2", name: "Mercedes Sprinter", type: "Van", licensePlate: "VAN-2034", maxCapacity: 1500, odometer: 67200, status: "Available", region: "South", lastService: "2026-01-15" },
  { id: "v3", name: "Isuzu NPR", type: "Truck", licensePlate: "TRK-1042", maxCapacity: 5500, odometer: 89300, status: "In Shop", region: "East", lastService: "2026-02-01" },
  { id: "v4", name: "Ford Transit", type: "Van", licensePlate: "VAN-2078", maxCapacity: 1200, odometer: 43100, status: "Available", region: "West", lastService: "2026-01-28" },
  { id: "v5", name: "Honda PCX", type: "Bike", licensePlate: "BKE-3012", maxCapacity: 30, odometer: 15200, status: "On Trip", region: "Central", lastService: "2026-02-10" },
  { id: "v6", name: "Volvo FH16", type: "Truck", licensePlate: "TRK-1088", maxCapacity: 12000, odometer: 210400, status: "Available", region: "North", lastService: "2025-11-20" },
  { id: "v7", name: "Peugeot Partner", type: "Van", licensePlate: "VAN-2091", maxCapacity: 800, odometer: 52600, status: "Retired", region: "South", lastService: "2025-08-05" },
  { id: "v8", name: "Yamaha NMAX", type: "Bike", licensePlate: "BKE-3045", maxCapacity: 25, odometer: 8900, status: "Available", region: "Central", lastService: "2026-02-14" },
];

export const drivers: Driver[] = [
  { id: "d1", name: "Alex Martinez", licenseExpiry: "2027-06-15", licenseCategories: ["Truck", "Van"], status: "On Trip", safetyScore: 92, tripsCompleted: 187, phone: "+1 555-0101" },
  { id: "d2", name: "Sarah Chen", licenseExpiry: "2026-03-20", licenseCategories: ["Van", "Bike"], status: "On Duty", safetyScore: 97, tripsCompleted: 234, phone: "+1 555-0102" },
  { id: "d3", name: "James Okoro", licenseExpiry: "2025-12-01", licenseCategories: ["Truck"], status: "Off Duty", safetyScore: 78, tripsCompleted: 145, phone: "+1 555-0103" },
  { id: "d4", name: "Maria Santos", licenseExpiry: "2028-01-10", licenseCategories: ["Truck", "Van", "Bike"], status: "On Trip", safetyScore: 95, tripsCompleted: 312, phone: "+1 555-0104" },
  { id: "d5", name: "Tom Wilson", licenseExpiry: "2026-08-30", licenseCategories: ["Van"], status: "Suspended", safetyScore: 54, tripsCompleted: 89, phone: "+1 555-0105" },
  { id: "d6", name: "Lena Petrova", licenseExpiry: "2027-11-22", licenseCategories: ["Truck", "Van"], status: "On Duty", safetyScore: 88, tripsCompleted: 201, phone: "+1 555-0106" },
];

export const trips: Trip[] = [
  { id: "t1", vehicleId: "v1", driverId: "d1", origin: "Warehouse A", destination: "Port Terminal", cargoWeight: 6200, status: "Dispatched", createdAt: "2026-02-20T08:30:00" },
  { id: "t2", vehicleId: "v5", driverId: "d4", origin: "Hub Central", destination: "District 5 Depot", cargoWeight: 22, status: "Dispatched", createdAt: "2026-02-20T09:15:00" },
  { id: "t3", vehicleId: "v2", driverId: "d2", origin: "Factory B", destination: "Retail Store 12", cargoWeight: 980, status: "Completed", createdAt: "2026-02-19T07:00:00", completedAt: "2026-02-19T14:30:00" },
  { id: "t4", vehicleId: "v6", driverId: "d6", origin: "Distribution Center", destination: "Airport Cargo", cargoWeight: 9500, status: "Draft", createdAt: "2026-02-20T10:00:00" },
  { id: "t5", vehicleId: "v4", driverId: "d3", origin: "Supplier C", destination: "Warehouse A", cargoWeight: 750, status: "Completed", createdAt: "2026-02-18T06:00:00", completedAt: "2026-02-18T11:45:00" },
  { id: "t6", vehicleId: "v2", driverId: "d2", origin: "Port Terminal", destination: "Cold Storage", cargoWeight: 1100, status: "Cancelled", createdAt: "2026-02-17T13:00:00" },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: "m1", vehicleId: "v3", type: "Oil Change", description: "Scheduled 10k km oil change", cost: 320, date: "2026-02-18", status: "In Progress" },
  { id: "m2", vehicleId: "v1", type: "Tire Replacement", description: "Front axle tire replacement", cost: 1200, date: "2026-02-10", status: "Completed" },
  { id: "m3", vehicleId: "v6", type: "Brake Inspection", description: "Annual brake system inspection", cost: 450, date: "2026-02-15", status: "Completed" },
  { id: "m4", vehicleId: "v2", type: "AC Repair", description: "Compressor replacement", cost: 890, date: "2026-02-20", status: "Scheduled" },
  { id: "m5", vehicleId: "v7", type: "Engine Overhaul", description: "Major engine rebuild before retirement", cost: 4500, date: "2025-07-20", status: "Completed" },
];

export const fuelLogs: FuelLog[] = [
  { id: "f1", vehicleId: "v1", liters: 120, cost: 198, date: "2026-02-19", odometer: 124300 },
  { id: "f2", vehicleId: "v2", liters: 55, cost: 90.75, date: "2026-02-18", odometer: 67100 },
  { id: "f3", vehicleId: "v5", liters: 8, cost: 13.20, date: "2026-02-19", odometer: 15100 },
  { id: "f4", vehicleId: "v6", liters: 180, cost: 297, date: "2026-02-17", odometer: 210200 },
  { id: "f5", vehicleId: "v4", liters: 45, cost: 74.25, date: "2026-02-16", odometer: 42900 },
  { id: "f6", vehicleId: "v1", liters: 115, cost: 189.75, date: "2026-02-15", odometer: 124000 },
  { id: "f7", vehicleId: "v2", liters: 50, cost: 82.50, date: "2026-02-14", odometer: 66800 },
];

export function getVehicleName(vehicleId: string): string {
  return vehicles.find(v => v.id === vehicleId)?.name ?? "Unknown";
}

export function getDriverName(driverId: string): string {
  return drivers.find(d => d.id === driverId)?.name ?? "Unknown";
}
