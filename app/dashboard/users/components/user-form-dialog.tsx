"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/api/request"
import { formatCompactName } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputField } from "@/components/ui/input-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"

import type { UserDialogCopy } from "./user-dialog-copy"
import {
  createUserSchema,
  getUserFormErrors,
  type UserFormErrors,
  type UserFormMode,
  type UserFormValues,
} from "./user-schema"
import { Spinner } from "@/components/ui/spinner"

type UserFormDialogProps = {
  mode: UserFormMode
  copy: UserDialogCopy
  user?: UserResponseDTO
  onClose: () => void
  onSubmit: (values: UserFormValues) => Promise<void> | void
}

function initialValues(user?: UserResponseDTO): UserFormValues {
  return {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "user",
    status: user?.status ?? "Active",
    password: "",
  }
}

export function UserFormDialog({
  mode,
  copy,
  user,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const [values, setValues] = useState<UserFormValues>(() =>
    initialValues(user)
  )
  const [errors, setErrors] = useState<UserFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Field extends keyof UserFormValues>(
    field: Field,
    value: UserFormValues[Field]
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createUserSchema(mode, copy.validation).safeParse(values)

    if (!result.success) {
      setErrors(getUserFormErrors(result.error))
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(result.data)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditing = mode === "edit"

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? copy.editTitle : copy.addTitle}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? copy.editDescription : copy.addDescription}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              autoFocus
              required
              autoCapitalize="words"
              labelText={copy.firstName}
              placeholder={copy.firstNamePlaceholder}
              value={values.firstName}
              errorText={errors.firstName}
              disabled={isSubmitting}
              onChange={(event) =>
                updateField("firstName", formatCompactName(event.target.value))
              }
            />
            <InputField
              required
              autoCapitalize="words"
              labelText={copy.lastName}
              placeholder={copy.lastNamePlaceholder}
              value={values.lastName}
              errorText={errors.lastName}
              disabled={isSubmitting}
              onChange={(event) =>
                updateField("lastName", formatCompactName(event.target.value))
              }
            />
          </div>

          <InputField
            required
            type="email"
            labelText={copy.email}
            placeholder={copy.emailPlaceholder}
            value={values.email}
            errorText={errors.email}
            disabled={isSubmitting}
            onChange={(event) => updateField("email", event.target.value)}
          />

          <InputField
            required
            type="tel"
            labelText={copy.phone}
            placeholder={copy.phonePlaceholder}
            value={values.phone}
            errorText={errors.phone}
            disabled={isSubmitting}
            onChange={(event) => updateField("phone", event.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.role)}>
              <FieldLabel>{copy.role}</FieldLabel>
              <Select
                value={values.role}
                onValueChange={(value) => {
                  if (value === "admin" || value === "user") {
                    updateField("role", value)
                  }
                }}
              >
                <SelectTrigger
                  className="h-9 w-full"
                  aria-invalid={Boolean(errors.role)}
                  disabled={isSubmitting}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{copy.admin}</SelectItem>
                  <SelectItem value="user">{copy.user}</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: errors.role }]} />
            </Field>

            <Field>
              <FieldLabel>{copy.status}</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(value) => {
                  if (value === "Active" || value === "Inactive") {
                    updateField("status", value)
                  }
                }}
              >
                <SelectTrigger className="h-9 w-full" disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{copy.active}</SelectItem>
                  <SelectItem value="Inactive">{copy.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          { isEditing ? null :
            (<InputField
              hidden={isEditing}
              required={!isEditing}
              type="password"
              autoComplete="new-password"
              labelText={isEditing ? copy.passwordOptional : copy.password}
              helperText={isEditing ? copy.passwordHint : undefined}
              value={values.password}
              placeholder={copy.passwordPlaceholder}
              errorText={errors.password}
              disabled={isSubmitting}
              onChange={(event) => updateField("password", event.target.value)}
            />) 
          }

        
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : (isEditing ? copy.save : copy.create)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
