export function equalsWithMargin(first: number, second: number, margin: number): boolean {
  return Math.abs(first - second) <= margin
}

export function median(min: number, max: number): number {
  return Math.floor((max - min) / 2) + min
}