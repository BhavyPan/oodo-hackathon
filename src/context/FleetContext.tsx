import React, { createContext, useContext, useState, useEffect } from "react";
import {
    Vehicle,
    Driver,
    Trip,
    MaintenanceLog,
    FuelLog,
    vehicles as initialVehicles,
    drivers as initialDrivers,
    trips as initialTrips,
    maintenanceLogs as initialMaintenanceLogs,
    fuelLogs as initialFuelLogs,
    VehicleStatus,
    TripStatus,
    DriverStatus,
} from "@/data/mockData";

interface FleetContextType {
    vehicles: Vehicle[];
    drivers: Driver[];
    trips: Trip[];
    maintenanceLogs: MaintenanceLog[];
    fuelLogs: FuelLog[];

    // Vehicle Mutations
    addVehicle: (vehicle: Vehicle) => void;
    updateVehicle: (vehicle: Vehicle) => void;
    deleteVehicle: (id: string) => void;
    updateVehicleStatus: (id: string, status: VehicleStatus) => void;

    // Driver Mutations
    addDriver: (driver: Driver) => void;
    updateDriver: (driver: Driver) => void;
    deleteDriver: (id: string) => void;

    // Trip Mutations
    createTrip: (trip: Trip) => void;
    startTrip: (tripId: string) => void;
    completeTrip: (tripId: string, finalOdometer: number) => void;

    // Logs
    addMaintenanceLog: (log: MaintenanceLog) => void;
    completeMaintenanceLog: (logId: string) => void;
    addFuelLog: (log: FuelLog) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({ children }: { children: React.ReactNode }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
        const saved = localStorage.getItem("fleetData_vehicles");
        return saved ? JSON.parse(saved) : initialVehicles;
    });
    const [drivers, setDrivers] = useState<Driver[]>(() => {
        const saved = localStorage.getItem("fleetData_drivers");
        return saved ? JSON.parse(saved) : initialDrivers;
    });
    const [trips, setTrips] = useState<Trip[]>(() => {
        const saved = localStorage.getItem("fleetData_trips");
        return saved ? JSON.parse(saved) : initialTrips;
    });
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
        const saved = localStorage.getItem("fleetData_maintenanceLogs");
        return saved ? JSON.parse(saved) : initialMaintenanceLogs;
    });
    const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
        const saved = localStorage.getItem("fleetData_fuelLogs");
        return saved ? JSON.parse(saved) : initialFuelLogs;
    });

    // Persist to local storage whenever state changes
    useEffect(() => localStorage.setItem("fleetData_vehicles", JSON.stringify(vehicles)), [vehicles]);
    useEffect(() => localStorage.setItem("fleetData_drivers", JSON.stringify(drivers)), [drivers]);
    useEffect(() => localStorage.setItem("fleetData_trips", JSON.stringify(trips)), [trips]);
    useEffect(() => localStorage.setItem("fleetData_maintenanceLogs", JSON.stringify(maintenanceLogs)), [maintenanceLogs]);
    useEffect(() => localStorage.setItem("fleetData_fuelLogs", JSON.stringify(fuelLogs)), [fuelLogs]);


    // Vehicle Mutations
    const addVehicle = (vehicle: Vehicle) => setVehicles(prev => [...prev, vehicle]);

    const updateVehicle = (vehicle: Vehicle) => setVehicles(prev =>
        prev.map(v => v.id === vehicle.id ? vehicle : v)
    );

    const deleteVehicle = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id));

    const updateVehicleStatus = (id: string, status: VehicleStatus) => setVehicles(prev =>
        prev.map(v => v.id === id ? { ...v, status } : v)
    );

    // Driver Mutations
    const addDriver = (driver: Driver) => setDrivers(prev => [...prev, driver]);

    const updateDriver = (driver: Driver) => setDrivers(prev =>
        prev.map(d => d.id === driver.id ? driver : d)
    );

    const deleteDriver = (id: string) => setDrivers(prev => prev.filter(d => d.id !== id));

    // Trip Mutations
    const createTrip = (trip: Trip) => setTrips(prev => [...prev, trip]);

    const startTrip = (tripId: string) => {
        const tripToStart = trips.find(t => t.id === tripId);
        if (!tripToStart) return;

        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: "Dispatched" } : t));
        setVehicles(vPrev => vPrev.map(v => v.id === tripToStart.vehicleId ? { ...v, status: "On Trip" } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === tripToStart.driverId ? { ...d, status: "On Trip" } : d));
    };

    const completeTrip = (tripId: string, finalOdometer: number) => {
        const tripToComplete = trips.find(t => t.id === tripId);
        if (!tripToComplete) return;

        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: "Completed", completedAt: new Date().toISOString() } : t));
        setVehicles(vPrev => vPrev.map(v => v.id === tripToComplete.vehicleId ? { ...v, status: "Available", odometer: Math.max(v.odometer, finalOdometer) } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === tripToComplete.driverId ? { ...d, status: "On Duty", tripsCompleted: d.tripsCompleted + 1 } : d));
    };

    const addMaintenanceLog = (log: MaintenanceLog) => {
        setMaintenanceLogs(prev => [...prev, log]);
        // Force vehicle status to "In Shop"
        setVehicles(vPrev => vPrev.map(v => v.id === log.vehicleId ? { ...v, status: "In Shop" } : v));
    };

    const completeMaintenanceLog = (logId: string) => {
        const logToComplete = maintenanceLogs.find(l => l.id === logId);
        if (!logToComplete) return;

        setMaintenanceLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "Completed" } : l));
        setVehicles(prev => prev.map(v => v.id === logToComplete.vehicleId ? { ...v, status: "Available" } : v));
    };

    const addFuelLog = (log: FuelLog) => {
        setFuelLogs(prev => [...prev, log]);
        setVehicles(prev => prev.map(v => v.id === log.vehicleId ? { ...v, status: "Available" } : v));
    };

    return (
        <FleetContext.Provider value={{
            vehicles, drivers, trips, maintenanceLogs, fuelLogs,
            addVehicle, updateVehicle, deleteVehicle, updateVehicleStatus,
            addDriver, updateDriver, deleteDriver,
            createTrip, startTrip, completeTrip,
            addMaintenanceLog, completeMaintenanceLog, addFuelLog
        }}>
            {children}
        </FleetContext.Provider>
    );
}

export function useFleet() {
    const context = useContext(FleetContext);
    if (context === undefined) {
        throw new Error("useFleet must be used within a FleetProvider");
    }
    return context;
}
