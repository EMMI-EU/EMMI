import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/App";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, BarChart3, RefreshCw } from "lucide-react";
import { adminApi, type AdminRepair, type RepairStatus } from "@/lib/api";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<RepairStatus, string> = {
  pending:     "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed:   "bg-green-100 text-green-800 border-green-200",
  rejected:    "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<RepairStatus, string> = {
  pending: "Pending", in_progress: "In Progress", completed: "Completed", rejected: "Rejected",
};

export default function Admin() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRepair, setSelectedRepair] = useState<AdminRepair | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
  });

  const { data: repairsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-repairs", statusFilter],
    queryFn: () => adminApi.listRepairs(statusFilter),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RepairStatus }) =>
      adminApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-repairs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setSelectedRepair(null);
      toast({ title: "Status updated", description: "Customer has been notified by email." });
    },
    onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to update status." }),
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <PageHead title="Admin Dashboard" description="EMMI Europe Tech Admin" />

      <div className="bg-secondary/10 min-h-screen pb-16">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-5 flex justify-between items-center shadow">
          <div>
            <h1 className="text-xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/70 text-sm">EMMI Europe Tech</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-none">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total", value: stats.total, color: "border-l-primary" },
                { label: "Pending", value: stats.pending, color: "border-l-yellow-500" },
                { label: "In Progress", value: stats.in_progress, color: "border-l-blue-500" },
                { label: "Completed", value: stats.completed, color: "border-l-green-500" },
              ].map((s) => (
                <div key={s.label} className={`bg-card border border-l-4 ${s.color} p-5 shadow-sm`}>
                  <p className="text-muted-foreground text-sm">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Repair Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-none h-9">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="rounded-none h-9 w-9" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Loading repairs...</div>
            ) : !repairsData?.data.length ? (
              <div className="p-12 text-center text-muted-foreground">No repair requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">#</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repairsData.data.map((repair) => (
                      <TableRow key={repair.id} className="cursor-pointer hover:bg-secondary/20" onClick={() => setSelectedRepair(repair)}>
                        <TableCell className="font-mono text-muted-foreground text-sm">{repair.id}</TableCell>
                        <TableCell>
                          <p className="font-medium">{repair.name}</p>
                          <p className="text-xs text-muted-foreground">{repair.email}</p>
                        </TableCell>
                        <TableCell className="capitalize">{repair.device.replace("_", " ")}</TableCell>
                        <TableCell className="capitalize">{repair.serviceType}</TableCell>
                        <TableCell>{repair.country}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium border rounded-full ${STATUS_COLORS[repair.status]}`}>
                            {STATUS_LABELS[repair.status]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(repair.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedRepair(repair); }}>
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRepair} onOpenChange={(o) => !o && setSelectedRepair(null)}>
        <DialogContent className="max-w-xl rounded-none">
          {selectedRepair && (
            <>
              <DialogHeader>
                <DialogTitle>Repair #{selectedRepair.id} — {selectedRepair.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Email", selectedRepair.email],
                    ["Phone", selectedRepair.phone],
                    ["Device", selectedRepair.device.replace("_", " ")],
                    ["Service", selectedRepair.serviceType],
                    ["Country", selectedRepair.country],
                    ["Submitted", format(new Date(selectedRepair.createdAt), "dd MMM yyyy HH:mm")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
                      <p className="font-medium capitalize mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Issue Description</p>
                  <p className="text-sm bg-muted rounded p-3">{selectedRepair.issue}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Tracking Token</p>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all block">{selectedRepair.trackingToken}</code>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pending", "in_progress", "completed", "rejected"] as RepairStatus[]).map((s) => (
                      <Button
                        key={s}
                        variant={selectedRepair.status === s ? "default" : "outline"}
                        size="sm"
                        className="rounded-none capitalize"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: selectedRepair.id, status: s })}
                      >
                        {STATUS_LABELS[s]}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Changing status will automatically notify the customer by email.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
