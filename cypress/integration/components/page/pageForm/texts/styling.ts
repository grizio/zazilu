import { firstParagraph, firstRichParagraph, initialize, secondRichParagraph, thirdRichParagraph } from "../common"

describe("TextEdit styling", () => {
  it("should put selected text in strong when not already strong", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get(firstRichParagraph).type("{ctrl+b}")
    cy.get(firstRichParagraph).should("have.html", "In<strong>terdu</strong>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should remove selected text from strong when all already strong", () => {
    initialize()
    cy.get(secondRichParagraph).click()
    cy.get(secondRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get(secondRichParagraph).type("{ctrl+b}")
    cy.get(secondRichParagraph).should("have.html", "<strong>Al</strong>iquam<strong> dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should remove selected text from strong when some part already strong", () => {
    initialize()
    // case: te[xt - strong - te]xt
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).selectText(27, 51)
    cy.get(firstRichParagraph).type("{ctrl+b}")
    cy.get(firstRichParagraph).should("have.html", "Interdum et malesuada fames ac ante ipsum primis in faucibus")
    cy.get(`${firstRichParagraph} > strong`).should("not.exist")

    // case: str[ong - te]xt
    cy.get(secondRichParagraph).click()
    cy.get(secondRichParagraph).selectText(7, 22)
    cy.get(secondRichParagraph).type("{ctrl+b}")
    cy.get(secondRichParagraph).should("have.html", "<strong>Aliquam</strong> dapibus, lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should keep the selection when making text strong", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get(firstRichParagraph).type("{ctrl+b}")
    cy.get(firstRichParagraph).type("xxx")
    cy.get(firstRichParagraph).should("have.html", "Inxxxm et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should keep the selection when removing the strong on text", () => {
    initialize()
    cy.get(secondRichParagraph).click()
    cy.get(secondRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get(secondRichParagraph).type("{ctrl+b}")
    cy.get(secondRichParagraph).type("xxx")
    cy.get(secondRichParagraph).should("have.html", "<strong>Alxxx dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should put selected text in emphasis when not already emphasized", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).selectText(22, 35)
    cy.get(firstRichParagraph).type("{ctrl+i}")
    cy.get(firstRichParagraph).should("have.html", "Interdum et malesuada <em>fames ac <strong>ante</strong></em><strong> ipsum</strong> primis in faucibus")
  })

  it("should put selected strong text in emphasis when not already emphasized", () => {
    initialize()
    cy.get(secondRichParagraph).click()
    cy.get(secondRichParagraph).selectText(8, 15)
    cy.get(secondRichParagraph).type("{ctrl+i}")
    cy.get(secondRichParagraph).should("have.html", "<strong>Aliquam <em>dapibus</em>, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should remove emphasize in selected text in emphasis when already emphasized", () => {
    initialize()
    cy.get(thirdRichParagraph).click()
    cy.get(thirdRichParagraph).selectText(24, 30)
    cy.get(thirdRichParagraph).type("{ctrl+i}")
    cy.get(thirdRichParagraph).should("have.html", "<strong>Nulla condimentum <em>vitae </em>lectus feugiat sodales.</strong>")
  })

  it("should add and remove emphasize in selected text across several nodes", () => {
    initialize()
    cy.get(secondRichParagraph).click()
    cy.get(secondRichParagraph).selectText(8, 22)

    cy.get(secondRichParagraph).type("{ctrl+i}")
    cy.get(secondRichParagraph).should("have.html", "<strong>Aliquam </strong><em><strong>dapibus, </strong>lorem</em> eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")

    cy.get(secondRichParagraph).type("{ctrl+i}")
    cy.get(secondRichParagraph).should("have.html", "<strong>Aliquam dapibus, </strong>lorem eu molestie volutpat<strong>, mi massa egestas velit, et dapibus dui est at quam</strong>")
  })

  it("should toggle bold when clicking on bold button", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get("[data-test-id=toolbox-bold]").click()
    cy.get(firstRichParagraph).should("have.html", "In<strong>terdu</strong>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should toggle bold when clicking on bold button", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.selectNextCharacters(5)
    cy.get("[data-test-id=toolbox-italic]").click()
    cy.get(firstRichParagraph).should("have.html", "In<em>terdu</em>m et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
  })

  it("should be possible to create a new link with a text when nothing is selected", () => {
    initialize()
    cy.window().then(($win) => {
      cy.stub($win, "prompt", (text) => {
        switch (text) {
          case "Link": return "some-link"
          case "Text": return "some-text"
          default: return ""
        }
      })
    })
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.get("[data-test-id=toolbox-link]").click()
    cy.get(firstParagraph).should("have.html", `Th<a href="some-link">some-text</a>is is some text.`)
  })

  it("should be possible to create a new link surrounding the selection", () => {
    initialize()
    cy.window().then(($win) => {
      cy.stub($win, "prompt", (text) => {
        switch (text) {
          case "Link": return "some-link"
          case "Text": return "some-text"
          default: return ""
        }
      })
    })
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).selectText(22, 35)
    cy.get("[data-test-id=toolbox-link]").click()
    cy.get(firstRichParagraph).should("have.html", `Interdum et malesuada <a href="some-link">fames ac <strong>ante</strong></a><strong> ipsum</strong> primis in faucibus`)
  })
})
