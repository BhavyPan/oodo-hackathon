import { motion } from "framer-motion";
import { Truck, AlertTriangle, Activity, Package, TrendingUp, Clock } from "lucide-react";
import KPICard from "@/components/KPICard";
import { vehicles, trips, drivers, getVehicleName, getDriverName } from "@/data/mockData";
import { VehicleStatusBadge, TripStatusBadge } from "@/components/StatusBadge";

export default function Dashboard() {
  const activeFleet = vehicles.filter(v => v.status === "On Trip").length;
  const inShop = vehicles.filter(v => v.status === "In Shop").length;
  const available = vehicles.filter(v => v.status === "Available").length;
  const utilization = Math.round((activeFleet / vehicles.filter(v => v.status !== "Retired").length) * 100);
  const pendingTrips = trips.filter(t => t.status === "Draft").length;
  const activeDrivers = drivers.filter(d => d.status === "On Duty" || d.status === "On Trip").length;

  const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-1">Fleet overview and real-time operations</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Active Fleet" value={activeFleet} subtitle="Vehicles on trip" icon={<Truck className="h-5 w-5" />} accent />
        <KPICard title="In Maintenance" value={inShop} subtitle="Vehicles in shop" icon={<AlertTriangle className="h-5 w-5" />} />
        <KPICard title="Available" value={available} subtitle="Ready to dispatch" icon={<Activity className="h-5 w-5" />} />
        <KPICard title="Utilization" value={`${utilization}%`} subtitle="Fleet efficiency" icon={<TrendingUp className="h-5 w-5" />} accent />
        <KPICard title="Pending Cargo" value={pendingTrips} subtitle="Awaiting assignment" icon={<Package className="h-5 w-5" />} />
        <KPICard title="Active Drivers" value={activeDrivers} subtitle="On duty today" icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Vehicle Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Vehicle</th>
                  <th className="pb-3 text-left font-medium">Plate</th>
                  <th className="pb-3 text-left font-medium">Type</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-card-foreground">{v.name}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{v.licensePlate}</td>
                    <td className="py-3 text-muted-foreground">{v.type}</td>
                    <td className="py-3"><VehicleStatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Trips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Trips</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Route</th>
                  <th className="pb-3 text-left font-medium">Driver</th>
                  <th className="pb-3 text-left font-medium">Vehicle</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(t => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3">
                      <span className="font-medium text-card-foreground">{t.origin}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="text-muted-foreground">{t.destination}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{getDriverName(t.driverId)}</td>
                    <td className="py-3 text-muted-foreground">{getVehicleName(t.vehicleId)}</td>
                    <td className="py-3"><TripStatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
