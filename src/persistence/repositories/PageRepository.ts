import type { Page } from "~/model/Page"
import { generateId } from "~/utils/strings"

const defaultHomePage: Page = {
  key: "home",
  title: "Home",
  content: [
    { id: generateId(), type: "h1", content: [{type: "text", content: "Title 1"}] },
    { id: generateId(), type: "h2", content: [{type: "text", content: "Title 2"}] },
    { id: generateId(), type: "p", content: [{type: "text", content: "Welcome here!"}] },
    { id: generateId(), type: "p", content: [{type: "text", content: "The application is started."}] },
    { id: generateId(), type: "p", content: [{type: "text", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat. "}] },
    { id: generateId(), type: "meet", date: new Date(), members: ["Arthur"] },
  ]
}

export class PageRepository {
  private inMemory: Map<string, Page> = new Map<string, Page>([
    ["home", defaultHomePage]
  ])

  get = async (key: string): Promise<Page | undefined> => {
    return this.inMemory.get(key)
  }

  getAll = async (): Promise<Array<Page>> => {
    return Array.from(this.inMemory.values())
  }

  post = async (page: Page): Promise<void> => {
    if (this.inMemory.has(page.key)) {
      // TODO: error
    } else {
      this.inMemory.set(page.key, page)
    }
  }

  put = async (page: Page): Promise<void> => {
    if (this.inMemory.has(page.key)) {
      this.inMemory.set(page.key, page)
    } else {
      // TODO: error
    }
  }

  remove = async (key: string): Promise<void> => {
    if (this.inMemory.has(key)) {
      this.inMemory.delete(key)
    } else {
      // TODO: error
    }
  }
}