import { pageEndingWithEmptyParagraph, pageEndingWithMeet, pageEndingWithParagraph, pageEndingWithTitle } from "./common"

describe("Normalize", () => {
  it("should not automatically add a paragraph at the end of the page on loading when the page already ends with a paragraph", () => {
    pageEndingWithParagraph.initialize()
      .getBloc("lastParagraph")
      .get()
      .nextAll("p")
      .should("not.exist")
  })

  it("should not automatically add a paragraph at the end of the page when on loading when the page ends with a title", () => {
    pageEndingWithTitle.initialize()
      .getBloc("lastTitle")
      .get()
      .nextAll("p")
      .should("not.exist")
  })

  it("should automatically add a paragraph at the end of the page when on loading when the page ends with a meet", () => {
    pageEndingWithMeet.initialize()
      .getBloc("lastMeet")
      .get()
      .nextAll("p")
      .should("exist")
  })

  it("should not automatically add a paragraph at the end of the page when transforming the last bloc into a title", () => {
    pageEndingWithEmptyParagraph.initialize()
      .getBloc("lastParagraph")
      .type("# ")
      .get()
      .nextAll("p")
      .should("not.exist")
  })

  it("should automatically add a paragraph at the end of the page when transforming the last bloc into a meet", () => {
    pageEndingWithEmptyParagraph.initialize()
      .getBloc("lastParagraph")
      .type("/meet ")
      .get()
      .nextAll("p")
      .should("exist")
  })
})