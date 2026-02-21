import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Wrench,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/fleetflow-logo.png";
import { useAuth, Role } from "@/context/AuthContext";

type NavItem = {
  to: string;
  icon: any;
  label: string;
  allowedRoles: Role[];
};

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Command Center", allowedRoles: ["Manager", "Dispatcher", "Safety Officer", "Finance"] },
  { to: "/vehicles", icon: Truck, label: "Vehicle Registry", allowedRoles: ["Manager", "Dispatcher", "Safety Officer"] },
  { to: "/trips", icon: Route, label: "Trip Dispatcher", allowedRoles: ["Manager", "Dispatcher"] },
  { to: "/drivers", icon: Users, label: "Driver Profiles", allowedRoles: ["Manager", "Dispatcher", "Safety Officer"] },
  { to: "/maintenance", icon: Wrench, label: "Maintenance", allowedRoles: ["Manager", "Safety Officer"] },
  { to: "/analytics", icon: BarChart3, label: "Analytics", allowedRoles: ["Manager", "Finance"] },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item =>
    user && item.allowedRoles.includes(user.role)
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex h-screen flex-col bg-black border-r border-white/10 z-20"
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <img src={logo} alt="FleetFlow" className="h-9 w-9 rounded-lg" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold text-sidebar-primary-foreground whitespace-nowrap overflow-hidden"
              style={{ color: "hsl(var(--sidebar-primary))" }}
            >
              FleetFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              data-active={isActive}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium active-reflection-border active-reflection",
                isActive
                  ? "bg-black/40 text-primary shadow-[inset_4px_0_0_0_#ccff00]"
                  : "text-sidebar-foreground hover:bg-black/20 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-white/10 text-sidebar-foreground hover:text-primary transition-colors glass"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
}
