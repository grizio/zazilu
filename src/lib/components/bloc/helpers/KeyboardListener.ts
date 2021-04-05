import { Caret, UniqueSelection, XRange } from "$lib/utils/dom/Selection"
import { getCurrentCaretPosition, getCurrentSelection } from "$lib/utils/dom"

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

type KeyboardAction<RequiredDetail> = (event: KeyboardEvent, requiredDetails: RequiredDetail) => boolean

export class KeyboardListener<RequiredDetail> {
  readonly actions: Partial<Record<ActionKey, Array<KeyboardAction<RequiredDetail>>>>

  constructor(actions: Partial<Record<ActionKey, Array<KeyboardAction<RequiredDetail>>>> = {}) {
    this.actions = actions
  }

  on = (actionKey: ActionKey): ActionBuilder<RequiredDetail, {}> => {
    return new ActionBuilder({
      actionKey,
      filter: () => true,
      extractor: () => ({}),
      listener: this
    })
  }

  onEvent = (event: KeyboardEvent, requiredDetail: RequiredDetail): void => {
    const actionsForKey = this.actions[this.buildActionKeyCode(event)] ?? []
    for (let i = 0; i < actionsForKey.length; i++) {
      if (actionsForKey[i](event, requiredDetail)) {
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

type ActionBuilderState<RequiredDetail extends {}, ExtractedDetail extends {}> = {
  actionKey: ActionKey
  filter: (event: KeyboardEvent, detail: RequiredDetail & ExtractedDetail) => boolean
  extractor: (event: KeyboardEvent) => ExtractedDetail | undefined
  listener: KeyboardListener<RequiredDetail>
}
class ActionBuilder<RequiredDetail extends {}, ExtractedDetail extends {}> {
  private readonly state: ActionBuilderState<RequiredDetail, ExtractedDetail>

  constructor(state: ActionBuilderState<RequiredDetail, ExtractedDetail>) {
    this.state = state
  }

  withCaret = (): ActionBuilder<RequiredDetail, ExtractedDetail & { caret: Caret }> => {
    return new ActionBuilder(
      {
        ...this.state,
        extractor: (event) => {
          const previousDetail = this.state.extractor(event)
          if (previousDetail !== undefined) {
            const caret = getCurrentCaretPosition()
            if (caret !== undefined) {
              return { ...previousDetail, caret: new Caret(new XRange(caret)) }
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

  withUniqueSelection = (): ActionBuilder<RequiredDetail, ExtractedDetail & { selection: UniqueSelection }> => {
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

  filter = (fn: (params: { event: KeyboardEvent } & RequiredDetail & ExtractedDetail) => boolean): ActionBuilder<RequiredDetail, ExtractedDetail> => {
    return new ActionBuilder<RequiredDetail, ExtractedDetail>({
      ...this.state,
      filter: (event, detail) => this.state.filter(event, detail) && fn({ event, ...detail })
    })
  }

  process = (fn: (params: { event: KeyboardEvent } & RequiredDetail & ExtractedDetail) => void): KeyboardListener<RequiredDetail> => {
    return this.tryProcess(params => {
      fn(params)
      return true
    })
  }

  tryProcess = (fn: (params: { event: KeyboardEvent } & RequiredDetail & ExtractedDetail) => boolean): KeyboardListener<RequiredDetail> => {
    const existingActionsForCode = this.state.listener.actions[this.state.actionKey] ?? []
    const newActions = {
      ...this.state.listener.actions,
      [this.state.actionKey]: [
        ...existingActionsForCode,
        (event: KeyboardEvent, requiredDetail: RequiredDetail) => {
          const extractedDetail = this.state.extractor(event)
          if (extractedDetail !== undefined) {
            const detail = {...requiredDetail, ...extractedDetail}
            if (this.state.filter(event, detail)) {
              return fn({ event, ...detail })
            } else {
              return false
            }
          } else {
            return false
          }
        }
      ]
    }
    return new KeyboardListener(newActions)
  }
}