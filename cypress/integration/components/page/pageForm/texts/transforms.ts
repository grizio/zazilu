import { fullPageFormObject } from "../common"

describe("TextEdit transforms", () => {
  it("should transform a paragraph into a h1", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstParagraph")
      .moveCursorToStart()
      .type("# ")
      .shouldBeA("h1")
      .shouldHaveText("This is some text.")
  })

  it("should transform a paragraph into a h2", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstParagraph")
      .moveCursorToStart()
      .type("## ")
      .shouldBeA("h2")
      .shouldHaveText("This is some text.")
  })

  it("should transform a h1 into a h3", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("title1")
      .moveCursorToStart()
      .type("### ")
      .shouldBeA("h3")
      .shouldHaveText("Title 1")
  })

  it("should transform a h1 into a h4", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("title1")
      .moveCursorToStart()
      .type("#### ")
      .shouldBeA("h4")
      .shouldHaveText("Title 1")
  })

  it("should transform a h2 into a h5", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("title2")
      .moveCursorToStart()
      .type("##### ")
      .shouldBeA("h5")
      .shouldHaveText("Title 2")
  })

  it("should transform a h2 into a h6", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("title2")
      .moveCursorToStart()
      .type("###### ")
      .shouldBeA("h6")
      .shouldHaveText("Title 2")
  })

  it("should transform a h2 into a paragraph", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("title2")
      .moveCursorToStart()
      .type("!# ")
      .shouldBeA("p")
      .shouldHaveText("Title 2")
  })

  it("should transform a rich paragraph into a h1", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstRichParagraph")
      .moveCursorToStart()
      .type("# ")
      .shouldBeA("h1")
      .shouldHaveHTML("Interdum et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should transform a paragraph into meet", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstParagraph")
      .moveCursorToStart()
      .type("/meet ")
      .shouldBeA("meet")
  })

  it("should transform a paragraph into image", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstParagraph")
      .moveCursorToStart()
      .type("/img ")
      .shouldBeA("img")
  })
})