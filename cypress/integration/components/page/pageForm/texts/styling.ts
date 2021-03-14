import { fullPageFormObject } from "../common"

describe("TextEdit styling", () => {
  it("should put selected text in strong when not already strong", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstRichParagraph")
      .moveCursorToOffset(2)
      .selectNextCharacters(5)
      .type("{ctrl+b}")
      .shouldHaveHTML("In<strong>terdu</strong>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should remove selected text from strong when all already strong", () => {
    fullPageFormObject
      .initialize()
      .getBloc("secondRichParagraph")
      .moveCursorToOffset(2)
      .selectNextCharacters(5)
      .type("{ctrl+b}")
      .shouldHaveHTML("<strong>Al</strong>iquam<strong> dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should remove selected text from strong when some part already strong", () => {
    fullPageFormObject.initialize()
    // case: te[xt - strong - te]xt
    fullPageFormObject.getBloc("firstRichParagraph")
      .selectText(27, 51)
      .type("{ctrl+b}")
      .shouldHaveHTML("Interdum et malesuada fames ac ante ipsum primis in faucibus")

    // case: str[ong - te]xt
    fullPageFormObject
      .getBloc("secondRichParagraph")
      .selectText(7, 22)
      .type("{ctrl+b}")
      .shouldHaveHTML("<strong>Aliquam</strong> dapibus, lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should keep the selection when making text strong", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstRichParagraph")
      .moveCursorToOffset(2)
      .selectNextCharacters(5)
      .type("{ctrl+b}")
      .type("xxx")
      .shouldHaveHTML("Inxxxm et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should keep the selection when removing the strong on text", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("secondRichParagraph")
      .moveCursorToOffset(2)
      .selectNextCharacters(5)
      .type("{ctrl+b}")
      .type("xxx")
      .shouldHaveHTML("<strong>Alxxx dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should put selected text in emphasis when not already emphasized", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstRichParagraph")
      .selectText(22, 35)
      .type("{ctrl+i}")
      .shouldHaveHTML("Interdum et malesuada <em>fames ac <strong>ante</strong></em><strong> ipsum</strong> primis in faucibus")
  })

  it("should put selected strong text in emphasis when not already emphasized", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("secondRichParagraph")
      .selectText(8, 15)
      .type("{ctrl+i}")
      .shouldHaveHTML("<strong>Aliquam <em>dapibus</em>, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should remove emphasize in selected text in emphasis when already emphasized", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("thirdRichParagraph")
      .selectText(24, 30)
      .type("{ctrl+i}")
      .shouldHaveHTML("<strong>Nulla condimentum <em>vitae </em>lectus feugiat sodales.</strong>")
  })

  it("should add and remove emphasize in selected text across several nodes", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("secondRichParagraph")
      .selectText(8, 22)

      .type("{ctrl+i}")
      .shouldHaveHTML("<strong>Aliquam </strong><em><strong>dapibus, </strong>lorem</em> eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")

      .type("{ctrl+i}")
      .shouldHaveHTML("<strong>Aliquam dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should toggle bold when clicking on bold button", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstRichParagraph")
      .selectText(2, 7)
      .toggleBold()
      .shouldHaveHTML("In<strong>terdu</strong>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should toggle bold when clicking on bold button", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstRichParagraph")
      .selectText(2, 7)
      .toggleItalic()
      .shouldHaveHTML("In<em>terdu</em>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should be possible to create a new link with a text when nothing is selected", () => {
    fullPageFormObject.initialize()
    cy.window().then(($win) => {
      cy.stub($win, "prompt").callsFake((text) => {
        switch (text) {
          case "Link": return "some-link"
          case "Text": return "some-text"
          default: return ""
        }
      })
    })

    fullPageFormObject.getBloc("firstParagraph")
      .moveCursorToOffset(2)
      .toggleLink()
      .shouldHaveHTML(`Th<a href="some-link">some-text</a>is is some text.`)
  })

  it("should be possible to create a new link surrounding the selection", () => {
    fullPageFormObject.initialize()
    cy.window().then(($win) => {
      cy.stub($win, "prompt").callsFake((text) => {
        switch (text) {
          case "Link": return "some-link"
          case "Text": return "some-text"
          default: return ""
        }
      })
    })
    fullPageFormObject.getBloc("firstRichParagraph")
      .selectText(22, 35)
      .toggleLink()
      .shouldHaveHTML(`Interdum et malesuada <a href="some-link">fames ac <strong>ante</strong></a><strong> ipsum</strong> primis in faucibus`)
  })
})
