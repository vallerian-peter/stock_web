"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockIcon, MailIcon } from "lucide-react"
import { toast } from "sonner"

import { login } from "@/api/auth_api"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { getApiErrorMessage } from "@/lib/api/request"
import { landingContent } from "@/lib/landing-content"

import { Logo } from "./logo"
import { Spinner } from "./ui/spinner"

export default function LoginPage() {
  const router = useRouter()
  const { locale } = useLandingLocale()
  const copy = landingContent[locale].authLogin
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const authResponse = await login(formValues)
      toast.success(copy.submit)
      router.push(
        authResponse.user.role?.toString().trim().toUpperCase() === "USER"
          ? "/dashboard"
          : "/dashboard"
      )
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 pb-6">
          <div className="text-center">
            <Link
              href="/"
              aria-label={copy.homeAriaLabel}
              className="mx-auto block w-fit"
            >
              <Logo />
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">{copy.title}</h1>
            <p className="text-sm">{copy.description}</p>
          </div>

          <div className="mt-6 space-y-6">
            <InputField
              id="email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={(event) =>
                setFormValues((currentState) => ({
                  ...currentState,
                  email: event.target.value,
                }))
              }
              labelText={copy.emailLabel}
              placeholder={copy.emailPlaceholder}
              prefixIcon={<MailIcon className="size-4" />}
              helperText={copy.emailHelper}
              autoComplete="email"
              required
            />

            <InputField
              id="password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={(event) =>
                setFormValues((currentState) => ({
                  ...currentState,
                  password: event.target.value,
                }))
              }
              labelText={copy.passwordLabel}
              placeholder={copy.passwordPlaceholder}
              prefixIcon={<LockIcon className="size-4" />}
              rules={[...copy.passwordRules]}
              autoComplete="current-password"
              labelAction={
                <Button
                  variant="link"
                  size="sm"
                  render={
                    <Link
                      href="#"
                      className="link intent-info variant-ghost text-sm"
                    />
                  }
                  nativeButton={false}
                >
                  {copy.forgotPassword}
                </Button>
              }
              required
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : copy.submit}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-xs text-muted-foreground">
              {copy.alternativeDivider}
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
            <Button type="button" variant="outline" disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path
                  fill="#00adef"
                  d="M121.663 256.002H0V134.336h121.663z"
                ></path>
                <path
                  fill="#fbbc09"
                  d="M256 256.002H134.335V134.336H256z"
                ></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-center text-sm text-accent-foreground">
            {copy.returnHomePrompt}
            <Button
              variant="link"
              className="px-2"
              render={<Link href="/" />}
              nativeButton={false}
            >
              {copy.returnHomeAction}
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
