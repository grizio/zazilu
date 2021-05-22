import { Meets, Page } from "$model/Page"
import { fullPageFormObject } from "../common"

describe("MeetsEdit dates", () => {
  it("should update the date of the first item", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeets").changeDate(0, "2012-12-20")
    fullPageFormObject.getBloc("firstMeets").attributeDatetimeOfTimeShouldBe(0, "2012-12-20T16:30:00.000Z")
  })

  it("should update the time of the second item", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeets").changeTime(1, "08:15")
    fullPageFormObject.getBloc("firstMeets").attributeDatetimeOfTimeShouldBe(1, "2021-05-23T06:15:00.000Z")
  })

  it("should save the value in the form", () => {
    fullPageFormObject.initialize()

    let loggedPage: Page
    cy.window().then(($win) => {
      cy.stub($win.console, "log").callsFake(x => loggedPage = x)
    })

    fullPageFormObject.getBloc("firstMeets").changeDateTimeWithoutValidating(0, "2012-12-20", "08:15")
    fullPageFormObject.submit()

    cy.should(() => {
      const meetBloc = loggedPage?.content.find(_ => _.id === fullPageFormObject.getBloc("firstMeets").dataTestId)
      console.log(meetBloc)
      expect((meetBloc as Meets)?.meets?.[0]?.date?.toISOString()).to.equal("2012-12-20T07:15:00.000Z")
    })
  })
})