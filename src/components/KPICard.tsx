import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  accent?: boolean;
}

export default function KPICard({ title, value, subtitle, icon, accent }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-5 glass active-reflection active-reflection-border ${accent ? "border-primary/50 shadow-[0_0_15px_#ccff001a]" : "border-white/10 hover:border-white/30"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-3xl font-bold text-white tracking-widest text-glow">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${accent ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-muted-foreground border border-white/10"}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
