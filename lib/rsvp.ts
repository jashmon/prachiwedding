import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]+$/, "Enter a valid WhatsApp number.")
    .refine((value) => [10, 12].includes(value.replace(/\D/g, "").length), "Enter a 10- or 12-digit WhatsApp number.")
    .max(25),
  guestCount: z.number().int().min(1).max(10),
  ticketPath: z.string().max(500).optional(),
  ticketOcrText: z.string().max(12_000).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpRecord = RsvpInput & {
  id: string;
  createdAt: string;
};
