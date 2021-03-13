import { initialize } from "./common"

describe("Normalize", () => {
  it("should not automatically add a paragraph at the end of the page on loading when the page already ends with a paragraph", () => {
    initialize("pageEndingWithParagraph")
    cy.get("[data-test-id=wCE6PHWsQAcsyM8On2wz] ~ p[contenteditable=true]").should("not.exist")
  })

  it("should not automatically add a paragraph at the end of the page when on loading when the page ends with a title", () => {
    initialize("pageEndingWithTitle")
    cy.get("[data-test-id=hBZZT83U4fvFaZq2I1wo] ~ p[contenteditable=true]").should("not.exist")
  })

  it("should automatically add a paragraph at the end of the page when on loading when the page ends with a meet", () => {
    initialize("pageEndingWithMeet")
    cy.get("[data-test-id=hBZZT83U4fvFaZq2I1wo] ~ p[contenteditable=true]").should("exist")
  })

  it("should not automatically add a paragraph at the end of the page when transforming the last bloc into a title", () => {
    initialize("pageEndingWithEmptyParagraph")
    cy.get("[data-test-id=wCE6PHWsQAcsyM8On2wz]").type("# ")
    cy.get("[data-test-id=wCE6PHWsQAcsyM8On2wz] ~ p[contenteditable=true]").should("not.exist")
  })

  it("should automatically add a paragraph at the end of the page when transforming the last bloc into a meet", () => {
    initialize("pageEndingWithEmptyParagraph")
    cy.get("[data-test-id=wCE6PHWsQAcsyM8On2wz]").type("/meet ")
    cy.get("[data-test-id=wCE6PHWsQAcsyM8On2wz] ~ p[contenteditable=true]").should("exist")
  })
})