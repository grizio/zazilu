/// <reference path="../../../../support/index.d.ts" />
import { ImgBlocObject, MeetBlocObject, MeetsBlocObject, PageFormObject, TextBlocObject } from "./PageFormObject"

export const fullPageFormObject = new PageFormObject("initialPage", {
  title1: new TextBlocObject("s6eTVUS5LZ6O3K3FQlPB"),
  title2: new TextBlocObject("BixY2XQDgIVUx3A6Gzeg"),
  title12: new TextBlocObject("f9BUGtwwdOMuGL2H6A0I"),
  firstParagraph: new TextBlocObject("wCE6PHWsQAcsyM8On2wz"),
  secondParagraph: new TextBlocObject("KkDrx6vdtWZBNMV7SpOK"),
  thirdParagraph: new TextBlocObject("HdVEMtWlRqytL7YHz7rt"),
  fourthParagraph: new TextBlocObject("h409p9NGTYsdQntU8lZO"),
  fifthParagraph: new TextBlocObject("ZP5qjnTIdlTirqySjcsV"),
  firstRichParagraph: new TextBlocObject("nUPMs4xi8RgJXDoCTJGY"),
  secondRichParagraph: new TextBlocObject("7iGFyeZlNddiRpqX3FbN"),
  thirdRichParagraph: new TextBlocObject("n9tAhhR0lup1StIFKCnE"),
  firstMeet: new MeetBlocObject("hBZZT83U4fvFaZq2I1wo"),
  firstMeets: new MeetsBlocObject("CHK4tT7mOwSyQ9i6XFrU"),
  firstImage: new ImgBlocObject("VGa2gwdqZZ4GjIQv9gLx"),
})

export const pageEndingWithParagraph = new PageFormObject("pageEndingWithParagraph", {
  lastParagraph: new TextBlocObject("wCE6PHWsQAcsyM8On2wz")
})

export const pageEndingWithTitle = new PageFormObject("pageEndingWithTitle", {
  lastTitle: new TextBlocObject("s6eTVUS5LZ6O3K3FQlPB")
})

export const pageEndingWithMeet = new PageFormObject("pageEndingWithMeet", {
  lastMeet: new TextBlocObject("hBZZT83U4fvFaZq2I1wo")
})

export const pageEndingWithEmptyParagraph = new PageFormObject("pageEndingWithEmptyParagraph", {
  lastParagraph: new TextBlocObject("wCE6PHWsQAcsyM8On2wz")
})