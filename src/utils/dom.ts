export type CustomEvent<A> = Event & {
  detail: A
}