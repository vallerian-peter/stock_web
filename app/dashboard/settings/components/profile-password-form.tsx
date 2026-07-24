"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { changeOwnPassword } from "@/api/account_api"
import { useConfirmAlertDialog } from "@/components/confirm-alert-dialog-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { clearAccessToken } from "@/lib/api/axios"
import { getApiErrorMessage } from "@/lib/api/request"
import { clearAuthSession } from "@/lib/auth/auth-session"

import type { SettingsCopy } from "./settings-copy"
import { SettingsFormField, SettingsSectionHeading } from "./settings-controls"
import {
  createPasswordSchema,
  type FieldErrors,
  getFieldErrors,
  type PasswordFormValues,
} from "./settings-schemas"

const emptyPasswordValues: PasswordFormValues = {
  currentPassword: "",
  password: "",
  passwordConfirmation: "",
}

export function ProfilePasswordForm({
  copy,
}: {
  copy: SettingsCopy["profile"]
}) {
  const router = useRouter()
  const confirm = useConfirmAlertDialog()
  const [values, setValues] = useState<PasswordFormValues>(emptyPasswordValues)
  const [errors, setErrors] = useState<FieldErrors<keyof PasswordFormValues>>(
    {}
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Field extends keyof PasswordFormValues>(
    field: Field,
    value: PasswordFormValues[Field]
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = createPasswordSchema(copy.validation).safeParse(values)

    if (!result.success) {
      setErrors(getFieldErrors<keyof PasswordFormValues>(result.error))
      return
    }

    const confirmed = await confirm({
      title: copy.passwordConfirmTitle,
      description: copy.passwordConfirmDescription,
      confirmLabel: copy.confirmChangePassword,
      cancelLabel: copy.cancel,
    })

    if (!confirmed) return

    try {
      setIsSubmitting(true)
      const response = await changeOwnPassword({
        currentPassword: result.data.currentPassword,
        password: result.data.password,
        password_confirmation: result.data.passwordConfirmation,
      })

      toast.success(response.message ?? copy.passwordChanged)
      clearAccessToken()
      clearAuthSession()
      router.replace("/auth/login")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-7">
      <SettingsSectionHeading
        title={copy.passwordTitle}
        description={copy.passwordDescription}
      />

      <form className="max-w-full space-y-4" onSubmit={handleSubmit} noValidate>
        <SettingsFormField
          required
          type="password"
          autoComplete="current-password"
          label={copy.oldPassword}
          value={values.currentPassword}
          error={errors.currentPassword}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField("currentPassword", event.target.value)
          }
        />
        <SettingsFormField
          required
          type="password"
          autoComplete="new-password"
          label={copy.newPassword}
          value={values.password}
          error={errors.password}
          disabled={isSubmitting}
          onChange={(event) => updateField("password", event.target.value)}
        />
        <SettingsFormField
          required
          type="password"
          autoComplete="new-password"
          label={copy.confirmPassword}
          value={values.passwordConfirmation}
          error={errors.passwordConfirmation}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField("passwordConfirmation", event.target.value)
          }
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : null}
            {copy.changePassword}
          </Button>
        </div>
      </form>
    </section>
  )
}
