import { motion } from "framer-motion";
import { trips, getVehicleName, getDriverName } from "@/data/mockData";
import { TripStatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import type { TripStatus } from "@/data/mockData";

export default function Trips() {
  const [statusFilter, setStatusFilter] = useState<TripStatus | "All">("All");

  const filtered = statusFilter === "All" ? trips : trips.filter(t => t.status === statusFilter);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trip Dispatcher</h1>
          <p className="text-muted-foreground mt-1">Manage shipments and dispatch operations</p>
        </div>
        <button className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity">
          + New Trip
        </button>
      </motion.div>

      <div className="flex gap-2">
        {(["All", "Draft", "Dispatched", "Completed", "Cancelled"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                <th className="px-5 py-3.5 text-left font-medium">Route</th>
                <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                <th className="px-5 py-3.5 text-left font-medium">Driver</th>
                <th className="px-5 py-3.5 text-left font-medium">Cargo (kg)</th>
                <th className="px-5 py-3.5 text-left font-medium">Created</th>
                <th className="px-5 py-3.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-card-foreground">{t.origin}</span>
                    <span className="text-muted-foreground mx-1.5">→</span>
                    <span className="text-muted-foreground">{t.destination}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{getVehicleName(t.vehicleId)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{getDriverName(t.driverId)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{t.cargoWeight.toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4"><TripStatusBadge status={t.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
