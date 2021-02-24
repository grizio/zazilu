import type { Bloc } from "../model/Page"

export type BlocEditComponent = {
  move(move: Move): void
}

export type PageEditEventDispatcher = {
  new: OnNewDetail
  move: OnMoveDetail
  merge: OnMergeDetail
  update: OnUpdateDetail
}

export type OnNewDetail = {
  index: number
  bloc: Omit<Bloc, "id">
  moveTo?: Move
}

export type Move =
  | { type: "start" }
  | { type: "end" }
  | { type: "top-relative", x: number }
  | { type: "bottom-relative", x: number }
  | { type: "offset-start", at: number }
  | { type: "offset-end", at: number }

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