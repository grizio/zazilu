import type { Bloc, Meet, Text } from "~/model/Page"

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
      return {
        type: "meet",
        id: text.id,
        date: new Date(Date.now()),
        members: []
      }
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
  }
}