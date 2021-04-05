export function oneOf<A>(acceptedValues: Array<A>): A {
  return acceptedValues[intBetween(0, acceptedValues.length - 1)]
}

export function intBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}