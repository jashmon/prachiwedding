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
  arrivalDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose your arrival date."), z.literal("")]),
  arrivalTime: z.union([z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose your arrival time."), z.literal("")]),
  ticketPath: z.string().max(500).optional(),
  ticketOcrText: z.string().max(12_000).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpRecord = RsvpInput & {
  id: string;
  createdAt: string;
};
