import { firstParagraph, firstRichParagraph } from "./common"

describe("TextEdit typing", () => {
  function initialize() {
    cy.visit("http://localhost:3000/tests/PageFormTest")
  }

  it("should update accordingly to user writing", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("Added text")
    cy.get(firstParagraph).should("have.text", "This is some text.Added text")
  })

  it("should update accordingly to user writing in bold component", () => {
    initialize()
    cy.get(`${firstRichParagraph} > strong:first-of-type`).click()
    cy.get(firstRichParagraph).type("Added text")
    cy.get(firstRichParagraph).should("have.text", "Interdum et malesuada fames ac ante ipsumAdded text primis in faucibus")
  })
})