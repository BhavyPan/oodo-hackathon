import { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<Role>("Manager");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || (!isLogin && !name)) {
            toast({ title: "Validation Error", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        if (isLogin) {
            const result = login(email, password);
            if (result.success) {
                toast({ title: "Login Successful", description: "Welcome back to FleetFlow.", variant: "default" });
                navigate("/");
            } else {
                toast({ title: "Login Failed", description: result.error, variant: "destructive" });
            }
        } else {
            const result = signup(email, password, name, role);
            if (result.success) {
                toast({ title: "Account Created", description: "Your account has been created successfully.", variant: "default" });
                navigate("/");
            } else {
                toast({ title: "Signup Failed", description: result.error, variant: "destructive" });
            }
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-black p-4 relative overflow-hidden selection:bg-primary/20 cursor-none w-full">
            {/* Dynamic Background Layer */}
            <div className="absolute inset-0 z-0 bg-kinetic pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

            {/* Noise Overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
            />

            {/* Core Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0" />

            {/* Massive Background Text */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] uppercase tracking-tighter whitespace-nowrap pointer-events-none z-0 user-select-none">
                RESTRICTED
            </h1>

            <Card className="w-full max-w-md glass-neon active-reflection-border relative z-10 p-2 sm:p-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border-primary/20 cursor-none">
                <CardHeader className="pb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20" style={{ boxShadow: "0 0 15px rgba(204,255,0,0.5)" }}>
                            <div className="h-3 w-3 rounded-full bg-primary" style={{ boxShadow: "0 0 10px rgba(204,255,0,0.8)" }} />
                        </div>
                        <h2 className="text-xl font-black tracking-tighter text-white uppercase text-glow">FleetFlow</h2>
                    </div>

                    <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter text-center">
                        {isLogin ? "System Access" : "Initialize Account"}
                    </CardTitle>
                    <CardDescription className="text-primary uppercase tracking-[0.2em] font-bold text-[10px] sm:text-xs mt-2 text-center text-glow">
                        {isLogin ? "Enter credentials to access command center" : "Register identity for FleetFlow clearance"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white/60 uppercase tracking-widest text-[10px] font-bold">Full Name</Label>
                                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="bg-black/50 border-white/10 text-white focus-visible:ring-primary focus-visible:border-primary transition-all cursor-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-white/60 uppercase tracking-widest text-[10px] font-bold">Role Designation</Label>
                                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                                        <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-primary focus:border-primary cursor-none">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl cursor-none">
                                            <SelectItem value="Manager" className="cursor-none hover:bg-primary hover:text-black">Manager</SelectItem>
                                            <SelectItem value="Dispatcher" className="cursor-none hover:bg-primary hover:text-black">Dispatcher</SelectItem>
                                            <SelectItem value="Safety Officer" className="cursor-none hover:bg-primary hover:text-black">Safety Officer</SelectItem>
                                            <SelectItem value="Finance" className="cursor-none hover:bg-primary hover:text-black">Finance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/60 uppercase tracking-widest text-[10px] font-bold">Identity (Email)</Label>
                            <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/50 border-white/10 text-white focus-visible:ring-primary focus-visible:border-primary transition-all cursor-none" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/60 uppercase tracking-widest text-[10px] font-bold">Passcode</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/50 border-white/10 text-white focus-visible:ring-primary focus-visible:border-primary transition-all cursor-none" />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-black font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all h-12 mt-8 cursor-none" style={{ boxShadow: "0 0 20px rgba(204,255,0,0.3)" }}>
                            {isLogin ? "Acknowledge" : "Register Identity"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pt-6 border-t border-white/5 mt-4">
                    <Button variant="link" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors cursor-none" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "No clearance? Request access" : "Already registered? Authenticate here"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
