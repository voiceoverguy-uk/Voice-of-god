import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

export interface ContactSubmission extends ContactForm {
  id: string;
  submittedAt: string;
}