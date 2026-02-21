import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: Role[] }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to home if they don't have access
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative selection:bg-primary/20">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-white/10 glass flex items-center px-4 lg:px-8 shrink-0 flex-none sticky top-0 z-10 justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-4"
                data-sidebar-trigger="true"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <div className="h-4 w-4 rounded-full bg-primary animate-pulse-glow shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-card-foreground">FleetFlow Enterprise</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/10 relative">
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
