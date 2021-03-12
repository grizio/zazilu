import { firstMeet, firstMeetEditButton, firstMeetValidButton, firstMeetInputDate, firstMeetInputTime, initialize, submitButton } from "../common"
import { Meet, Page } from "../../../../../../src/model/Page"

describe("MeetEdit dates", () => {
  it("should toggle date and form", () => {
    initialize()

    cy.get(firstMeetEditButton).click()
    cy.get(firstMeetInputDate).should("exist")
    cy.get(firstMeetValidButton).click()
    cy.get(firstMeetInputDate).should("not.exist")
  })

  it("should update the date", () => {
    initialize()

    cy.get(firstMeetEditButton).click()
    cy.get(firstMeetInputDate).type("2012-12-20")
    cy.get(firstMeetValidButton).click()

    cy.get(`${firstMeet} time`).should("have.attr", "datetime", "2012-12-20T20:30:00.000Z")
  })

  it("should update the time", () => {
    initialize()

    cy.get(firstMeetEditButton).click()
    cy.get(firstMeetInputTime).type("08:15")
    cy.get(firstMeetValidButton).click()

    cy.get(`${firstMeet} time`).should("have.attr", "datetime", "2021-03-01T07:15:00.000Z")
  })

  it("should save the value in the form", () => {
    initialize()

    let loggedPage: Page
    cy.window().then(($win) => {
      cy.stub($win.console, "log", x => loggedPage = x)
    })

    cy.get(firstMeetEditButton).click()
    cy.get(firstMeetInputDate).type("2012-12-20")
    cy.get(firstMeetInputTime).type("08:15")
    cy.get(submitButton).click()

    cy.should(() => {
      const meetBloc = loggedPage?.content.find(_ => _.id === "hBZZT83U4fvFaZq2I1wo")
      expect((meetBloc as Meet)?.date?.toISOString()).to.equal("2012-12-20T07:15:00.000Z")
    })
  })
})