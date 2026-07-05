import { z } from "zod"

import type { UserDialogCopy } from "./user-dialog-copy"

export type UserFormMode = "add" | "edit"

export function createUserSchema(
  mode: UserFormMode,
  messages: UserDialogCopy["validation"]
) {
  const password = z
    .string()
    .trim()
    .refine((value) => mode === "edit" || value.length > 0, {
      message: messages.passwordRequired,
    })
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: messages.passwordLength,
    })
    .refine((value) => value.length === 0 || /[A-Z]/.test(value), {
      message: messages.passwordUppercase,
    })
    .refine((value) => value.length === 0 || /\d/.test(value), {
      message: messages.passwordNumber,
    })

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, messages.firstNameRequired)
      .min(2, messages.firstNameLength),
    lastName: z
      .string()
      .trim()
      .min(1, messages.lastNameRequired)
      .min(2, messages.lastNameLength),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    phone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .regex(/^[+\d][\d\s().-]{6,}$/, messages.phoneInvalid),
    role: z.enum(["admin", "user"], {
      message: messages.roleRequired,
    }),
    status: z.enum(["Active", "Inactive"]),
    password,
  })
}

export type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

export function getUserFormErrors(
  error: z.ZodError<UserFormValues>
): UserFormErrors {
  const errors: UserFormErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof UserFormValues | undefined
    if (field && !errors[field]) errors[field] = issue.message
  }

  return errors
}
