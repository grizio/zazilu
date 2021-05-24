import { Readable, Writable, Subscriber, Unsubscriber, writable, get } from "svelte/store"
import { array, object, string, Validator } from "idonttrustlikethat"
import { buildUrl } from "$lib/utils/url"

type State<T> = {
  elements: Array<T>
  loading: boolean
  next?: string
  error?: string
}
export class PaginatedStore<T> implements Readable<State<T>> {
  private readonly internal: Writable<State<T>>
  private readonly baseUrl: string
  private readonly validator: Validator<{ elements: Array<T>, next?: string }>

  constructor(baseUrl: string, validator: Validator<T>) {
    this.internal = writable({ elements: [], loading: false })
    this.baseUrl = baseUrl
    this.validator = object({
      elements: array(validator),
      next: string.optional(),
    })
  }

  subscribe = (run: Subscriber<State<T>>, invalidate?: (s?: State<T>) => void): Unsubscriber => {
    return this.internal.subscribe(run, invalidate)
  }

  initialize = async (query: Record<string, string | number | undefined> = {}) => {
    this.internal.set({
      elements: [],
      loading: true
    })

    await this.load(buildUrl(this.baseUrl, query))
  }

  loadNext = async () => {
    const next = get(this.internal).next
    if (next !== undefined) {
      this.internal.update(current => ({
        ...current,
        loading: true
      }))
      this.load(next)
    }
  }

  private load = async (url: string) => {
    const response = await fetch(url)
    const json = await response.json()
    const validation = this.validator.validate(json)

    if (validation.ok) {
      this.internal.update(current => ({
        elements: [...current.elements, ...validation.value.elements],
        next: validation.value.next,
        loading: false,
        error: undefined
      }))
    } else {
      this.internal.update(current => ({
        ...current,
        loading: false,
        error: JSON.stringify(validation.errors)
      }))
    }
  }
}