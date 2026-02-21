import { motion } from "framer-motion";
import { drivers } from "@/data/mockData";
import { DriverStatusBadge } from "@/components/StatusBadge";
import { Shield, AlertCircle } from "lucide-react";

export default function Drivers() {
  const isExpired = (date: string) => new Date(date) < new Date();
  const isExpiringSoon = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Driver Profiles</h1>
        <p className="text-muted-foreground mt-1">Performance, compliance, and safety management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">{d.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{d.phone}</p>
              </div>
              <DriverStatusBadge status={d.status} />
            </div>

            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${d.safetyScore >= 80 ? "text-success" : d.safetyScore >= 60 ? "text-warning" : "text-destructive"}`} />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Safety Score</span>
                  <span className="font-semibold text-card-foreground">{d.safetyScore}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.safetyScore >= 80 ? "bg-success" : d.safetyScore >= 60 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${d.safetyScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Trips Completed</p>
                <p className="font-semibold text-card-foreground mt-0.5">{d.tripsCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">License Categories</p>
                <p className="font-semibold text-card-foreground mt-0.5">{d.licenseCategories.join(", ")}</p>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 ${
              isExpired(d.licenseExpiry) ? "bg-destructive/10 text-destructive" :
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
