export class XNode<Internal extends Node = Node> {
  readonly node: Internal

  constructor(node: Internal) {
    this.node = node
  }

  static create(tagName: string): XNode<Node> {
    return new XNode(document.createElement(tagName))
  }

  get nodeName(): string {
    return this.node.nodeName
  }

  get parentNode(): XNode | undefined {
    return this.node.parentNode !== null
      ? new XNode(this.node.parentNode)
      : undefined
  }

  get childNodes(): NodeListOf<ChildNode> {
    return this.node.childNodes
  }

  get textContentLength(): number {
    return this.node.textContent?.length ?? 0
  }

  hasNodeType = (nodeName: string): boolean => {
    function process(node: Node): boolean {
      return node.nodeName === nodeName || Array.from(node.childNodes).some(process)
    }

    return process(this.node)
  }

  removeNodeType = (nodeName: string): this => {
    function process(node: Node) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes.item(i)
        if (child.nodeName === nodeName) {
          const numberOfChildren = child.childNodes.length
          while (child.firstChild !== null) {
            node.insertBefore(child.firstChild, child)
          }
          child.remove()
          i = i + numberOfChildren - 1
        }
      }
      node.childNodes.forEach(process)
    }

    process(this.node)
    return this
  }

  hasParentType = (nodeName: string): boolean => {
    function process(node: Node | undefined): boolean {
      return node !== undefined && (node.nodeName === nodeName || process(node.parentNode ?? undefined))
    }

    return process(this.node)
  }

  hasParent = (parent: Node): boolean => {
    function process(node: Node | null): boolean {
      if (node === null) {
        return false
      } else if (node === parent) {
        return true
      } else {
        return process(node.parentNode)
      }
    }
    return process(this.node)
  }

  getAncestorWhere = (predicate: (node: Node) => boolean): XNode | undefined => {
    function process(node: Node | null): XNode | undefined {
      if (node === null) {
        return undefined
      } else if (predicate(node)) {
        return new XNode(node)
      } else {
        return process(node.parentNode)
      }
    }
    return process(this.node)
  }

  clear = (): this => {
    while (this.node.firstChild !== undefined && this.node.firstChild !== null) {
      this.node.firstChild.remove()
    }
    return this
  }

  append = (...children: Array<Node | XNode<Node>>): this => {
    children.forEach(child => this.node.appendChild((child as XNode<Node>).node ?? child as Node))
    return this
  }

  clean = (): this => {
    this.processClean(this.node)
    return this
  }

  private processClean = (node: Node) => {
    for (let i = 1; i < node.childNodes.length; i++) {
      const previousNode = node.childNodes.item(i - 1)
      const currentNode = node.childNodes.item(i)
      if (previousNode.nodeName === "#text" && currentNode.nodeName === "#text") {
        previousNode.textContent = (previousNode.textContent ?? "") + (currentNode.textContent ?? "")
        currentNode.remove()
        i--
      } else if (previousNode.nodeName === "STRONG" && currentNode.nodeName === "STRONG") {
        currentNode.childNodes.forEach(_ => previousNode.appendChild(_))
        currentNode.remove()
        i--
      }
    }
    node.childNodes.forEach(this.processClean)
  }

  focus = (): this => {
    if (this.node instanceof HTMLElement) {
      this.node.focus()
    }
    return this
  }
}