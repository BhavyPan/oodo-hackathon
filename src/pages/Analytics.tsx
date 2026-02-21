import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import { useFleet } from "@/context/FleetContext";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["hsl(152, 60%, 42%)", "hsl(210, 80%, 55%)", "hsl(38, 92%, 50%)", "hsl(220, 10%, 60%)"];

// Simulated average payload revenue per km depending on the vehicle type
const REVENUE_PER_KM = {
  Truck: 5.5,
  Van: 2.5,
  Bike: 1.0,
};

const SIMULATED_ACQUISITION_COST = {
  Truck: 80000,
  Van: 35000,
  Bike: 5000,
};

export default function Analytics() {
  const { vehicles, fuelLogs, maintenanceLogs, trips } = useFleet();

  // Vehicle status distribution
  const statusCounts: Record<string, number> = {
    "Available": 0,
    "On Trip": 0,
    "Maintenance (In Shop)": 0,
    "Retired": 0,
  };

  vehicles.forEach((v) => {
    const key = v.status === "In Shop" ? "Maintenance (In Shop)" : v.status;
    statusCounts[key] = (statusCounts[key] || 0) + 1;
  });

  const pieData = Object.entries(statusCounts)
    .filter(([_, value]) => value >= 0) // Keep them all to show in legend
    .map(([name, value]) => ({ name, value }));

  // Fuel efficiency and ROI by vehicle
  const vehicleStats = vehicles
    .filter(v => v.status !== "Retired")
    .map(v => {
      const vFuelLogs = fuelLogs.filter(f => f.vehicleId === v.id);
      const vMaintLogs = maintenanceLogs.filter(m => m.vehicleId === v.id);

      const totalFuelCost = vFuelLogs.reduce((s, l) => s + l.cost, 0);
      const totalLiters = vFuelLogs.reduce((s, l) => s + l.liters, 0);
      const totalMaintCost = vMaintLogs.reduce((s, l) => s + l.cost, 0);

      const fuelEfficiency = totalLiters > 0 ? (v.odometer / totalLiters) : 0;

      const estimatedRevenue = v.odometer * (REVENUE_PER_KM[v.type] || 1);
      const acquisitionCost = SIMULATED_ACQUISITION_COST[v.type] || 10000;

      // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
      const roi = ((estimatedRevenue - (totalMaintCost + totalFuelCost)) / acquisitionCost) * 100;

      return {
        name: v.name.split(" ")[1] || v.name,
        fuelCost: Math.round(totalFuelCost),
        maintCost: Math.round(totalMaintCost),
        efficiency: Math.round(fuelEfficiency * 10) / 10,
        roi: Math.round(roi)
      };
    });

  const fuelByVehicle = vehicleStats.filter(d => d.fuelCost > 0).map(d => ({ name: d.name, fuel: d.fuelCost }));
  const maintByVehicle = vehicleStats.filter(d => d.maintCost > 0).map(d => ({ name: d.name, cost: d.maintCost }));

  // Trip completion
  const tripStats = [
    { name: "Completed", value: trips.filter(t => t.status === "Completed").length },
    { name: "Active", value: trips.filter(t => t.status === "Dispatched").length },
    { name: "Draft", value: trips.filter(t => t.status === "Draft").length },
    { name: "Cancelled", value: trips.filter(t => t.status === "Cancelled").length },
  ];

  const totalFuelCost = fuelLogs.reduce((s, l) => s + l.cost, 0);
  const totalMaintCost = maintenanceLogs.reduce((s, l) => s + l.cost, 0);

  const handleExportCSV = () => {
    const headers = "Vehicle,Fuel Cost,Maintenance Cost,Efficiency (km/L),ROI (%)\n";
    const rows = vehicleStats.map(v => `${v.name},${v.fuelCost},${v.maintCost},${v.efficiency},${v.roi}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fleet_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Operational Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest">Financial performance and fleet efficiency</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 uppercase tracking-wider">
        <div className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-widest">${totalFuelCost.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-widest">${totalMaintCost.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <p className="text-sm text-muted-foreground">Total Operational Cost</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-widest">${(totalFuelCost + totalMaintCost).toFixed(2)}</p>
        </div>
        <div className="rounded-xl border-primary max-w-sm glass-neon p-5 shadow-[0_0_20px_#ccff0033]">
          <p className="text-sm font-medium text-primary mb-2">Fleet ROI Overview</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Avg ROI:</span>
              <span className="font-bold text-white tracking-widest text-glow">
                {vehicleStats.length ? Math.round(vehicleStats.reduce((s, v) => s + v.roi, 0) / vehicleStats.length) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Top Performer:</span>
              <span className="font-bold text-white tracking-widest">
                {vehicleStats.length ? vehicleStats.reduce((prev, current) => (prev.roi > current.roi) ? prev : current).name : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 uppercase tracking-wider">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <h3 className="text-sm font-semibold text-white mb-4">Fleet Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <h3 className="text-sm font-semibold text-white mb-4">Maintenance Cost by Vehicle ($)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={maintByVehicle}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="cost" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <h3 className="text-sm font-semibold text-white mb-4">Fuel Efficiency (km/L)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vehicleStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="efficiency" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <h3 className="text-sm font-semibold text-white mb-4">Vehicle ROI (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vehicleStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="roi" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-white/10 glass p-5 active-reflection-border">
          <h3 className="text-sm font-semibold text-white mb-4">Trip Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tripStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {tripStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
