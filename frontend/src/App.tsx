import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authApi } from "@/lib/api";
import { I18nProvider } from "@/lib/i18n";

import Layout from "@/components/layout";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Booking from "@/pages/booking";
import Track from "@/pages/track";
import Receipt from "@/pages/receipt";
import Payment from "@/pages/payment";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session on mount via cookie (no localStorage)
  useEffect(() => {
    authApi
      .me()
      .then((data) => setIsAdmin(data.role === "admin"))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Protected Admin Route ────────────────────────────────────────────────────
function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return isAdmin ? <Admin /> : <AdminLogin />;
}

// ─── Query Client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/services" component={Services} />
              <Route path="/about" component={About} />
              <Route path="/faq" component={FAQ} />
              <Route path="/contact" component={Contact} />
              <Route path="/booking" component={Booking} />
              <Route path="/track" component={Track} />
              <Route path="/receipt" component={Receipt} />
              <Route path="/payment" component={Payment} />
              <Route path="/admin" component={AdminRoute} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
