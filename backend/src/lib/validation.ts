import { z } from "zod";

const HoneypotSchema = z.object({
  // Hidden field used to reject basic bot submissions without changing the UX.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export const LoginSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const RegisterAdminSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const CreateRepairSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(5, "Valid phone number is required").max(30),
  device: z.enum(["phone", "computer", "tablet", "coffee_machine", "washing_machine"], {
    errorMap: () => ({ message: "Invalid device type" }),
  }),
  issue: z.string().min(10, "Please describe the issue in at least 10 characters").max(2000),
  serviceType: z.enum(["home", "mail"], {
    errorMap: () => ({ message: "Service type must be 'home' or 'mail'" }),
  }),
  country: z.string().min(2, "Country is required").max(100),
}).merge(HoneypotSchema);

export const UpdateStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "rejected"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});

export const ContactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email address is required"),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
}).merge(HoneypotSchema);

export type CreateRepairInput = z.infer<typeof CreateRepairSchema>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
