import { z } from "zod"

import type { SettingsCopy } from "./settings-copy"

export function createProfileSchema(
  copy: SettingsCopy["profile"]["validation"]
) {
  return z.object({
    firstName: z.string().trim().min(2, copy.firstName),
    lastName: z.string().trim().min(2, copy.lastName),
    email: z.string().trim().email(copy.email),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s().-]{6,}$/, copy.phone),
  })
}

export function createPasswordSchema(
  copy: SettingsCopy["profile"]["validation"]
) {
  return z
    .object({
      currentPassword: z.string().min(1, copy.oldPassword),
      password: z
        .string()
        .min(8, copy.newPassword)
        .regex(/[A-Z]/, copy.newPassword)
        .regex(/\d/, copy.newPassword),
      passwordConfirmation: z.string(),
    })
    .refine((values) => values.password !== values.currentPassword, {
      path: ["password"],
      message: copy.samePassword,
    })
    .refine((values) => values.password === values.passwordConfirmation, {
      path: ["passwordConfirmation"],
      message: copy.confirmPassword,
    })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
export type PasswordFormValues = z.infer<
  ReturnType<typeof createPasswordSchema>
>
export type FieldErrors<TFields extends string> = Partial<
  Record<TFields, string>
>

export function getFieldErrors<TFields extends string>(
  error: z.ZodError
): FieldErrors<TFields> {
  const errors: FieldErrors<TFields> = {}

  for (const issue of error.issues) {
    const field = issue.path[0] as TFields | undefined
    if (field && !errors[field]) errors[field] = issue.message
  }

  return errors
}
