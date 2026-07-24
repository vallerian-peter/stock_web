import { z } from "zod"

import type { HelpCenterCopy } from "./help-center-copy"

export function createSupportRequestSchema(
  validation: HelpCenterCopy["form"]["validation"]
) {
  return z
    .object({
      type: z.enum(["help", "chat", "bug", "feedback"]),
      category: z.string().min(1, validation.category),
      subject: z
        .string()
        .trim()
        .min(5, validation.subject)
        .max(120, validation.subject),
      message: z
        .string()
        .trim()
        .min(20, validation.message)
        .max(2000, validation.message),
      priority: z.enum(["low", "normal", "high", "urgent"]),
      contactPreference: z.enum(["email", "phone"]),
      rating: z.number().int().min(1).max(5).optional(),
    })
    .refine(
      (values) => values.type !== "feedback" || values.rating !== undefined,
      { message: validation.rating, path: ["rating"] }
    )
}
