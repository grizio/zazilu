import type { Bloc } from "~/model/Page"
import { fullPageFormObject } from "./common"

import { BlocObject } from "./PageFormObject"

type TestCase = {
  sourceType: Bloc["type"],
  targetType: Bloc["type"],
  sourceObject: BlocObject,
  otherAssertions?: () => any
}

describe("Menu", () => {
  const cases: Array<TestCase> = [
    { sourceType: "p", targetType: "h1", sourceObject: fullPageFormObject.getBloc("firstParagraph") },
    { sourceType: "h1", targetType: "h5", sourceObject: fullPageFormObject.getBloc("title12") },
    { sourceType: "h1", targetType: "meet", sourceObject: fullPageFormObject.getBloc("title12") },
    { sourceType: "p", targetType: "img", sourceObject: fullPageFormObject.getBloc("firstParagraph") },
    { sourceType: "meet", targetType: "h2", sourceObject: fullPageFormObject.getBloc("firstMeet") },
    { sourceType: "meet", targetType: "img", sourceObject: fullPageFormObject.getBloc("firstMeet") },
    { sourceType: "img", targetType: "p", sourceObject: fullPageFormObject.getBloc("firstImage") },
    { sourceType: "img", targetType: "meet", sourceObject: fullPageFormObject.getBloc("firstMeet") },
  ]

  cases.forEach(testCase => {
    it(`should transform a ${testCase.sourceType} into a ${testCase.targetType}`, () => {
      fullPageFormObject.initialize()
      testCase.sourceObject.transformIntoTypeThroughMenu(testCase.targetType)
      testCase.sourceObject.shouldBeA(testCase.targetType)
      if (testCase.otherAssertions !== undefined) {
        testCase.otherAssertions()
      }
    })
  })
})