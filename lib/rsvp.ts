import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{7,20}$/, "Enter a valid WhatsApp number, including the country code if needed.")
    .max(20),
  guestCount: z.number().int().min(1).max(10),
  arrivalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose your arrival date."),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose your arrival time."),
  ticketPath: z.string().max(500).optional(),
  ticketOcrText: z.string().max(12_000).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpRecord = RsvpInput & {
  id: string;
  createdAt: string;
};
