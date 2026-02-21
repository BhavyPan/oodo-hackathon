import { motion } from "framer-motion";
import { maintenanceLogs, getVehicleName } from "@/data/mockData";
import { Wrench, Clock, CheckCircle2 } from "lucide-react";

const statusIcon = {
  Scheduled: <Clock className="h-4 w-4 text-info" />,
  "In Progress": <Wrench className="h-4 w-4 text-warning" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
};

const statusColor = {
  Scheduled: "status-on-trip",
  "In Progress": "status-in-shop",
  Completed: "status-available",
};

export default function Maintenance() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance & Service Logs</h1>
          <p className="text-muted-foreground mt-1">Preventative and reactive fleet health tracking</p>
        </div>
        <button className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity">
          + Log Service
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                <th className="px-5 py-3.5 text-left font-medium">Service Type</th>
                <th className="px-5 py-3.5 text-left font-medium">Description</th>
                <th className="px-5 py-3.5 text-left font-medium">Cost</th>
                <th className="px-5 py-3.5 text-left font-medium">Date</th>
                <th className="px-5 py-3.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceLogs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-card-foreground">{getVehicleName(log.vehicleId)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{log.type}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-[240px] truncate">{log.description}</td>
                  <td className="px-5 py-4 font-medium text-card-foreground">${log.cost.toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5">
                      {statusIcon[log.status]}
                      <span className={statusColor[log.status]}>{log.status}</span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
