import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

// Global Custom Cursor
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('input')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.4 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{ boxShadow: "0 0 20px rgba(204,255,0,0.8)" }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-white pointer-events-none z-[100]"
        animate={{ x: mousePosition.x - 2, y: mousePosition.y - 2 }}
        transition={{ type: "spring", stiffness: 2000, damping: 40, mass: 0.1 }}
      />
    </>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-[100dvh] w-full bg-black relative selection:bg-primary/20 text-foreground overflow-x-hidden cursor-none">
        <CustomCursor />

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
                <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="text-white hover:text-destructive hover:bg-destructive/10 transition-colors cursor-none">
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
