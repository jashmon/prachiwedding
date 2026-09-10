import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
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
