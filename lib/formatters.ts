export function formatCompactName(value: string) {
  return value
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/(^|['-])\p{L}/gu, (match) => match.toUpperCase())
}

type FormatterLocale = "en" | "sw"

function resolveDateLocale(locale: FormatterLocale) {
  return locale === "sw" ? "sw-TZ" : "en-GB"
}

function resolveRelativeDateText(locale: FormatterLocale, value: number, unit: Intl.RelativeTimeFormatUnit) {
  return new Intl.RelativeTimeFormat(resolveDateLocale(locale), {
    numeric: "auto",
  }).format(value, unit)
}

export function toHumanForm(
  value: string | Date,
  locale: FormatterLocale = "en"
) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : ""
  }

  const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000)
  const absoluteSeconds = Math.abs(diffInSeconds)

  if (absoluteSeconds < 60) {
    return resolveRelativeDateText(locale, diffInSeconds, "second")
  }

  if (absoluteSeconds < 60 * 60) {
    return resolveRelativeDateText(
      locale,
      Math.trunc(diffInSeconds / 60),
      "minute"
    )
  }

  if (absoluteSeconds < 60 * 60 * 24) {
    return resolveRelativeDateText(
      locale,
      Math.trunc(diffInSeconds / (60 * 60)),
      "hour"
    )
  }

  return new Intl.DateTimeFormat(resolveDateLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function formatCurrencyTZS(
  value: string | number,
  locale: FormatterLocale = "en"
) {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(value)

  if (Number.isNaN(numericValue)) {
    return typeof value === "string" ? value : ""
  }

  return new Intl.NumberFormat(resolveDateLocale(locale), {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue)
}
