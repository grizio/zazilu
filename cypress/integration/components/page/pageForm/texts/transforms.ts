import { firstParagraph, firstRichParagraph, initialize, title1, title2 } from "./common"

describe("TextEdit transforms", () => {
  it("should transform a paragraph into a h1", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{movetostart}")
    cy.get(firstParagraph).type("# ")
    cy.get(`h1${firstParagraph}`).should("have.text", "This is some text.")
    cy.get(`p${firstParagraph}`).should("not.exist")
  })

  it("should transform a paragraph into a h2", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{movetostart}")
    cy.get(firstParagraph).type("## ")
    cy.get(`h2${firstParagraph}`).should("have.text", "This is some text.")
    cy.get(`p${firstParagraph}`).should("not.exist")
  })

  it("should transform a h1 into a h3", () => {
    initialize()
    cy.get(title1).click()
    cy.get(title1).type("{movetostart}")
    cy.get(title1).type("### ")
    cy.get(`h3${title1}`).should("have.text", "Title 1")
    cy.get(`h1${title1}`).should("not.exist")
  })

  it("should transform a h1 into a h4", () => {
    initialize()
    cy.get(title1).click()
    cy.get(title1).type("{movetostart}")
    cy.get(title1).type("#### ")
    cy.get(`h4${title1}`).should("have.text", "Title 1")
    cy.get(`h1${title1}`).should("not.exist")
  })

  it("should transform a h2 into a h5", () => {
    initialize()
    cy.get(title2).click()
    cy.get(title2).type("{movetostart}")
    cy.get(title2).type("##### ")
    cy.get(`h5${title2}`).should("have.text", "Title 2")
    cy.get(`h2${title2}`).should("not.exist")
  })

  it("should transform a h2 into a h6", () => {
    initialize()
    cy.get(title2).click()
    cy.get(title2).type("{movetostart}")
    cy.get(title2).type("###### ")
    cy.get(`h6${title2}`).should("have.text", "Title 2")
    cy.get(`h2${title2}`).should("not.exist")
  })

  it("should transform a h2 into a paragraph", () => {
    initialize()
    cy.get(title2).click()
    cy.get(title2).type("{movetostart}")
    cy.get(title2).type("!# ")
    cy.get(`p${title2}`).should("have.text", "Title 2")
    cy.get(`h2${title2}`).should("not.exist")
  })

  it("should transform a rich paragraph into a h1", () => {
    initialize()
    cy.get(firstRichParagraph).click()
    cy.get(firstRichParagraph).type("{movetostart}")
    cy.get(firstRichParagraph).type("# ")
    cy.get(`h1${firstRichParagraph}`).should("have.html", "Interdum et malesuada fames ac <strong>ante ipsum</strong> primis in faucibus")
    cy.get(`p${firstRichParagraph}`).should("not.exist")
  })
})