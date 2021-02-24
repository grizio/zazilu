import type { TextPart } from "../../model/Page"
import { Text, plainText } from "../../model/Page"
import { isDefined } from "../../utils/arrays"

export function contentToDom(content: Array<TextPart>): Array<Node> {
  return content.map(part => {
    switch (part.type) {
      case "text":
        return document.createTextNode(part.content)
    }
  })
}

export function domToContent(nodes: NodeList): Array<TextPart> {
  return Array.from(nodes)
    .map(node => {
      switch (node.nodeName) {
        case "#text":
          return plainText({ content: node.textContent ?? "" })
        default:
          return undefined
      }
    })
    .filter(isDefined)
}

export function wasUpdated(current: Text, previous: Text): boolean {
  return JSON.stringify(current) !== JSON.stringify(previous)
}