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

  on = (actionKey: ActionKey): ActionBuilder => {
    return new ActionBuilder(this.buildKeyFilter(actionKey), this)
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

class ActionBuilder {
  private readonly _filter: (event: KeyboardEvent) => boolean
  private readonly _listener: KeyboardListener

  constructor(filter: (event: KeyboardEvent) => boolean, listener: KeyboardListener) {
    this._filter = filter
    this._listener = listener
  }

  filter = (fn: (event: KeyboardEvent) => boolean): ActionBuilder => {
    return new ActionBuilder(
      _ => this._filter(_) && fn(_),
      this._listener
    )
  }

  process = (fn: (event: KeyboardEvent) => void): KeyboardListener => {
    return new KeyboardListener(
      [
        ...this._listener.actions,
        (event: KeyboardEvent) => {
          if (this._filter(event)) {
            fn(event)
            return true
          } else {
            return false
          }
        }
      ]
    )
  }

  tryProcess = (fn: (event: KeyboardEvent) => boolean): KeyboardListener => {
    return new KeyboardListener(
      [
        ...this._listener.actions,
        (event: KeyboardEvent) => {
          if (this._filter(event)) {
            return fn(event)
          } else {
            return false
          }
        }
      ]
    )
  }
}