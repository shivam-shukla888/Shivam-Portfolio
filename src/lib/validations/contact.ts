import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .max(255, "Email cannot exceed 255 characters."),
  brief: z
    .string()
    .trim()
    .min(10, "Inquiry brief must be at least 10 characters.")
    .max(3000, "Inquiry brief cannot exceed 3000 characters."),
  hp_website: z.string().nullable().optional(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

export type ContactActionStatus =
  | "idle"
  | "submitting"
  | "success"
  | "validation_error"
  | "rate_limited"
  | "server_error"
  | "verification_error";

export interface ContactActionState {
  status: ContactActionStatus;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    brief?: string[];
    turnstile?: string[];
  };
}

export const initialContactState: ContactActionState = {
  status: "idle",
};
