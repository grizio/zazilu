import type { TextPart } from "../../../model/Page"
import { em, link, plainText, strong, Text } from "../../../model/Page"
import { isDefined } from "../../../utils/arrays"

export function contentToDom(content: Array<TextPart>): Array<Node> {
  return content.map(part => {
    switch (part.type) {
      case "text":
        return document.createTextNode(part.content)
      case "strong":
        const strong = document.createElement("strong")
        contentToDom(part.content).forEach(_ => strong.appendChild(_))
        return strong
      case "em":
        const em = document.createElement("em")
        contentToDom(part.content).forEach(_ => em.appendChild(_))
        return em
      case "link":
        const link = document.createElement("a")
        link.setAttribute("href", part.link)
        contentToDom(part.content).forEach(_ => link.appendChild(_))
        return link
    }
  })
}

export function domToContent(nodes: NodeList): Array<TextPart> {
  return Array.from(nodes)
    .map(node => {
      switch (node.nodeName.toLowerCase()) {
        case "#text":
          return plainText({ content: node.textContent ?? "" })
        case "strong":
          return strong({ content: domToContent(node.childNodes) })
        case "em":
          return em({ content: domToContent(node.childNodes) })
        case "a":
          return link({ link: (node as HTMLElement).getAttribute("href") ?? "", content: domToContent(node.childNodes) })
        default:
          return undefined
      }
    })
    .filter(isDefined)
}

export function wasUpdated(current: Text, previous: Text): boolean {
  return JSON.stringify(current) !== JSON.stringify(previous)
}