import { fullPageFormObject } from "../common"

describe("TextEdit splits and merges", () => {
  it("should correctly add a new paragraph", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .typeEnter()
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().should("be.empty")
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().type("A new paragraph!")
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().should("have.text", "A new paragraph!")
    fullPageFormObject.getBloc("secondParagraph").shouldHaveText("Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly add a new paragraph with the text on right of cursor", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorOnLeft(5)
      .typeEnter()
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().should("have.text", "text.")
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().type("Changed ")
    fullPageFormObject.getBloc("firstParagraph").get().nextAll("p").first().should("have.text", "Changed text.")
    fullPageFormObject.getBloc("secondParagraph").shouldHaveText("Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using backspace", () => {
    fullPageFormObject
      .initialize()
      .getBloc("secondParagraph")
      .moveCursorToStart()
      .typeBackspace()
    fullPageFormObject.getBloc("firstParagraph")
      .shouldHaveText("This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    fullPageFormObject.getBloc("secondParagraph")
      .shouldNotExist()
    fullPageFormObject.getBloc("firstParagraph")
      .type("xxx")
      .shouldHaveText("This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should not merge two paragraphs when using backspace with a non collapsed selection", () => {
    fullPageFormObject
      .initialize()
      .getBloc("secondParagraph")
      .moveCursorToStart()
      .selectNextCharacters(6)
    fullPageFormObject.getBloc("secondParagraph").typeBackspace()
    fullPageFormObject.getBloc("firstParagraph").shouldHaveText("This is some text.")
    fullPageFormObject.getBloc("secondParagraph").shouldHaveText("aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should not merge two paragraphs when using delete with a non collapsed selection", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorToEnd()
      .selectPreviousCharacters(6)
      .typeDelete()
      .shouldHaveText("This is some")
    fullPageFormObject.getBloc("secondParagraph").shouldHaveText("Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using delete", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .typeDelete()
      .shouldHaveText("This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    fullPageFormObject.getBloc("secondParagraph").shouldNotExist()
    fullPageFormObject.getBloc("firstParagraph")
      .type("xxx")
      .shouldHaveText("This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two titles when using backspace", () => {
    fullPageFormObject
      .initialize()
      .getBloc("title2")
      .moveCursorToStart()
      .typeBackspace()
    fullPageFormObject.getBloc("title1").shouldHaveText("Title 1Title 2")
    fullPageFormObject.getBloc("title2").shouldNotExist()
    fullPageFormObject.getBloc("title1")
      .type("xxx")
      .shouldHaveText("Title 1xxxTitle 2")
  })

  it("should correctly merge two titles when using delete", () => {
    fullPageFormObject
      .initialize()
      .getBloc("title1")
      .typeDelete()
      .shouldHaveText("Title 1Title 2")
    fullPageFormObject.getBloc("title2").shouldNotExist()
    fullPageFormObject.getBloc("title1")
      .type("xxx")
      .shouldHaveText("Title 1xxxTitle 2")
  })

  it("should correctly merge a title and a paragraph when using backspace", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorToStart()
      .typeBackspace()
      .shouldNotExist()
    fullPageFormObject.getBloc("title2")
      .shouldHaveText("Title 2This is some text.")
      .type("xxx")
      .shouldHaveText("Title 2xxxThis is some text.")
  })

  it("should correctly merge a title and a paragraph when using delete", () => {
    fullPageFormObject
      .initialize()
      .getBloc("title2")
      .typeDelete()
      .shouldHaveText("Title 2This is some text.")
    fullPageFormObject.getBloc("firstParagraph")
      .shouldNotExist()
    fullPageFormObject.getBloc("title2")
      .type("xxx")
      .shouldHaveText("Title 2xxxThis is some text.")
  })

  it("should correctly merge a paragraph and a title when using backspace", () => {
    fullPageFormObject
      .initialize()
      .getBloc("title12")
      .moveCursorToStart()
      .typeBackspace()
      .shouldNotExist()
    fullPageFormObject.getBloc("fifthParagraph")
      .shouldHaveText("Another paragraphTitle 12")
      .type("xxx")
      .shouldHaveText("Another paragraphxxxTitle 12")
  })

  it("should correctly merge a paragraph and a title when using delete", () => {
    fullPageFormObject
      .initialize()
      .getBloc("fifthParagraph")
      .typeDelete()
      .shouldHaveText("Another paragraphTitle 12")
    fullPageFormObject.getBloc("title12").shouldNotExist()
    fullPageFormObject.getBloc("fifthParagraph")
      .type("xxx")
      .shouldHaveText("Another paragraphxxxTitle 12")
  })
})