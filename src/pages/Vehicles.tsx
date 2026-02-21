import { motion } from "framer-motion";
import { useState } from "react";
import { vehicles } from "@/data/mockData";
import { VehicleStatusBadge } from "@/components/StatusBadge";
import { Search, Filter } from "lucide-react";
import type { VehicleType, VehicleStatus } from "@/data/mockData";

export default function Vehicles() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "All">("All");

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.licensePlate.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Vehicle Registry</h1>
        <p className="text-muted-foreground mt-1">Manage fleet assets and availability</p>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-card pl-10 pr-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as VehicleType | "All")}
          className="rounded-lg border bg-card px-3 py-2.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Types</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Bike">Bike</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as VehicleStatus | "All")}
          className="rounded-lg border bg-card px-3 py-2.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                <th className="px-5 py-3.5 text-left font-medium">License Plate</th>
                <th className="px-5 py-3.5 text-left font-medium">Type</th>
                <th className="px-5 py-3.5 text-left font-medium">Max Capacity</th>
                <th className="px-5 py-3.5 text-left font-medium">Odometer</th>
                <th className="px-5 py-3.5 text-left font-medium">Region</th>
                <th className="px-5 py-3.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-card-foreground">{v.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{v.licensePlate}</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.maxCapacity.toLocaleString()} kg</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.odometer.toLocaleString()} km</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.region}</td>
                  <td className="px-5 py-4"><VehicleStatusBadge status={v.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No vehicles match your filters.</div>
        )}
      </motion.div>
    </div>
  );
}
