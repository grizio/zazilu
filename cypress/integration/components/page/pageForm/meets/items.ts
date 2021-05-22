import { Meets, Page } from "$model/Page"
import { fullPageFormObject } from "../common"

describe("MeetsEdit items", () => {
  it("should add an item", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeets").addItem()
    fullPageFormObject.getBloc("firstMeets").itemShouldExist(2)
  })

  it("should remove the first item", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeets").deleteItem(0)
    fullPageFormObject.getBloc("firstMeets").itemShouldNotExist(2)
    fullPageFormObject.getBloc("firstMeets").attributeDatetimeOfTimeShouldBe(0, "2021-05-23T20:00:00.000Z")
  })

  it("should remove the second item", () => {
    fullPageFormObject.initialize()

    fullPageFormObject.getBloc("firstMeets").deleteItem(1)
    fullPageFormObject.getBloc("firstMeets").itemShouldNotExist(2)
    fullPageFormObject.getBloc("firstMeets").attributeDatetimeOfTimeShouldBe(0, "2021-05-22T15:30:00.000Z")
  })
})