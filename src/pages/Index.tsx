import { motion, useScroll, useTransform } from "framer-motion";
import { Truck, AlertTriangle, Activity, Package, TrendingUp, Clock, ChevronRight, ArrowDown } from "lucide-react";
import KPICard from "@/components/KPICard";
import { useFleet } from "@/context/FleetContext";
import { VehicleStatusBadge, TripStatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Dashboard() {
  const { vehicles, trips, drivers } = useFleet();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  const getVehicleName = (id: string) => vehicles.find(v => v.id === id)?.name || "Unknown";
  const getDriverName = (id: string) => drivers.find(d => d.id === id)?.name || "Unknown";

  const activeFleet = vehicles.filter(v => v.status === "On Trip").length;
  const inShop = vehicles.filter(v => v.status === "In Shop").length;
  const available = vehicles.filter(v => v.status === "Available").length;
  const utilization = Math.round((activeFleet / vehicles.filter(v => v.status !== "Retired").length) * 100) || 0;
  const pendingTrips = trips.filter(t => t.status === "Draft").length;
  const activeDrivers = drivers.filter(d => d.status === "On Duty" || d.status === "On Trip").length;

  const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div ref={containerRef} className="pb-40 ">

      {/* Massive Hero Section */}
      <motion.div
        className="min-h-[85vh] flex flex-col justify-center items-center relative overflow-hidden text-center px-4"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-24 bg-primary hidden md:block"></div>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-sm md:text-base text-glow">Live Telemetry Active</p>
            <div className="h-px w-24 bg-primary hidden md:block"></div>
          </div>

          <h1 className="text-white font-black tracking-tighter uppercase leading-[0.85] text-glow mix-blend-screen" style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}>
            OPERATIONS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">COMMAND</span>
          </h1>

          <p className="mt-8 text-white/50 max-w-2xl mx-auto text-sm md:text-base font-bold tracking-widest uppercase leading-relaxed">
            Real-time trajectory tracking, global logistics coordination, and elite fleet management protocol.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Scroll to initialize</span>
          <ArrowDown className="h-6 w-6 text-primary drop-shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
        </motion.div>
      </motion.div>

      {/* Grid Content - Revealed on Scroll */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-24 relative z-20">

        {/* KPI Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          <KPICard title="Active Fleet" value={activeFleet} subtitle="Vehicles on route" icon={<Truck className="h-8 w-8" />} accent />
          <KPICard title="Maintenance" value={inShop} subtitle="Vehicles in shop" icon={<AlertTriangle className="h-8 w-8" />} />
          <KPICard title="Utilization" value={`${utilization}%`} subtitle="Fleet efficiency" icon={<TrendingUp className="h-8 w-8" />} accent />
          <KPICard title="Available" value={available} subtitle="Ready to dispatch" icon={<Activity className="h-8 w-8" />} />
          <KPICard title="Pending Cargo" value={pendingTrips} subtitle="Awaiting assignment" icon={<Package className="h-8 w-8" />} />
          <KPICard title="Active Drivers" value={activeDrivers} subtitle="On duty today" icon={<Clock className="h-8 w-8" />} />
        </motion.div>

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

          {/* Vehicle Status Overview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-[2rem] glass p-8 md:p-12 active-reflection-border group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter text-glow">Fleet Radar</h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 10px rgba(204,255,0,0.8)" }} />
                  <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Live Telemetry Array</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-white/10 text-white/40">
                    <th className="pb-6 text-left font-black uppercase tracking-[0.2em] text-[10px]">Identity / Unit</th>
                    <th className="pb-6 text-left font-black uppercase tracking-[0.2em] text-[10px]">Class / Rating</th>
                    <th className="pb-6 text-right font-black uppercase tracking-[0.2em] text-[10px]">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vehicles.slice(0, 6).map((v, i) => (
                    <motion.tr
                      key={v.id}
                      className="group/row hover:bg-white/5 transition-colors "
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <td className="py-6">
                        <div className="font-black text-lg text-white group-hover/row:text-primary transition-colors tracking-tighter uppercase">{v.name}</div>
                        <div className="text-white/40 font-mono text-[10px] tracking-widest mt-1">{v.licensePlate}</div>
                      </td>
                      <td className="py-6 text-white/50 font-bold tracking-widest uppercase text-xs">{v.type}</td>
                      <td className="py-6 text-right"><VehicleStatusBadge status={v.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <Link to="/vehicles" className="inline-flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors group/link ">
                Access Full Registry <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-2" />
              </Link>
            </div>
          </motion.div>

          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-[2rem] glass p-8 md:p-12 active-reflection-border group relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter text-glow">Active Routes</h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" style={{ boxShadow: "0 0 10px rgba(204,255,0,0.8)" }} />
                  <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Global Dispatch Feed</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-white/10 text-white/40">
                    <th className="pb-6 text-left font-black uppercase tracking-[0.2em] text-[10px]">Trajectory Setup</th>
                    <th className="pb-6 text-left font-black uppercase tracking-[0.2em] text-[10px]">Pilot ID</th>
                    <th className="pb-6 text-right font-black uppercase tracking-[0.2em] text-[10px]">State Sequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTrips.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      className="group/row hover:bg-white/5 transition-colors "
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <td className="py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-white group-hover/row:text-primary transition-colors tracking-tighter uppercase text-base">{t.origin}</span>
                          <div className="flex items-center gap-2 text-white/30 ml-2">
                            <div className="w-px h-4 bg-white/20"></div>
                            <ArrowDown className="h-3 w-3" />
                          </div>
                          <span className="text-white/60 font-bold uppercase tracking-widest text-xs">{t.destination}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="text-white/80 font-bold uppercase tracking-wider text-xs">{getDriverName(t.driverId)}</div>
                        <div className="text-white/30 font-mono text-[10px] tracking-widest mt-1">{getVehicleName(t.vehicleId)}</div>
                      </td>
                      <td className="py-6 text-right"><TripStatusBadge status={t.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <Link to="/trips" className="inline-flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors group/link ">
                Access Route Logs <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
