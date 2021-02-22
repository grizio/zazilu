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