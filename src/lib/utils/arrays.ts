export function insert<A>(array: Array<A>, index: number, element: A): Array<A> {
  const result = [...array]
  result.splice(index, 0, element)
  return result
}

export function replace<A>(array: Array<A>, index: number, element: A): Array<A> {
  const result = [...array]
  result[index] = element
  return result
}

export function remove<A>(array: Array<A>, index: number): Array<A> {
  const result = [...array]
  result.splice(index, 1)
  return result
}

export function unique<A>(array: Array<A>): boolean {
  for (let i = 0 ; i < array.length ; i++) {
    for (let j = i+1 ; j < array.length ; j++) {
      if (array[i] === array[j]) {
        return false
      }
    }
  }
  return true
}

export function uniqueBy<A, B>(array: Array<A>, by: (value: A) => B): boolean {
  return unique(array.map(by))
}

export function isDefined<A>(value: A | undefined): value is A {
  return value !== undefined
}

export function keepAfter<A>(array: Array<A>, predicate: (value: A) => boolean): Array<A> {
  const result = []
  let found = false
  for (let value of array) {
    if (found) {
      result.push(value)
    } else {
      found = predicate(value)
    }
  }
  return result
}

export function slice<A>(array: Array<A>, start?: number, end?: number): Array<A> {
  const result = [...array]
  result.slice(start, end)
  return result
}