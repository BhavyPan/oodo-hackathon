import { motion } from "framer-motion";
import { useFleet } from "@/context/FleetContext";
import { DriverStatusBadge } from "@/components/StatusBadge";
import { Shield, AlertCircle } from "lucide-react";

export default function Drivers() {
  const { drivers } = useFleet();
  const now = new Date();
  const isExpired = (date: string) => new Date(date) < new Date();
  const isExpiringSoon = (date: string) => {
    const d = new Date(date);
    const diff = d.getTime() - now.getTime();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Driver Profiles</h1>
        <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest">Performance, compliance, and safety management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 glass p-5 space-y-4 active-reflection-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white uppercase tracking-wider">{d.name}</h3>
                <p className="text-xs text-primary mt-0.5">{d.phone}</p>
              </div>
              <DriverStatusBadge status={d.status} />
            </div>

            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${d.safetyScore >= 80 ? "text-success" : d.safetyScore >= 60 ? "text-warning" : "text-destructive"}`} />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1 uppercase tracking-wider">
                  <span className="text-muted-foreground">Safety Score</span>
                  <span className="font-bold text-white tracking-widest text-glow">{d.safetyScore}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.safetyScore >= 80 ? "bg-success shadow-[0_0_10px_#10b981cc]" : d.safetyScore >= 60 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${d.safetyScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-wider">
              <div>
                <p className="text-muted-foreground">Trips Completed</p>
                <p className="font-bold text-white mt-0.5 tracking-widest text-glow">{d.tripsCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">License Categories</p>
                <p className="font-bold text-white mt-0.5 tracking-widest">{d.licenseCategories.join(", ")}</p>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 ${isExpired(d.licenseExpiry) ? "bg-destructive/10 text-destructive" :
              isExpiringSoon(d.licenseExpiry) ? "bg-warning/10 text-warning" :
                "bg-success/10 text-success"
              }`}>
              {(isExpired(d.licenseExpiry) || isExpiringSoon(d.licenseExpiry)) && <AlertCircle className="h-3.5 w-3.5" />}
              <span className="font-medium">
                License {isExpired(d.licenseExpiry) ? "Expired" : "Expires"}: {new Date(d.licenseExpiry).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
