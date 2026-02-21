import { motion } from "framer-motion";
import { useState } from "react";
import { useFleet } from "@/context/FleetContext";
import { TripStatusBadge } from "@/components/StatusBadge";
import { Plus, Play, CheckCircle, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Trip, TripStatus, FuelLog } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

export default function Trips() {
  const { trips, vehicles, drivers, createTrip, startTrip, completeTrip, addFuelLog } = useFleet();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<TripStatus | "All">("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isFuelDialogOpen, setIsFuelDialogOpen] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [finalOdometer, setFinalOdometer] = useState<number>(0);

  const [fuelData, setFuelData] = useState<Partial<FuelLog>>({
    liters: 0,
    cost: 0,
    date: new Date().toISOString().split("T")[0]
  });

  const [formData, setFormData] = useState<Partial<Trip>>({
    origin: "",
    destination: "",
    cargoWeight: 0,
    vehicleId: "",
    driverId: "",
  });

  const getVehicleName = (id: string) => vehicles.find(v => v.id === id)?.name || "Unknown";
  const getDriverName = (id: string) => drivers.find(d => d.id === id)?.name || "Unknown";

  const availableVehicles = vehicles.filter(v => v.status === "Available");
  const availableDrivers = drivers.filter(d =>
    (d.status === "On Duty" || d.status === "Off Duty") &&
    new Date(d.licenseExpiry) > new Date()
  );

  const filtered = statusFilter === "All" ? trips : trips.filter(t => t.status === statusFilter);

  const handleCreate = () => {
    if (!formData.vehicleId || !formData.driverId || !formData.origin || !formData.destination) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (selectedVehicle && (formData.cargoWeight || 0) > selectedVehicle.maxCapacity) {
      toast({
        title: "Overweight Cargo",
        description: `Cargo weight ${formData.cargoWeight}kg exceeds ${selectedVehicle.name}'s max capacity of ${selectedVehicle.maxCapacity}kg.`,
        variant: "destructive"
      });
      return;
    }

    createTrip({
      id: `t_${Date.now()}`,
      origin: formData.origin!,
      destination: formData.destination!,
      cargoWeight: formData.cargoWeight || 0,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      status: "Draft",
      createdAt: new Date().toISOString()
    });

    toast({ title: "Trip Created", description: "Trip has been created as Draft." });
    setIsDialogOpen(false);
    setFormData({ origin: "", destination: "", cargoWeight: 0, vehicleId: "", driverId: "" });
  };

  const handleDispatch = (id: string) => {
    const tripToDispatch = trips.find(t => t.id === id);
    if (!tripToDispatch) return;

    const vehicle = vehicles.find(v => v.id === tripToDispatch.vehicleId);
    if (vehicle && vehicle.status !== "Available") {
      toast({ title: "Dispatch Failed", description: `Vehicle ${vehicle.name} is currently ${vehicle.status}.`, variant: "destructive" });
      return;
    }

    const driver = drivers.find(d => d.id === tripToDispatch.driverId);
    if (driver && driver.status !== "On Duty" && driver.status !== "Off Duty") {
      toast({ title: "Dispatch Failed", description: `Driver ${driver.name} is currently ${driver.status}.`, variant: "destructive" });
      return;
    }

    startTrip(id);
    toast({ title: "Trip Dispatched", description: "Vehicle and Driver statuses updated." });
  };

  const openCompleteDialog = (trip: Trip) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    setFinalOdometer(vehicle?.odometer || 0);
    setSelectedTrip(trip);
    setIsCompleteDialogOpen(true);
  };

  const handleComplete = () => {
    if (selectedTrip) {
      completeTrip(selectedTrip.id, finalOdometer);
      toast({ title: "Trip Completed", description: "Vehicle is now Available." });
      setIsCompleteDialogOpen(false);
    }
  };

  const openFuelDialog = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsFuelDialogOpen(true);
    setFuelData({
      liters: 0,
      cost: 0,
      date: new Date().toISOString().split("T")[0]
    });
  };

  const handleAddFuel = () => {
    const vehicle = vehicles.find(v => v.id === selectedTrip?.vehicleId);
    if (selectedTrip && vehicle) {
      addFuelLog({
        id: `f_${Date.now()}`,
        vehicleId: selectedTrip.vehicleId,
        liters: fuelData.liters || 0,
        cost: fuelData.cost || 0,
        date: fuelData.date || new Date().toISOString().split("T")[0],
        odometer: vehicle.odometer
      });
      toast({ title: "Fuel Logged", description: "Fuel and expense logged successfully." });
      setIsFuelDialogOpen(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Trip Dispatcher</h1>
          <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest">Manage shipments and dispatch operations</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-primary text-black hover:bg-primary/90 transition-opacity font-bold uppercase tracking-wider">
          <Plus className="h-4 w-4" /> New Trip
        </Button>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {(["All", "Draft", "Dispatched", "Completed", "Cancelled"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors uppercase tracking-wider ${statusFilter === s ? "bg-primary text-black font-bold shadow-[0_0_10px_#ccff0080]" : "bg-white/5 text-muted-foreground hover:text-white"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 glass overflow-hidden active-reflection-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white uppercase tracking-wider text-xs">
                <th className="px-5 py-3.5 text-left font-medium">Route</th>
                <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                <th className="px-5 py-3.5 text-left font-medium">Driver</th>
                <th className="px-5 py-3.5 text-left font-medium">Cargo (kg)</th>
                <th className="px-5 py-3.5 text-left font-medium">Created</th>
                <th className="px-5 py-3.5 text-left font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-white">{t.origin}</span>
                    <span className="text-primary mx-1.5 font-bold">→</span>
                    <span className="text-muted-foreground">{t.destination}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{getVehicleName(t.vehicleId)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{getDriverName(t.driverId)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{t.cargoWeight.toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4"><TripStatusBadge status={t.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {t.status === "Draft" && (
                        <Button variant="outline" size="sm" onClick={() => handleDispatch(t.id)}>
                          <Play className="h-4 w-4 mr-1 text-blue-500" /> Dispatch
                        </Button>
                      )}
                      {t.status === "Dispatched" && (
                        <Button variant="outline" size="sm" onClick={() => openCompleteDialog(t)}>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Complete
                        </Button>
                      )}
                      {t.status === "Completed" && (
                        <Button variant="outline" size="sm" onClick={() => openFuelDialog(t)}>
                          <Fuel className="h-4 w-4 mr-1 text-orange-500" /> Log Fuel
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No trips found.</div>
        )}
      </motion.div>

      {/* Create Trip Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origin" className="text-right">Origin</Label>
              <Input id="origin" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dest" className="text-right">Destination</Label>
              <Input id="dest" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">Cargo (kg)</Label>
              <Input id="weight" type="number" value={formData.cargoWeight} onChange={e => setFormData({ ...formData, cargoWeight: parseInt(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Vehicle</Label>
              <Select value={formData.vehicleId} onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Available Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name} ({v.maxCapacity}kg max)</SelectItem>
                  ))}
                  {availableVehicles.length === 0 && <SelectItem value="none" disabled>No vehicles available</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Driver</Label>
              <Select value={formData.driverId} onValueChange={(v) => setFormData({ ...formData, driverId: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Available Driver" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                  {availableDrivers.length === 0 && <SelectItem value="none" disabled>No valid drivers available</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Trip Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">Please confirm the final odometer reading for the vehicle.</p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="odo" className="text-right">Odometer</Label>
              <Input id="odo" type="number" value={finalOdometer} onChange={e => setFinalOdometer(parseInt(e.target.value))} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleComplete}>Mark Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fuel Log Dialog */}
      <Dialog open={isFuelDialogOpen} onOpenChange={setIsFuelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Fuel Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="liters" className="text-right">Liters</Label>
              <Input id="liters" type="number" value={fuelData.liters} onChange={e => setFuelData({ ...fuelData, liters: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Total Cost</Label>
              <Input id="cost" type="number" value={fuelData.cost} onChange={e => setFuelData({ ...fuelData, cost: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddFuel}>Save Fuel Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
