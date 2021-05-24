export type SimpleTextFormSubmitEvent = CustomEvent<{
  value: string,
  clear: () => void
}>