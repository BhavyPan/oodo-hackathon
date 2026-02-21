import { motion } from "framer-motion";
import { useState } from "react";
import { useFleet } from "@/context/FleetContext";
import { VehicleStatusBadge } from "@/components/StatusBadge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
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
import type { Vehicle, VehicleType, VehicleStatus } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useFleet();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "All">("All");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: "",
    type: "Van",
    licensePlate: "",
    maxCapacity: 1000,
    odometer: 0,
    status: "Available",
    region: "Central",
    lastService: new Date().toISOString().split("T")[0]
  });

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.licensePlate.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        name: "",
        type: "Van",
        licensePlate: "",
        maxCapacity: 1000,
        odometer: 0,
        status: "Available",
        region: "Central",
        lastService: new Date().toISOString().split("T")[0]
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.licensePlate) {
      toast({ title: "Validation Error", description: "Name and License Plate are required.", variant: "destructive" });
      return;
    }

    if (editingVehicle) {
      updateVehicle(formData as Vehicle);
      toast({ title: "Vehicle Updated", description: `${formData.name} updated successfully.` });
    } else {
      addVehicle({
        ...(formData as Vehicle),
        id: `v_${Date.now()}`
      });
      toast({ title: "Vehicle Added", description: `${formData.name} added to registry.` });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteVehicle(id);
      toast({ title: "Vehicle Deleted", description: `${name} has been removed.` });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Vehicle Registry</h1>
          <p className="text-muted-foreground mt-1 uppercase tracking-widest text-sm">Manage fleet assets and availability</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Vehicle
        </Button>
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
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as VehicleType | "All")}>
          <SelectTrigger className="w-[150px] bg-card">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as VehicleStatus | "All")}>
          <SelectTrigger className="w-[150px] bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="On Trip">On Trip</SelectItem>
            <SelectItem value="In Shop">In Shop</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 glass overflow-hidden active-reflection-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white uppercase tracking-wider text-xs">
                <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                <th className="px-5 py-3.5 text-left font-medium">License Plate</th>
                <th className="px-5 py-3.5 text-left font-medium">Type</th>
                <th className="px-5 py-3.5 text-left font-medium">Max Capacity</th>
                <th className="px-5 py-3.5 text-left font-medium">Odometer</th>
                <th className="px-5 py-3.5 text-left font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-white">{v.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{v.licensePlate}</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.maxCapacity.toLocaleString()} kg</td>
                  <td className="px-5 py-4 text-muted-foreground">{v.odometer.toLocaleString()} km</td>
                  <td className="px-5 py-4"><VehicleStatusBadge status={v.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(v)}>
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id, v.name)}>
                        <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No vehicles match your filters.</div>
        )}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plate" className="text-right">Plate</Label>
              <Input id="plate" value={formData.licensePlate} onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as VehicleType })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity (kg)</Label>
              <Input id="capacity" type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as VehicleStatus })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
