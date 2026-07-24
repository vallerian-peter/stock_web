"use client"

import { forwardRef, useId, useState } from "react"
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useUiCopy } from "@/components/ui/ui-copy"

export type InputFieldProps = Omit<React.ComponentProps<"input">, "size"> & {
  labelText?: React.ReactNode
  helperText?: string
  errorText?: string
  rules?: string[]
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  labelAction?: React.ReactNode
  containerClassName?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      type = "text",
      labelText,
      helperText,
      errorText,
      rules,
      prefixIcon,
      suffixIcon,
      labelAction,
      containerClassName,
      className,
      autoComplete,
      onBlur,
      onKeyDown,
      onKeyUp,
      spellCheck,
      autoCapitalize,
      ...props
    },
    ref
  ) => {
    const copy = useUiCopy()
    const generatedId = useId()
    const inputId = id ?? generatedId
    const isPasswordField = type === "password"
    const isDateField = type === "date"
    const isDateTimeField = type === "datetime-local"
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [capsLockOn, setCapsLockOn] = useState(false)

    const helperMessageId = helperText ? `${inputId}-helper` : undefined
    const errorMessageId = errorText ? `${inputId}-error` : undefined
    const rulesMessageId =
      rules && rules.length > 0 ? `${inputId}-rules` : undefined
    const capsLockMessageId =
      isPasswordField && capsLockOn ? `${inputId}-caps-lock` : undefined

    const describedBy =
      [helperMessageId, rulesMessageId, errorMessageId, capsLockMessageId]
        .filter(Boolean)
        .join(" ") || undefined

    const resolvedType = isPasswordField && isPasswordVisible ? "text" : type
    const shouldUseInputGroup = Boolean(
      prefixIcon || suffixIcon || isPasswordField
    )

    const updateCapsLockState = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (isPasswordField) {
        setCapsLockOn(event.getModifierState("CapsLock"))
      }
    }

    const sharedInputProps = {
      ...props,
      id: inputId,
      ref,
      type: resolvedType,
      lang:
        props.lang ??
        (isDateField || isDateTimeField ? "en-GB" : undefined),
      placeholder:
        props.placeholder ??
        (isDateField
          ? "dd/mm/yyyy"
          : isDateTimeField
            ? "dd/mm/yyyy --:--"
            : undefined),
      autoComplete: autoComplete ?? "off",
      "aria-invalid": Boolean(errorText),
      "aria-describedby": describedBy,
      className: cn(
        "input-field-control !bg-transparent dark:!bg-transparent",
        className
      ),
      spellCheck: isPasswordField ? false : spellCheck,
      autoCapitalize: isPasswordField ? "none" : autoCapitalize,
      onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
        updateCapsLockState(event)
        onKeyDown?.(event)
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => {
        updateCapsLockState(event)
        onKeyUp?.(event)
      },
      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
        setCapsLockOn(false)
        onBlur?.(event)
      },
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {labelText || labelAction ? (
          <div className="flex items-center justify-between gap-3">
            {labelText ? (
              <Label htmlFor={inputId} className="text-sm">
                {labelText}
                {props.required ? (
                  <span className="-ml-1 text-destructive" aria-hidden="true">
                    *
                  </span>
                ) : null}
              </Label>
            ) : null}
            {labelAction}
          </div>
        ) : null}

        {shouldUseInputGroup ? (
          <InputGroup className="input-field-group !bg-transparent dark:!bg-transparent">
            {prefixIcon ? (
              <InputGroupAddon
                align="inline-start"
                className="input-field-addon !bg-transparent dark:!bg-transparent"
              >
                <InputGroupText>{prefixIcon}</InputGroupText>
              </InputGroupAddon>
            ) : null}

            <InputGroupInput {...sharedInputProps} />

            {suffixIcon || isPasswordField ? (
              <InputGroupAddon
                align="inline-end"
                className="input-field-addon !bg-transparent dark:!bg-transparent"
              >
                {suffixIcon ? (
                  <InputGroupText>{suffixIcon}</InputGroupText>
                ) : null}
                {isPasswordField ? (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={
                      isPasswordVisible ? copy.hidePassword : copy.showPassword
                    }
                    onClick={() =>
                      setIsPasswordVisible((currentState) => !currentState)
                    }
                  >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                ) : null}
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        ) : (
          <Input {...sharedInputProps} />
        )}

        {helperText ? (
          <p id={helperMessageId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}

        {rules && rules.length > 0 ? (
          <div
            id={rulesMessageId}
            className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground"
          >
            <p className="font-medium text-foreground">{copy.rulesToFollow}</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {errorText ? (
          <p
            id={errorMessageId}
            className="flex items-center gap-1 text-xs text-destructive"
          >
            <AlertCircleIcon className="size-3.5" />
            <span>{errorText}</span>
          </p>
        ) : null}

        {isPasswordField && capsLockOn ? (
          <p
            id={capsLockMessageId}
            className="flex items-center gap-1 text-xs text-amber-600"
          >
            <AlertCircleIcon className="size-3.5" />
            <span>{copy.capsLockOn}</span>
          </p>
        ) : null}
      </div>
    )
  }
)

InputField.displayName = "InputField"
