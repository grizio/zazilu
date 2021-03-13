import { Bloc } from "~/model/Page"
import { allPages } from "../../../../../src/routes/tests/PageFormTest"

export function initialize(q: keyof typeof allPages = "initialPage") {
  cy.visit(`http://localhost:3000/tests/PageFormTest?q=${q}`)
}

export const title1 = "[data-test-id=s6eTVUS5LZ6O3K3FQlPB]"
export const title2 = "[data-test-id=BixY2XQDgIVUx3A6Gzeg]"
export const title12 = "[data-test-id=f9BUGtwwdOMuGL2H6A0I]"
export const title12MenuButton = "[data-test-id=f9BUGtwwdOMuGL2H6A0I-menuButton]"
export function title12MenuItem(type: Bloc["type"]) {
  return `[data-test-id=f9BUGtwwdOMuGL2H6A0I-menuItem-${type}]`
}

export const firstParagraph = "[data-test-id=wCE6PHWsQAcsyM8On2wz]"
export const firstParagraphMenuButton = "[data-test-id=wCE6PHWsQAcsyM8On2wz-menuButton]"
export function firstParagraphMenuItem(type: Bloc["type"]) {
  return `[data-test-id=wCE6PHWsQAcsyM8On2wz-menuItem-${type}]`
}
export const secondParagraph = "[data-test-id=KkDrx6vdtWZBNMV7SpOK]"
export const thirdParagraph = "[data-test-id=HdVEMtWlRqytL7YHz7rt]"
export const fourthParagraph = "[data-test-id=h409p9NGTYsdQntU8lZO]"
export const fifthParagraph = "[data-test-id=ZP5qjnTIdlTirqySjcsV]"

export const firstRichParagraph = "[data-test-id=nUPMs4xi8RgJXDoCTJGY]"
export const secondRichParagraph = "[data-test-id=7iGFyeZlNddiRpqX3FbN]"
export const thirdRichParagraph = "[data-test-id=n9tAhhR0lup1StIFKCnE]"

export const firstMeet = "[data-test-id=hBZZT83U4fvFaZq2I1wo]"
export const firstMeetEditButton = "[data-test-id=hBZZT83U4fvFaZq2I1wo-editButton]"
export const firstMeetValidButton = "[data-test-id=hBZZT83U4fvFaZq2I1wo-validButton]"
export const firstMeetInputDate = "#hBZZT83U4fvFaZq2I1wo-date-date"
export const firstMeetInputTime = "#hBZZT83U4fvFaZq2I1wo-date-time"
export const firstMeetMenuButton = "[data-test-id=hBZZT83U4fvFaZq2I1wo-menuButton]"
export function firstMeetMenuItem(type: Bloc["type"]) {
  return `[data-test-id=hBZZT83U4fvFaZq2I1wo-menuItem-${type}]`
}

export const submitButton = "[data-test-id=pageForm-submit]"