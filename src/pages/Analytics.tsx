import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { vehicles, fuelLogs, maintenanceLogs, trips } from "@/data/mockData";

const COLORS = ["hsl(152, 60%, 42%)", "hsl(210, 80%, 55%)", "hsl(38, 92%, 50%)", "hsl(220, 10%, 60%)"];

export default function Analytics() {
  // Vehicle status distribution
  const statusCounts = vehicles.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Fuel cost by vehicle
  const fuelByVehicle = vehicles
    .filter(v => v.status !== "Retired")
    .map(v => {
      const logs = fuelLogs.filter(f => f.vehicleId === v.id);
      const totalFuel = logs.reduce((s, l) => s + l.cost, 0);
      return { name: v.name.split(" ")[1] || v.name, fuel: Math.round(totalFuel) };
    })
    .filter(d => d.fuel > 0);

  // Maintenance cost by vehicle
  const maintByVehicle = vehicles.map(v => {
    const logs = maintenanceLogs.filter(m => m.vehicleId === v.id);
    const total = logs.reduce((s, l) => s + l.cost, 0);
    return { name: v.name.split(" ")[1] || v.name, cost: total };
  }).filter(d => d.cost > 0);

  // Trip completion
  const tripStats = [
    { name: "Completed", value: trips.filter(t => t.status === "Completed").length },
    { name: "Active", value: trips.filter(t => t.status === "Dispatched").length },
    { name: "Draft", value: trips.filter(t => t.status === "Draft").length },
    { name: "Cancelled", value: trips.filter(t => t.status === "Cancelled").length },
  ];

  const totalFuelCost = fuelLogs.reduce((s, l) => s + l.cost, 0);
  const totalMaintCost = maintenanceLogs.reduce((s, l) => s + l.cost, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Operational Analytics</h1>
        <p className="text-muted-foreground mt-1">Financial performance and fleet efficiency</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">${totalFuelCost.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">${totalMaintCost.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Operational Cost</p>
          <p className="text-2xl font-bold text-accent mt-1">${(totalFuelCost + totalMaintCost).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Fleet Status Distribution</h3>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Fuel Cost by Vehicle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fuelByVehicle}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="fuel" fill="hsl(32, 95%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Maintenance Cost by Vehicle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={maintByVehicle}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 30%, 12%)", border: "none", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="cost" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Trip Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tripStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
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
