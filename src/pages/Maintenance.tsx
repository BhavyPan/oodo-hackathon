import { motion } from "framer-motion";
import { useState } from "react";
import { useFleet } from "@/context/FleetContext";
import { useAuth } from "@/context/AuthContext";
import { Wrench, Clock, CheckCircle2, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MaintenanceLog, Driver, VehicleStatus, VehicleType, DriverStatus } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

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
  const {
    maintenanceLogs,
    vehicles,
    drivers,
    addMaintenanceLog,
    completeMaintenanceLog,
    addDriver,
    updateDriver,
    deleteDriver,
    updateVehicleStatus
  } = useFleet();
  const { user } = useAuth();
  const { toast } = useToast();

  // Service Log State
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<Partial<MaintenanceLog>>({
    vehicleId: "", type: "Repair", description: "", cost: 0, date: new Date().toISOString().split("T")[0], status: "In Progress"
  });

  // Driver Management State
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [driverFormData, setDriverFormData] = useState<Partial<Driver>>({
    name: "", phone: "", licenseExpiry: new Date().toISOString().split("T")[0], safetyScore: 100, status: "Off Duty"
  });

  const getVehicleName = (id: string) => vehicles.find(v => v.id === id)?.name || "Unknown";

  const handleCreateService = () => {
    if (!serviceFormData.vehicleId || !serviceFormData.type || !serviceFormData.description) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    addMaintenanceLog({
      id: `m_${Date.now()}`,
      vehicleId: serviceFormData.vehicleId,
      type: serviceFormData.type,
      description: serviceFormData.description,
      cost: serviceFormData.cost || 0,
      date: serviceFormData.date || new Date().toISOString().split("T")[0],
      status: serviceFormData.status as any
    });
    toast({ title: "Service Logged", description: "Vehicle status automatically set to 'In Shop'." });
    setIsServiceDialogOpen(false);
    setServiceFormData({ vehicleId: "", type: "Repair", description: "", cost: 0, date: new Date().toISOString().split("T")[0], status: "In Progress" });
  };

  const handleSaveDriver = () => {
    if (!driverFormData.name || !driverFormData.phone || !driverFormData.licenseExpiry) {
      toast({ title: "Validation Error", description: "Please fill all required driver fields.", variant: "destructive" });
      return;
    }

    if (isEditingDriver && driverFormData.id) {
      updateDriver(driverFormData as Driver);
      toast({ title: "Driver Updated", description: `${driverFormData.name}'s profile has been updated.` });
    } else {
      addDriver({
        ...driverFormData,
        id: `d_${Date.now()}`,
        status: driverFormData.status || "Off Duty",
        tripsCompleted: 0,
        licenseCategories: ["Van", "Truck"], // Default, could be expanded in form
      } as Driver);
      toast({ title: "Driver Hired", description: `${driverFormData.name} has been added to the registry.` });
    }
    setIsDriverDialogOpen(false);
  };

  const openEditDriver = (driver: Driver) => {
    setDriverFormData(driver);
    setIsEditingDriver(true);
    setIsDriverDialogOpen(true);
  };

  const handleFireDriver = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to terminate ${name}? This action cannot be undone.`)) {
      deleteDriver(id);
      toast({ title: "Driver Terminated", description: `${name} has been removed.` });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Maintenance & Administration</h1>
          <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest">Preventative fleet tracking and manager utilities</p>
        </div>
      </motion.div>

      <Tabs defaultValue="service-logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="service-logs">Service Logs</TabsTrigger>
          {user?.role === "Manager" && (
            <TabsTrigger value="fleet-admin">Fleet Administration</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="service-logs" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsServiceDialogOpen(true)} className="gap-2 bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider">
              <Plus className="h-4 w-4" /> Log Service
            </Button>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 glass overflow-hidden active-reflection-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-white uppercase tracking-wider text-xs">
                    <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                    <th className="px-5 py-3.5 text-left font-medium">Service Type</th>
                    <th className="px-5 py-3.5 text-left font-medium">Description</th>
                    <th className="px-5 py-3.5 text-left font-medium">Cost</th>
                    <th className="px-5 py-3.5 text-left font-medium">Date</th>
                    <th className="px-5 py-3.5 text-left font-medium">Status</th>
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-white">{getVehicleName(log.vehicleId)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{log.type}</td>
                      <td className="px-5 py-4 text-muted-foreground max-w-[240px] truncate">{log.description}</td>
                      <td className="px-5 py-4 font-bold text-white tracking-widest text-glow">${log.cost.toLocaleString()}</td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5">
                          {statusIcon[log.status]}
                          <span className={statusColor[log.status]}>{log.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {log.status !== "Completed" && (
                          <Button variant="outline" size="sm" onClick={() => {
                            completeMaintenanceLog(log.id);
                            toast({ title: "Service Completed", description: "Vehicle is now Available." });
                          }}>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-success" /> Complete
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        {user?.role === "Manager" && (
          <TabsContent value="fleet-admin" className="space-y-8 pt-4">
            {/* Driver Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><UsersIcon className="h-5 w-5" /> Driver Roster Management</h3>
                <Button onClick={() => { setIsEditingDriver(false); setDriverFormData({ name: "", phone: "", licenseExpiry: new Date().toISOString().split("T")[0], safetyScore: 100, status: "Off Duty" }); setIsDriverDialogOpen(true); }} size="sm" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Hire Driver
                </Button>
              </div>
              <div className="rounded-xl border border-white/10 glass overflow-hidden active-reflection-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-white uppercase tracking-wider text-xs">
                        <th className="px-5 py-3.5 text-left font-medium">Name</th>
                        <th className="px-5 py-3.5 text-left font-medium">Phone</th>
                        <th className="px-5 py-3.5 text-left font-medium">License Expiry</th>
                        <th className="px-5 py-3.5 text-left font-medium">Status</th>
                        <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map(driver => (
                        <tr key={driver.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                          <td className="px-5 py-4 font-medium text-white">{driver.name}</td>
                          <td className="px-5 py-4 text-primary">{driver.phone}</td>
                          <td className="px-5 py-4 text-muted-foreground">{new Date(driver.licenseExpiry).toLocaleDateString()}</td>
                          <td className="px-5 py-4">{driver.status}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDriver(driver)}>
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleFireDriver(driver.id, driver.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Vehicle Status Override */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><ShieldAlert className="h-5 w-5" /> Vehicle Status Override</h3>
              <div className="rounded-xl border border-white/10 glass overflow-hidden active-reflection-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-white uppercase tracking-wider text-xs">
                        <th className="px-5 py-3.5 text-left font-medium">Vehicle</th>
                        <th className="px-5 py-3.5 text-left font-medium">License Plate</th>
                        <th className="px-5 py-3.5 text-left font-medium">Current Status</th>
                        <th className="px-5 py-3.5 text-left font-medium w-[200px]">Override Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(v => (
                        <tr key={v.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                          <td className="px-5 py-4 font-medium text-white">{v.name}</td>
                          <td className="px-5 py-4 text-primary">{v.licensePlate}</td>
                          <td className="px-5 py-4 text-muted-foreground">{v.status}</td>
                          <td className="px-5 py-4">
                            <Select
                              value={v.status}
                              onValueChange={(status: VehicleStatus) => {
                                updateVehicleStatus(v.id, status);
                                toast({ title: "Status Updated", description: `${v.name} forced to ${status}.` });
                              }}
                            >
                              <SelectTrigger className="w-[160px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="On Trip">On Trip</SelectItem>
                                <SelectItem value="In Shop">In Shop</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Service Log Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Log New Service</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Vehicle</Label>
              <Select value={serviceFormData.vehicleId} onValueChange={(v) => setServiceFormData({ ...serviceFormData, vehicleId: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.filter(v => v.status !== "Retired" && v.status !== "On Trip").map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name} ({v.licensePlate}) - {v.status}</SelectItem>
                  ))}
                  {vehicles.filter(v => v.status !== "Retired" && v.status !== "On Trip").length === 0 && (
                    <SelectItem value="none" disabled>No vehicles available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Input id="type" placeholder="e.g. Oil Change" value={serviceFormData.type} onChange={e => setServiceFormData({ ...serviceFormData, type: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right">Description</Label>
              <Input id="desc" value={serviceFormData.description} onChange={e => setServiceFormData({ ...serviceFormData, description: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost ($)</Label>
              <Input id="cost" type="number" value={serviceFormData.cost} onChange={e => setServiceFormData({ ...serviceFormData, cost: parseInt(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input id="date" type="date" value={serviceFormData.date} onChange={e => setServiceFormData({ ...serviceFormData, date: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter><Button onClick={handleCreateService}>Save Service Log</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Driver Dialog */}
      <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingDriver ? "Edit Driver Profile" : "Hire New Driver"}</DialogTitle>
            <DialogDescription>Manage performance, compliance, and contact details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="d_name" className="text-right">Full Name</Label>
              <Input id="d_name" value={driverFormData.name} onChange={e => setDriverFormData({ ...driverFormData, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="d_phone" className="text-right">Phone</Label>
              <Input id="d_phone" value={driverFormData.phone} onChange={e => setDriverFormData({ ...driverFormData, phone: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="d_expiry" className="text-right">License Expiry</Label>
              <Input id="d_expiry" type="date" value={driverFormData.licenseExpiry} onChange={e => setDriverFormData({ ...driverFormData, licenseExpiry: e.target.value })} className="col-span-3" />
            </div>
            {isEditingDriver && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="d_score" className="text-right">Safety Score</Label>
                  <Input id="d_score" type="number" min={0} max={100} value={driverFormData.safetyScore} onChange={e => setDriverFormData({ ...driverFormData, safetyScore: parseInt(e.target.value) })} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="d_status" className="text-right">Status</Label>
                  <Select value={driverFormData.status} onValueChange={(v) => setDriverFormData({ ...driverFormData, status: v as DriverStatus })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On Duty">On Duty</SelectItem>
                      <SelectItem value="Off Duty">Off Duty</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="On Trip">On Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter><Button onClick={handleSaveDriver}>{isEditingDriver ? "Update Profile" : "Hire Driver"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
