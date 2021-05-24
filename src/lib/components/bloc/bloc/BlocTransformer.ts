import { generateId } from "$lib/utils/strings"
import type { Bloc, Image, Meet, Meets, Text, TextPart } from "$model/Page"

export function transformBloc(bloc: Bloc, target: Bloc["type"]): Bloc {
  switch (bloc.type) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return transformText(bloc, target)
    case "meet":
      return transformMeet(bloc, target)
    case "meets":
      return transformMeets(bloc, target)
    case "img":
      return transformImage(bloc, target)
  }
}

function transformText(text: Text, target: Bloc["type"]): Bloc {
  switch (target) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        type: target,
        id: text.id,
        content: text.content
      }
    case "meet":
      return buildMeet({ id: text.id })
    case "meets":
      return buildMeets({ id: text.id })
    case "img":
      return buildImage({ id: text.id })
  }
}

function transformMeet(meet: Meet, target: Bloc["type"]): Bloc {
  switch (target) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        type: target,
        id: meet.id,
        content: []
      }
    case "meet":
      return meet
    case "meets":
      return buildMeets({ id: meet.id, meets: [meet] })
    case "img":
      return buildImage({ id: meet.id })
  }
}

function transformMeets(meets: Meets, target: Bloc["type"]): Bloc {
  switch (target) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        type: target,
        id: meets.id,
        content: []
      }
    case "meet":
      return buildMeet({ id: meets.id, date: meets.meets[0]?.date, members: meets.meets[0]?.members })
    case "meets":
      return meets
    case "img":
      return buildImage({ id: meets.id })
  }
}

function transformImage(image: Image, target: Bloc["type"]): Bloc {
  switch (target) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        type: target,
        id: image.id,
        content: image.caption !== undefined ? [{ type: "text", content: image.caption }] : []
      }
    case "meet":
      return buildMeet({ id: image.id })
    case "meets":
      return buildMeets({ id: image.id })
    case "img":
      return image
  }
}

type BuildTextParameters = {
  id: string
  type: Text["type"]
  content?: string | Array<TextPart>
}
function buildText({ id, type, content }: BuildTextParameters): Text {
  return {
    type: type,
    id: id,
    content: Array.isArray(content)
      ? content
      : typeof content === "string"
        ? [{ type: "text", content }]
        : []
  }
}

type BuildMeetParameters = {
  id: string
  date?: Date
  members?: Array<string>
}
function buildMeet({ id, date, members }: BuildMeetParameters): Meet {
  return {
    type: "meet",
    id: id,
    date: date ?? new Date(Date.now()),
    members: members ?? []
  }
}

type BuildMeetsParameters = {
  id: string
  meets?: Array<Meet>
}
function buildMeets({ id, meets }: BuildMeetsParameters): Meets {
  return {
    type: "meets",
    id: id,
    meets: meets ?? [buildMeet({ id: generateId() })]
  }
}

type BuildImageParameters = {
  id: string
  key?: string
  alt?: string
  caption?: string
}
function buildImage({ id, key, alt, caption }: BuildImageParameters): Image {
  return {
    type: "img",
    id: id,
    key: key ?? "",
    alt: alt,
    caption: caption ?? "legend",
  }
}