import type { Bloc } from "../model/Page"

export type BlocEditComponent = {
  move(move: Move): void
}

export type PageEditEventDispatcher = {
  new: OnNewDetail,
  move: OnMoveDetail,
  merge: OnMergeDetail,
}

export type OnNewDetail = {
  index: number
  bloc: Exclude<Bloc, "id">
  moveTo?: Move
}

export type Move =
  | { type: "start" }
  | { type: "end" }
  | { type: "top-relative", x: number }
  | { type: "bottom-relative", x: number }

export type OnMoveDetail = {
  index: number
  move: Move
}

export type OnMergeDetail = {
  firstIndex: number
  secondIndex: number
}