import type { Bloc, Image, Meet, Text, TextPart } from "$lib/model/Page"

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
    case "img":
      return buildImage({ id: meet.id })
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
}
function buildMeet({ id }: BuildMeetParameters): Meet {
  return {
    type: "meet",
    id: id,
    date: new Date(Date.now()),
    members: []
  }
}

type BuildImageParameters = {
  id: string
  src?: string
  alt?: string
  caption?: string
}
function buildImage({ id, src, alt, caption }: BuildImageParameters): Image {
  return {
    type: "img",
    id: id,
    src: src ?? "/noimg.svg",
    alt: alt,
    caption: caption ?? "legend",
  }
}