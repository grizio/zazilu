import { Caret, UniqueSelection } from "./Selection"
import { getCurrentCaretPosition, getCurrentSelection } from "../../../utils/dom"

type Letter =
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m"
  | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
type Key =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Backspace"
  | "Delete"
  | "Enter"
  | " "
  | Letter
type ActionKey = `${"ctrl+" | ""}${"alt+" | ""}${"shift+" | ""}${Key}`

type KeyboardAction = (event: KeyboardEvent) => boolean

export class KeyboardListener {
  readonly actions: Partial<Record<ActionKey, Array<KeyboardAction>>>

  constructor(actions: Partial<Record<ActionKey, Array<KeyboardAction>>> = {}) {
    this.actions = actions
  }

  on = (actionKey: ActionKey): ActionBuilder<{}> => {
    return new ActionBuilder({
      actionKey,
      filter: () => true,
      extractor: () => ({}),
      listener: this
    })
  }

  onEvent = (event: KeyboardEvent): void => {
    const actionsForKey = this.actions[this.buildActionKeyCode(event)] ?? []
    for (let i = 0; i < actionsForKey.length; i++) {
      if (actionsForKey[i](event)) {
        event.preventDefault()
        return
      }
    }
  }

  private buildActionKeyCode = (event: KeyboardEvent): ActionKey => {
    const ctrlPrefix = event.ctrlKey ? "ctrl+" : ""
    const altPrefix = event.altKey ? "alt+" : ""
    const shiftPrefix = event.shiftKey ? "shift+" : ""
    return ctrlPrefix + altPrefix + shiftPrefix + event.key as ActionKey
  }
}

type ActionBuilderState<Detail> = {
  actionKey: ActionKey
  filter: (event: KeyboardEvent, detail: Detail) => boolean
  extractor: (event: KeyboardEvent) => Detail | undefined
  listener: KeyboardListener
}
class ActionBuilder<Detail extends {}> {
  private readonly state: ActionBuilderState<Detail>

  constructor(state: ActionBuilderState<Detail>) {
    this.state = state
  }

  withCaret = (): ActionBuilder<Detail & { caret: Caret }> => {
    return new ActionBuilder(
      {
        ...this.state,
        extractor: (event) => {
          const previousDetail = this.state.extractor(event)
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
      }
    )
  }

  withUniqueSelection = (): ActionBuilder<Detail & { selection: UniqueSelection }> => {
    return new ActionBuilder(
      {
        ...this.state,
        extractor: (event) => {
          const previousDetail = this.state.extractor(event)
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
      }
    )
  }

  filter = (fn: (params: { event: KeyboardEvent } & Detail) => boolean): ActionBuilder<Detail> => {
    return new ActionBuilder<Detail>({
      ...this.state,
      filter: (event, detail) => this.state.filter(event, detail) && fn({ event, ...detail })
    })
  }

  process = (fn: (params: { event: KeyboardEvent } & Detail) => void): KeyboardListener => {
    const existingActionsForCode = this.state.listener.actions[this.state.actionKey] ?? []
    const newActions = {
      ...this.state.listener.actions,
      [this.state.actionKey]: [
        ...existingActionsForCode,
        (event: KeyboardEvent) => {
          const detail = this.state.extractor(event)
          if (detail !== undefined && this.state.filter(event, detail)) {
            fn({ event, ...detail })
            return true
          } else {
            return false
          }
        }
      ]
    }
    return new KeyboardListener(newActions)
  }

  tryProcess = (fn: (params: { event: KeyboardEvent } & Detail) => boolean): KeyboardListener => {
    const existingActionsForCode = this.state.listener.actions[this.state.actionKey] ?? []
    const newActions = {
      ...this.state.listener.actions,
      [this.state.actionKey]: [
        ...existingActionsForCode,
        (event: KeyboardEvent) => {
          const detail = this.state.extractor(event)
          if (detail !== undefined && this.state.filter(event, detail)) {
            return fn({ event, ...detail })
          } else {
            return false
          }
        }
      ]
    }
    return new KeyboardListener(newActions)
  }
}