import type { Bloc } from "../model/Page"

export type OnNewDetail = {
  index: number
  bloc: Exclude<Bloc, "id">
  moveTo?: Move
}

export type Move = "start" | "end"