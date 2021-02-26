import { Caret, UniqueSelection } from "./Selection"
import { getCurrentCaretPosition, getCurrentSelection } from "../../../utils/dom"

type Letter =
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m"
  | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
type Keys =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Backspace"
  | "Delete"
  | "Enter"
  | " "
  | Letter
type Modifiers = "ctrl" | "alt" | "shift"
type ActionKey =
  | Keys
  | `${Modifiers}+${Keys}`
  | `${Modifiers}+${Modifiers}+${Keys}`
  | `${Modifiers}+${Modifiers}+${Modifiers}+${Keys}`

type KeyboardAction = (event: KeyboardEvent) => boolean

export class KeyboardListener {
  readonly actions: Array<KeyboardAction>

  constructor(actions: Array<KeyboardAction> = []) {
    this.actions = actions
  }

  on = (actionKey: ActionKey): ActionBuilder<{}> => {
    return new ActionBuilder(this.buildKeyFilter(actionKey), this, () => ({}))
  }

  private buildKeyFilter = (actionKey: ActionKey): (event: KeyboardEvent) => boolean => {
    const parts = actionKey.split("+")
    const key = parts[parts.length - 1]
    const ctrlModifier = parts.includes("ctrl")
    const altModifier = parts.includes("alt")
    const shiftModifier = parts.includes("shift")
    return (event: KeyboardEvent) =>
      event.key === key &&
      event.ctrlKey === ctrlModifier &&
      event.altKey === altModifier &&
      event.shiftKey === shiftModifier
  }

  onEvent = (event: KeyboardEvent): void => {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i](event)) {
        event.preventDefault()
        return
      }
    }
  }
}

class ActionBuilder<Detail extends {}> {
  private readonly _filter: (event: KeyboardEvent, detail: Detail) => boolean
  private readonly _listener: KeyboardListener
  private readonly _extractor: (event: KeyboardEvent) => Detail | undefined

  constructor(filter: (event: KeyboardEvent, detail: Detail) => boolean, listener: KeyboardListener, extractor: (event: KeyboardEvent) => Detail | undefined) {
    this._filter = filter
    this._listener = listener
    this._extractor = extractor
  }

  withCaret = (): ActionBuilder<Detail & { caret: Caret }> => {
    return new ActionBuilder(
      this._filter,
      this._listener,
      (event) => {
        const previousDetail = this._extractor(event)
        if (previousDetail !== undefined) {
          const caret = getCurrentCaretPosition()
          if (caret !== undefined) {
            return { ...previousDetail, caret: new Caret(caret) }
          } else {
            return undefined
          }
        } else {
          return undefined
        }
      }
    )
  }

  withUniqueSelection = (): ActionBuilder<Detail & { selection: UniqueSelection }> => {
    return new ActionBuilder(
      this._filter,
      this._listener,
      (event) => {
        const previousDetail = this._extractor(event)
        if (previousDetail !== undefined) {
          const selection = getCurrentSelection()
          if (selection !== undefined) {
            return { ...previousDetail, selection: new UniqueSelection(selection) }
          } else {
            return undefined
          }
        } else {
          return undefined
        }
      }
    )
  }

  filter = (fn: (params: { event: KeyboardEvent } & Detail) => boolean): ActionBuilder<Detail> => {
    return new ActionBuilder<Detail>(
      (event, detail) => this._filter(event, detail) && fn({ event, ...detail }),
      this._listener,
      this._extractor
    )
  }

  process = (fn: (params: { event: KeyboardEvent } & Detail) => void): KeyboardListener => {
    return new KeyboardListener(
      [
        ...this._listener.actions,
        (event: KeyboardEvent) => {
          const detail = this._extractor(event)
          if (detail !== undefined && this._filter(event, detail)) {
            fn({ event, ...detail })
            return true
          } else {
            return false
          }
        }
      ]
    )
  }

  tryProcess = (fn: (params: { event: KeyboardEvent } & Detail) => boolean): KeyboardListener => {
    return new KeyboardListener(
      [
        ...this._listener.actions,
        (event: KeyboardEvent) => {
          const detail = this._extractor(event)
          if (detail !== undefined && this._filter(event, detail)) {
            return fn({ event, ...detail })
          } else {
            return false
          }
        }
      ]
    )
  }
}