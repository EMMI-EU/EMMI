const BASE = "";  // same origin via Vite proxy in dev, Nginx in prod

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",          // sends HttpOnly cookies automatically
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public data: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ success: boolean }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () =>
    request<{ role: string | null }>("/api/auth/me"),
};

// ─── Repairs (public) ─────────────────────────────────────────────────────────
export type TrackResult = {
  status: string;
  device: string;
  serviceType: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRepairInput = {
  name: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  serviceType: "home" | "mail";
  country: string;
  website?: string;
};

export type CreateRepairResult = {
  trackingToken: string;
  message: string;
};

export const repairsApi = {
  track: (token: string) =>
    request<TrackResult>(`/api/repairs/track/${encodeURIComponent(token)}`),

  create: (data: CreateRepairInput) =>
    request<CreateRepairResult>("/api/repairs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Admin repairs ────────────────────────────────────────────────────────────
export type RepairStatus = "pending" | "in_progress" | "completed" | "rejected";

export type AdminRepair = {
  id: number;
  trackingToken: string;
  name: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  serviceType: string;
  country: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
};

export type RepairStats = {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  rejected: number;
  homeService: number;
  mailService: number;
};

export const adminApi = {
  listRepairs: (status?: string) =>
    request<{ data: AdminRepair[]; page: number; limit: number }>(
      `/api/repairs${status && status !== "all" ? `?status=${status}` : ""}`
    ),

  getStats: () => request<RepairStats>("/api/repairs/stats"),

  updateStatus: (id: number, status: RepairStatus) =>
    request<{ id: number; status: string; updatedAt: string }>(
      `/api/repairs/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    ),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export const contactApi = {
  submit: (data: ContactInput) =>
    request<{ success: boolean; message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
