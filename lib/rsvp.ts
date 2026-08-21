import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
  guestCount: z.number().int().min(1).max(10),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpRecord = RsvpInput & {
  id: string;
  createdAt: string;
};
