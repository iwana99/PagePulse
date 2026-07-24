import { z } from "zod";

const notificationSchema = z.object({
  emailEnabled: z.boolean().default(false),
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase())
    .optional()
    .or(z.literal("")),
});

const baselineSchema = z.object({
  url: z.string().url(),
  publicId: z.string().trim().min(1),
});

export const monitorSchema = z.object({
  title: z.string().trim().min(3).max(120),
  url: z.string().url(),

  notifications: notificationSchema.default({
    emailEnabled: false,
  }),

  baseline: baselineSchema.optional(),
});