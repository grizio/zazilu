import { fullPageFormObject } from "../common"

describe("TextEdit typing", () => {
  it("should update accordingly to user writing", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstParagraph")
      .type("Added text")
      .shouldHaveText("This is some text.Added text")
  })

  it("should update accordingly to user writing in bold component", () => {
    fullPageFormObject.initialize()
    fullPageFormObject.getBloc("firstRichParagraph")
      .moveCursorToOffset(41)
      .type("Added text")
      .shouldHaveText("Interdum et malesuada fames ac ante ipsumAdded text primis in faucibus")
  })
})