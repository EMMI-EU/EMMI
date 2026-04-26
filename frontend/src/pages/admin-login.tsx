import { useState } from "react";
import { useAuth } from "@/App";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHead title="Admin Login" description="EMMI Europe Tech Admin" />
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
        <div className="bg-card border shadow-sm p-10 w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1">EMMI Europe Tech</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none h-12 pl-10"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none h-12 pl-10"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full rounded-none h-12" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              🔒 Secure admin login with encrypted credentials
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
