import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  uuid,
  index,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

export const serviceTypeEnum = pgEnum("service_type", ["home", "mail"]);
export const repairStatusEnum = pgEnum("repair_status", [
  "pending",
  "in_progress",
  "completed",
  "rejected",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "stripe",
  "paypal",
  "bank_transfer",
]);

export const repairsTable = pgTable(
  "repairs",
  {
    id: serial("id").primaryKey(),
    trackingToken: uuid("tracking_token").notNull().unique().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    device: text("device").notNull(),
    issue: text("issue").notNull(),
    serviceType: serviceTypeEnum("service_type").notNull(),
    country: text("country").notNull(),
    status: repairStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    trackingTokenIdx: index("tracking_token_idx").on(table.trackingToken),
  })
);

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentsTable = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    repairId: integer("repair_id").notNull(),
    trackingToken: uuid("tracking_token").notNull(),
    method: paymentMethodEnum("method").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    transactionId: text("transaction_id").notNull().unique(),
    metadata: text("metadata"), // JSON as text
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    repairIdIdx: index("payment_repair_id_idx").on(table.repairId),
    trackingTokenIdx: index("payment_tracking_token_idx").on(
      table.trackingToken
    ),
    statusIdx: index("payment_status_idx").on(table.status),
  })
);

export const adminsTable = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    isActive: text("is_active").notNull().default("true"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export const auditLogsTable = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    adminId: serial("admin_id"),
    action: text("action").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    details: text("details"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    adminIdIdx: index("admin_id_idx").on(table.adminId),
    createdAtIdx: index("audit_created_at_idx").on(table.createdAt),
  })
);

export type Repair = typeof repairsTable.$inferSelect;
export type InsertRepair = typeof repairsTable.$inferInsert;
export type Contact = typeof contactsTable.$inferSelect;
export type InsertContact = typeof contactsTable.$inferInsert;
export type Payment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;
export type Admin = typeof adminsTable.$inferSelect;
export type InsertAdmin = typeof adminsTable.$inferInsert;
export type AuditLog = typeof auditLogsTable.$inferSelect;
export type InsertAuditLog = typeof auditLogsTable.$inferInsert;
export type RepairStatus = "pending" | "in_progress" | "completed" | "rejected";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";
