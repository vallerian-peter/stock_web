"use client"

import * as React from "react"
import { toast } from "sonner"

import { updateOwnProfile } from "@/api/account_api"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/api/request"
import { updateAuthSessionUser } from "@/lib/auth/auth-session"
import type { AccountResponseDTO } from "@/lib/dtos/account_dtos"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"

import type { SettingsCopy } from "./settings-copy"
import { SettingsFormField, SettingsSectionHeading } from "./settings-controls"
import {
  createProfileSchema,
  type FieldErrors,
  getFieldErrors,
  type ProfileFormValues,
} from "./settings-schemas"

export function ProfileDetailsForm({
  user,
  copy,
  onUpdated,
}: {
  user: UserResponseDTO
  copy: SettingsCopy["profile"]
  onUpdated: (account: AccountResponseDTO) => void
}) {
  const [values, setValues] = React.useState<ProfileFormValues>(() => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  }))
  const [errors, setErrors] = React.useState<
    FieldErrors<keyof ProfileFormValues>
  >({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function updateField<Field extends keyof ProfileFormValues>(
    field: Field,
    value: ProfileFormValues[Field]
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = createProfileSchema(copy.validation).safeParse(values)

    if (!result.success) {
      setErrors(getFieldErrors<keyof ProfileFormValues>(result.error))
      return
    }

    try {
      setIsSubmitting(true)
      const response = await updateOwnProfile(result.data)
      const updatedUser = response.data.user

      setValues({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      })
      updateAuthSessionUser(updatedUser)
      onUpdated(response.data)
      toast.success(response.message ?? copy.saved)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pb-7">
      <SettingsSectionHeading
        title={copy.detailsTitle}
        description={copy.detailsDescription}
      />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsFormField
            required
            autoComplete="given-name"
            label={copy.firstName}
            value={values.firstName}
            error={errors.firstName}
            disabled={isSubmitting}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          <SettingsFormField
            required
            autoComplete="family-name"
            label={copy.lastName}
            value={values.lastName}
            error={errors.lastName}
            disabled={isSubmitting}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
          <SettingsFormField
            required
            type="email"
            autoComplete="email"
            label={copy.email}
            value={values.email}
            error={errors.email}
            disabled={isSubmitting}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <SettingsFormField
            required
            type="tel"
            autoComplete="tel"
            label={copy.phone}
            value={values.phone}
            error={errors.phone}
            disabled={isSubmitting}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {copy.save}
          </Button>
        </div>
      </form>
    </section>
  )
}
