import { Meet, Page } from "../../../../../../$model/Page"
import { fullPageFormObject } from "../common"

describe("MeetEdit dates", () => {
  it("should update the date", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeet").changeDate("2012-12-20")
    fullPageFormObject.getBloc("firstMeet").attributeDatetimeOfTimeShouldBe("2012-12-20T20:30:00.000Z")
  })

  it("should update the time", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeet").changeTime("08:15")
    fullPageFormObject.getBloc("firstMeet").attributeDatetimeOfTimeShouldBe("2021-03-01T07:15:00.000Z")
  })

  it("should save the value in the form", () => {
    fullPageFormObject.initialize()

    let loggedPage: Page
    cy.window().then(($win) => {
      cy.stub($win.console, "log").callsFake(x => loggedPage = x)
    })

    fullPageFormObject.getBloc("firstMeet").changeDateTimeWithoutValidating("2012-12-20", "08:15")
    fullPageFormObject.submit()

    cy.should(() => {
      const meetBloc = loggedPage?.content.find(_ => _.id === "hBZZT83U4fvFaZq2I1wo")
      expect((meetBloc as Meet)?.date?.toISOString()).to.equal("2012-12-20T07:15:00.000Z")
    })
  })
})