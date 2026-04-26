import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Wrench, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { repairsApi, type TrackResult } from "@/lib/api";

type Status = "pending" | "in_progress" | "completed" | "rejected";

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: "Pending Review",    color: "text-yellow-600 bg-yellow-50 border-yellow-200",  icon: <Clock className="w-5 h-5" /> },
  in_progress: { label: "In Repair",         color: "text-blue-600 bg-blue-50 border-blue-200",        icon: <Wrench className="w-5 h-5" /> },
  completed:   { label: "Repair Completed",  color: "text-green-600 bg-green-50 border-green-200",     icon: <CheckCircle2 className="w-5 h-5" /> },
  rejected:    { label: "Unable to Repair",  color: "text-red-600 bg-red-50 border-red-200",           icon: <XCircle className="w-5 h-5" /> },
};

const TIMELINE_STEPS = ["pending", "in_progress", "completed"] as const;

function Timeline({ status }: { status: Status }) {
  const currentIdx = TIMELINE_STEPS.indexOf(status as (typeof TIMELINE_STEPS)[number]);
  const isRejected = status === "rejected";

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 my-6">
        <XCircle className="w-6 h-6 text-red-600 shrink-0" />
        <p className="text-red-700 text-sm">This repair could not be completed. Our team will contact you to discuss alternatives.</p>
      </div>
    );
  }

  return (
    <div className="relative my-8">
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-border" />
      <div
        className="absolute top-6 left-6 h-0.5 bg-primary transition-all duration-700"
        style={{ width: currentIdx >= 0 ? `${(currentIdx / (TIMELINE_STEPS.length - 1)) * (100 - 8)}%` : "0%" }}
      />
      <div className="relative flex justify-between">
        {TIMELINE_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const cfg = STATUS_CONFIG[step];
          return (
            <div key={step} className="flex flex-col items-center w-24">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors duration-300 ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {cfg.icon}
              </div>
              <p className={`mt-2 text-xs font-medium text-center ${idx === currentIdx ? "text-primary" : "text-muted-foreground"}`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Track() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialToken = searchParams.get("token") ?? "";

  const [token, setToken] = useState(initialToken);
  const [activeToken, setActiveToken] = useState(initialToken);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(!!initialToken);
  const [error, setError] = useState<string | null>(null);

  // Auto-search if token in URL
  useEffect(() => {
    if (initialToken) void doSearch(initialToken);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(t: string) {
    if (!t.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveToken(t.trim());
    try {
      const data = await repairsApi.track(t.trim());
      setResult(data);
    } catch {
      setError("No repair found for this tracking token. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void doSearch(token);
  };

  const statusCfg = result ? STATUS_CONFIG[result.status as Status] ?? STATUS_CONFIG.pending : null;

  return (
    <>
      <PageHead title="Track Repair" description="Track the status of your device repair." canonical="/track" />

      <div className="bg-secondary/30 pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Track Your Repair</h1>
          <p className="text-muted-foreground">Enter your tracking token to see the current repair status.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your tracking token here..."
            className="rounded-none h-14 text-base font-mono"
          />
          <Button type="submit" className="rounded-none h-14 px-6 bg-primary shrink-0" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </form>

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-card border p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-16 bg-muted rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded" />
              <div className="h-16 bg-muted rounded" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 text-center flex flex-col items-center rounded-lg">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Not Found</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && statusCfg && (
          <div className="bg-card border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-primary/5 px-6 py-5 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Repair Status
                </h2>
                <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Submitted {new Date(result.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${statusCfg.color}`}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <Timeline status={result.status as Status} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Device</p>
                    <p className="font-medium capitalize">{result.device.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Service Type</p>
                    <p className="font-medium capitalize">{result.serviceType === "home" ? "On-site Home Repair" : "Mail-in Service"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="font-medium">{new Date(result.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tracking Token</p>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">{activeToken}</code>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Questions about your repair?{" "}
                  <a href="https://wa.me/393792730062" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                    Chat on WhatsApp
                  </a>{" "}
                  or{" "}
                  <a href="/contact" className="text-primary underline underline-offset-4">send us a message</a>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
