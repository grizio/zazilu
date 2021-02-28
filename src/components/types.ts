import type { Bloc } from "~/model/Page"
import { generateId } from "~/utils/strings"

export type BlocEditComponent = {
  move(move: Move): void
}

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type PageEditEventDispatcher = {
  new: OnNewDetail
  move: OnMoveDetail
  merge: OnMergeDetail
  update: OnUpdateDetail
}

export type OnNewDetail = {
  index: number
  bloc: DistributiveOmit<Bloc, "id">
  moveTo?: Move
}

export type Move =
  | { type: "start" }
  | { type: "end" }
  | { type: "top-relative", x: number }
  | { type: "bottom-relative", x: number }
  | { type: "offset-start", at: number }
  | { type: "offset-end", at: number }
  | { type: "selection", start: number, end: number }

export type OnMoveDetail = {
  index: number
  move: Move
}

export type OnMergeDetail = {
  firstIndex: number
  secondIndex: number
  move?: Move
}

export type OnUpdateDetail = {
  index: number
  bloc: Bloc
}

export function withGeneratedId(bloc: DistributiveOmit<Bloc, "id">): Bloc {
  return {
    ...bloc,
    id: generateId()
  }
}