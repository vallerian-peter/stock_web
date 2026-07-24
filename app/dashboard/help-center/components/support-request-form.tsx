"use client"

import * as React from "react"
import { MailIcon, PhoneIcon, SendIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/api/request"
import type {
  CreateSupportRequestDTO,
  SupportContactPreference,
  SupportPriority,
  SupportRequestType,
} from "@/lib/dtos/support_dtos"
import { cn } from "@/lib/utils"

import type { HelpCenterCopy } from "./help-center-copy"
import { createSupportRequestSchema } from "./support-request-schema"

type FormValues = Omit<CreateSupportRequestDTO, "sourcePath">
type FormErrors = Partial<Record<keyof FormValues, string>>

const categories = [
  "inventory",
  "sales",
  "debts",
  "account",
  "reports",
  "dashboard",
  "other",
] as const
const priorities = ["low", "normal", "high", "urgent"] as const
const contacts = [
  { value: "email", icon: MailIcon },
  { value: "phone", icon: PhoneIcon },
] as const

function initialValues(type: SupportRequestType): FormValues {
  return {
    type,
    category: "",
    subject: "",
    message: "",
    priority: "normal",
    contactPreference: "email",
  }
}

export function SupportRequestForm({
  activeType,
  copy,
  onSubmitted,
}: {
  activeType: SupportRequestType
  copy: HelpCenterCopy["form"]
  onSubmitted: (
    payload: CreateSupportRequestDTO
  ) => Promise<{ data: { referenceNumber: string }; message: string }>
}) {
  const [values, setValues] = React.useState<FormValues>(() =>
    initialValues(activeType)
  )
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [submitting, setSubmitting] = React.useState(false)

  function update<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createSupportRequestSchema(copy.validation).safeParse(values)

    if (!result.success) {
      const nextErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues | undefined
        if (field && !nextErrors[field]) nextErrors[field] = issue.message
      }
      setErrors(nextErrors)
      return
    }

    try {
      setSubmitting(true)
      const response = await onSubmitted({
        ...result.data,
        sourcePath: window.location.pathname,
      })
      toast.success(copy.sent, {
        description: `${copy.sentDescription}: ${response.data.referenceNumber}`,
      })
      setValues(initialValues(activeType))
      setErrors({})
    } catch (error) {
      toast.error(copy.sendFailed, {
        description: getApiErrorMessage(error),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:p-5">
      <div className="border-b border-border/60 pb-4">
        <h2 className="font-heading text-base font-semibold">
          {copy.titles[activeType]}
        </h2>
        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.category} error={errors.category}>
            <Select
              value={values.category}
              onValueChange={(value) => value && update("category", value)}
            >
              <SelectTrigger
                className="h-9 w-full rounded-xl bg-transparent px-3"
                aria-invalid={Boolean(errors.category)}
              >
                <SelectValue placeholder={copy.categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {copy.categories[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={copy.subject} error={errors.subject}>
            <Input
              value={values.subject}
              onChange={(event) => update("subject", event.target.value)}
              placeholder={copy.subjectPlaceholder}
              maxLength={120}
              aria-invalid={Boolean(errors.subject)}
              className="h-9 rounded-xl bg-transparent px-3 text-xs"
            />
          </Field>
        </div>

        <Field label={copy.message} error={errors.message}>
          <Textarea
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={copy.messagePlaceholder}
            maxLength={2000}
            aria-invalid={Boolean(errors.message)}
            className="min-h-32 rounded-xl bg-transparent p-3 text-xs"
          />
          <span className="mt-1 block text-right text-[9px] text-muted-foreground">
            {values.message.length}/2000
          </span>
        </Field>

        {activeType === "feedback" ? (
          <Field label={copy.rating} error={errors.rating}>
            <div className="flex items-center gap-1" role="radiogroup">
              {Array.from({ length: 5 }, (_, index) => {
                const rating = index + 1
                const selected = rating <= (values.rating ?? 0)

                return (
                  <button
                    key={rating}
                    type="button"
                    role="radio"
                    aria-checked={values.rating === rating}
                    aria-label={`${rating} ${copy.ratingLabel}`}
                    onClick={() => update("rating", rating)}
                    className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:outline-none"
                  >
                    <StarIcon
                      className={cn(
                        "size-5",
                        selected && "fill-orange-500 text-orange-500"
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </Field>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.priority}>
            <Select
              value={values.priority}
              onValueChange={(value) =>
                value && update("priority", value as SupportPriority)
              }
            >
              <SelectTrigger className="h-9 w-full rounded-xl bg-transparent px-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {copy.priorities[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={copy.contact}>
            <Select
              value={values.contactPreference}
              onValueChange={(value) =>
                value &&
                update("contactPreference", value as SupportContactPreference)
              }
            >
              <SelectTrigger className="h-9 w-full rounded-xl bg-transparent px-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(({ value, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <Icon />
                    {copy.contacts[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex justify-end border-t border-border/60 pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="rounded-xl bg-orange-500 px-4 text-white hover:bg-orange-600"
          >
            <SendIcon />
            {submitting ? copy.sending : copy.send}
          </Button>
        </div>
      </form>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px]">{label}</Label>
      {children}
      {error ? <p className="text-[10px] text-destructive">{error}</p> : null}
    </div>
  )
}
