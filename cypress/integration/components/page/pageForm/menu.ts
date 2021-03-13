import { firstParagraph, firstParagraphMenuButton, firstParagraphMenuItem, initialize, title12, title12MenuButton, title12MenuItem, firstMeetMenuButton, firstMeetMenuItem, firstMeet } from "./common"

describe("Menu", () => {
  it("should transform a paragraph into a h1", () => {
    initialize()
    cy.get(firstParagraphMenuButton).click()
    cy.get(firstParagraphMenuItem("h1")).click()
    cy.get(firstParagraph).should("satisfy", (element) => element.is("h1"))
  })

  it("should transform a h1 into a h5", () => {
    initialize()
    cy.get(title12MenuButton).click()
    cy.get(title12MenuItem("h5")).click()
    cy.get(title12).should("satisfy", (element) => element.is("h5"))
  })

  it("should transform a h1 into a meet", () => {
    initialize()
    cy.get(title12MenuButton).click()
    cy.get(title12MenuItem("meet")).click()
    cy.get(title12).should("satisfy", (element) => element.is(".meet"))
  })

  it("should transform a meet into a h3", () => {
    initialize()
    cy.get(firstMeetMenuButton).click()
    cy.get(firstMeetMenuItem("h3")).click()
    cy.get(firstMeet).should("satisfy", (element) => element.is("h3"))
  })
})