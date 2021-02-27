import { fifthParagraph, firstParagraph, initialize, secondParagraph, title1, title12, title2 } from "./common"

describe("TextEdit splits and merges", () => {
  it("should correctly add a new paragraph", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{enter}")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).should("be.empty")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).type("A new paragraph!")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).should("have.text", "A new paragraph!")
    cy.get(secondParagraph).should("have.text", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly add a new paragraph with the text on right of cursor", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}")
    cy.get(firstParagraph).type("{enter}")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).should("have.text", "text.")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).type("Changed ")
    cy.get(`${firstParagraph} + .toolbox-wrapper + p`).should("have.text", "Changed text.")
    cy.get(secondParagraph).should("have.text", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using backspace", () => {
    initialize()
    cy.get(secondParagraph).click()
    cy.get(secondParagraph).type("{movetostart}")
    cy.get(secondParagraph).type("{backspace}")
    cy.get(firstParagraph).should("have.text", "This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    cy.get(secondParagraph).should("not.exist")
    cy.get(firstParagraph).type("xxx")
    cy.get(firstParagraph).should("have.text", "This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should not merge two paragraphs when using backspace with a non collapsed selection", () => {
    initialize()
    cy.get(secondParagraph).click()
    cy.get(secondParagraph).type("{movetostart}")
    cy.selectNextCharacters(6)
    cy.get(secondParagraph).type("{backspace}")
    cy.get(firstParagraph).should("have.text", "This is some text.")
    cy.get(secondParagraph).should("have.text", "aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should not merge two paragraphs when using delete with a non collapsed selection", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.selectPreviousCharacters(6)
    cy.get(firstParagraph).type("{del}")
    cy.get(firstParagraph).should("have.text", "This is some")
    cy.get(secondParagraph).should("have.text", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using delete", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{del}")
    cy.get(firstParagraph).should("have.text", "This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    cy.get(secondParagraph).should("not.exist")
    cy.get(firstParagraph).type("xxx")
    cy.get(firstParagraph).should("have.text", "This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two titles when using backspace", () => {
    initialize()
    cy.get(title2).click()
    cy.get(title2).type("{movetostart}")
    cy.get(title2).type("{backspace}")
    cy.get(title1).should("have.text", "Title 1Title 2")
    cy.get(title2).should("not.exist")
    cy.get(title1).type("xxx")
    cy.get(title1).should("have.text", "Title 1xxxTitle 2")
  })

  it("should correctly merge two titles when using delete", () => {
    initialize()
    cy.get(title1).click()
    cy.get(title1).type("{del}")
    cy.get(title1).should("have.text", "Title 1Title 2")
    cy.get(title2).should("not.exist")
    cy.get(title1).type("xxx")
    cy.get(title1).should("have.text", "Title 1xxxTitle 2")
  })

  it("should correctly merge a title and a paragraph when using backspace", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{movetostart}")
    cy.get(firstParagraph).type("{backspace}")
    cy.get(title2).should("have.text", "Title 2This is some text.")
    cy.get(firstParagraph).should("not.exist")
    cy.get(title2).type("xxx")
    cy.get(title2).should("have.text", "Title 2xxxThis is some text.")
  })

  it("should correctly merge a title and a paragraph when using delete", () => {
    initialize()
    cy.get(title2).click()
    cy.get(title2).type("{del}")
    cy.get(title2).should("have.text", "Title 2This is some text.")
    cy.get(firstParagraph).should("not.exist")
    cy.get(title2).type("xxx")
    cy.get(title2).should("have.text", "Title 2xxxThis is some text.")
  })

  it("should correctly merge a paragraph and a title when using backspace", () => {
    initialize()
    cy.get(title12).click()
    cy.get(title12).type("{movetostart}")
    cy.get(title12).type("{backspace}")
    cy.get(fifthParagraph).should("have.text", "Another paragraphTitle 12")
    cy.get(title12).should("not.exist")
    cy.get(fifthParagraph).type("xxx")
    cy.get(fifthParagraph).should("have.text", "Another paragraphxxxTitle 12")
  })

  it("should correctly merge a paragraph and a title when using delete", () => {
    initialize()
    cy.get(fifthParagraph).click()
    cy.get(fifthParagraph).type("{del}")
    cy.get(fifthParagraph).should("have.text", "Another paragraphTitle 12")
    cy.get(title12).should("not.exist")
    cy.get(fifthParagraph).type("xxx")
    cy.get(fifthParagraph).should("have.text", "Another paragraphxxxTitle 12")
  })
})