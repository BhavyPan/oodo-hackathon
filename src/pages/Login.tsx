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
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] height-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-sm glass active-reflection-border border border-white/10 relative z-10">
                <CardHeader>
                    <CardTitle className="text-2xl text-white uppercase tracking-wider">{isLogin ? "Login to FleetFlow" : "Create an Account"}</CardTitle>
                    <CardDescription className="text-muted-foreground uppercase tracking-widest text-xs mt-1">
                        {isLogin ? "Enter your credentials to access your dashboard." : "Sign up for a new FleetFlow account."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                                            <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 mt-6 shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                            {isLogin ? "Login" : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-white" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
