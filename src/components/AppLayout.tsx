import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { LogOut } from "lucide-react";
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
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-[100dvh] w-full bg-black relative selection:bg-primary/20 text-foreground overflow-x-hidden">

        {/* Dynamic Background Layer */}
        <div className="fixed inset-0 z-0 bg-kinetic pointer-events-none" />
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

        {/* Noise Overlay */}
        <div
          className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        {/* 
          NEW PAGE LAYOUT STRUCTURE
          Removed the rigid side-by-side flex layout for a fully vertically stacked layout. 
        */}
        <div className="relative z-10 flex flex-col min-h-screen">

          {/* Temporary place for the Nav until we build the TopNav */}
          <header className="w-full glass border-b border-white/10 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50" style={{ boxShadow: "0 0 15px rgba(204,255,0,0.5)" }}>
                <div className="h-3 w-3 rounded-full bg-primary" style={{ boxShadow: "0 0 10px rgba(204,255,0,0.8)" }} />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-glow transition-all duration-300">FleetFlow</h2>
            </div>

            <div className="flex items-center gap-6">
              <TopNav />

              <div className="h-8 w-px bg-white/10 hidden md:block"></div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{user?.name}</p>
                  <p className="text-xs text-primary tracking-widest uppercase">{user?.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="text-white hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full relative z-10">
            {/* The Outlet now takes up the entire width of the screen */}
            <div className="h-full w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
