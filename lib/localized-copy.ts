export type LocalizedCopy<T> = T extends string
  ? string
  : { [Key in keyof T]: LocalizedCopy<T[Key]> }

export function defineLocalizedCopy<
  const EnglishCopy extends Record<string, unknown>,
>(copy: { en: EnglishCopy; sw: LocalizedCopy<EnglishCopy> }) {
  return copy
}
