import { fullPageFormObject} from "../common"

describe("TextEdit moves", () => {
  it("should correctly move cursor to the left", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorOnLeft(5)
      .type("modified ")
      .shouldHaveText("This is some modified text.")
  })

  it("should correctly move cursor to the left in bold component", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstRichParagraph")
      .moveCursorOnLeft(20)
      .type("xxx")
      .shouldHaveText("Interdum et malesuada fames ac ante ipsuxxxm primis in faucibus")
  })

  it("should correctly move cursor to the beginning", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorToStart()
      .type("Yo! ")
      .shouldHaveText("Yo! This is some text.")
  })

  it("should correctly move cursor to the right", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorToHome()
      .moveCursorOnRight(4)
      .type(", this")
      .shouldHaveText("This, this is some text.")
  })

  it("should correctly move cursor to the bottom, remaining on the bloc when multiline and not on last line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("thirdParagraph")
      .moveCursorToOffset(5)
      .moveCursorDown()
      .type("xxx")
      .shouldHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspexxxndisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat.")
  })

  it("should correctly move cursor to the bottom, going on the next bloc when one line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstParagraph")
      .moveCursorOnLeft(5)
      .moveCursorDown()
    fullPageFormObject.getBloc("secondParagraph")
      .type("xxxx")
      .shouldHaveText("Class aptent xxxxtaciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly move cursor to the bottom, going on the next bloc when one line when having bold parts", () => {
    fullPageFormObject
      .initialize()
      .getBloc("firstRichParagraph")
      .moveCursorToOffset(36)
      .moveCursorDown()
    fullPageFormObject.getBloc("secondRichParagraph")
      .type("xxx")
      .shouldHaveText("Aliquam dapibus, lorem eu molestie voxxxlutpat, mi massa egestas velit, et dapibus dui est at quam")
  })

  it("should correctly move cursor to the bottom, going on the next bloc when multiline and on last line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("thirdParagraph")
      .moveCursorToHome()
      .moveCursorOnRight(5)
      .moveCursorDown()
    fullPageFormObject
      .getBloc("fourthParagraph")
      .type("xxx")
      .shouldHaveText(" Aliquxxxam erat volutpat. Proin ornare luctus iaculis. Duis ac dolor dui. Fusce non pretium metus, et ullamcorper velit. Maecenas ornare massa in orci varius posuere. Nam sollicitudin ullamcorper pulvinar. In libero magna, pretium quis felis sit amet, aliquam interdum est. Suspendisse pretium magna vitae turpis molestie scelerisque. Curabitur vel neque a sem lacinia fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis eget sapien pulvinar, vestibulum enim id, euismod ipsum. Morbi aliquam vestibulum aliquam. Suspendisse elementum ex at posuere lobortis. Nulla nisl velit, ultricies id sodales vel, bibendum quis nulla. Nulla facilisi.")
  })

  it("should correctly move cursor to the top, remaining on the bloc when multiline and not on first line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("thirdParagraph")
      .moveCursorOnLeft(5)
      .moveCursorUp()
      .type("xxx")
      .shouldHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus curxxxsus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat.")
  })

  it("should correctly move cursor to the top, going on the previous bloc when one line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("secondParagraph")
      .moveCursorToHome()
      .moveCursorOnRight(3)
      .moveCursorUp()
    fullPageFormObject.getBloc("firstParagraph")
      .type("xxxx")
      .shouldHaveText("Thixxxxs is some text.")
  })

  it("should correctly move cursor to the top, going on the previous bloc when one line when having bold parts", () => {
    fullPageFormObject
      .initialize()
      .getBloc("secondRichParagraph")
      .moveCursorToOffset(48)
      .moveCursorUp()
    fullPageFormObject
      .getBloc("firstRichParagraph")
      .type("xxx")
      .shouldHaveText("Interdum et malesuada fames ac ante ipsum primxxxis in faucibus")
  })

  it("should correctly move cursor to the top, going on the previous bloc when multiline and on first line", () => {
    fullPageFormObject
      .initialize()
      .getBloc("fourthParagraph")
      .moveCursorToOffset(2)
      .moveCursorUp()
    fullPageFormObject.getBloc("thirdParagraph")
      .type("xxx")
      .shouldHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla loxxxbortis mollis tristique. Aliquam erat volutpat.")
  })
})