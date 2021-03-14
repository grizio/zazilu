export function menuAction(node: HTMLElement, initialIndex: number) {
  let index = initialIndex

  node.addEventListener("mouseenter", onEnter)

  function onEnter(event: Event) {
    const menu = document.getElementById("pageForm-menu")
    const element = event.target as HTMLElement
    if (menu !== null && element !== null) {
      menu.style.opacity = "1"
      menu.style.top = `${element.getBoundingClientRect().top + (document.scrollingElement?.scrollTop ?? 0)}px`
      menu.style.left = `${element.getBoundingClientRect().left - 25}px`
      menu.dataset.index = index.toString()
      menu.dataset.currentElement = element.dataset.testId
    }
  }

  return {
    update(newIndex: number) {
      index = newIndex
    },
    destroy() {
      node.removeEventListener("mouseenter", onEnter)
    }
  }
}