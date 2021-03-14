import { Bloc } from "~/model/Page"
import { allPages } from "~/routes/tests/PageFormTest"
import { repeat } from "~/utils/strings"

export class BlocObject {
  protected readonly dataTestId: string

  constructor(dataTestId: string) {
    this.dataTestId = dataTestId
  }

  transformIntoTypeThroughMenu = (targetType: Bloc["type"]): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).trigger("mouseenter")
    cy.get("[data-test-id=menuButton]").click()
    cy.get(`[data-test-id=menuItem-${targetType}]`).click()
    return this
  }

  private static beSatisfactions: Record<Bloc["type"], string> = {
    "p": "p",
    "h1": "h1",
    "h2": "h2",
    "h3": "h3",
    "h4": "h4",
    "h5": "h5",
    "h6": "h6",
    "meet": ".meet",
    "img": "figure"
  }

  shouldBeA = (type: Bloc["type"]): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).should("satisfy", _ => _.is(BlocObject.beSatisfactions[type]))
    return this
  }

  asText = (): TextBlocObject => {
    cy.get(`[data-test-id=${this.dataTestId}]`)
      .should("satisfy", _ =>
        ["p", "h1", "h2", "h3", "h4", "h5", "h6"].some(nodeName => _.is(nodeName))
      )
    return new TextBlocObject(this.dataTestId)
  }

  asMeet = (): MeetBlocObject => {
    this.shouldBeA("meet")
    return new MeetBlocObject(this.dataTestId)
  }

  asImg = (): ImgBlocObject => {
    this.shouldBeA("img")
    return new ImgBlocObject(this.dataTestId)
  }

  get = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get(`[data-test-id=${this.dataTestId}]`)
  }
}

export class TextBlocObject extends BlocObject {
  constructor(dataTestId: string) {
    super(dataTestId)
  }

  moveCursorToOffset = (offset: number): this => {
    return this.moveCursorToStart().moveCursorOnRight(offset)
  }

  moveCursorToStart = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type("{movetostart}")
    return this
  }

  moveCursorToEnd = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type("{movetoend}")
    return this
  }

  moveCursorToHome = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type("{home}")
    return this
  }

  moveCursorOnLeft = (times: number): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type(repeat("{leftarrow}", times))
    return this
  }

  moveCursorOnRight = (times: number): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type(repeat("{rightarrow}", times))
    return this
  }

  moveCursorUp = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type("{uparrow}")
    return this
  }

  moveCursorDown = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type("{downarrow}")
    return this
  }

  selectNextCharacters = (numberOfCharacters: number): this => {
    cy.selectNextCharacters(numberOfCharacters)
    return this
  }

  selectPreviousCharacters = (numberOfCharacters: number): this => {
    cy.selectPreviousCharacters(numberOfCharacters)
    return this
  }

  selectText = (startOffset: number, endOffset: number): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).selectText(startOffset, endOffset)
    return this
  }

  type = (text: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).type(text)
    return this
  }

  typeEnter = (): this => this.type("{enter}")
  typeBackspace = (): this => this.type("{backspace}")
  typeDelete = (): this => this.type("{del}")

  toggleBold = (): this => {
    cy.get("[data-test-id=toolbox-bold]").click()
    return this
  }

  toggleItalic = (): this => {
    cy.get("[data-test-id=toolbox-italic]").click()
    return this
  }

  toggleLink = (): this => {
    cy.get("[data-test-id=toolbox-link]").click()
    return this
  }

  shouldHaveText = (textContent: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).should("have.text", textContent)
    return this
  }

  shouldHaveHTML = (htmlContent: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).should("have.html", htmlContent)
    return this
  }

  shouldExist = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).should("exist")
    return this
  }

  shouldNotExist = (): this => {
    cy.get(`[data-test-id=${this.dataTestId}]`).should("not.exist")
    return this
  }
}

export class MeetBlocObject extends BlocObject {
  constructor(dataTestId: string) {
    super(dataTestId)
  }

  changeDate = (date: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}-editButton]`).click()
    cy.get(`#${this.dataTestId}-date-date`).type(date)
    cy.get(`[data-test-id=${this.dataTestId}-validButton]`).click()
    return this
  }

  changeTime = (time: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}-editButton]`).click()
    cy.get(`#${this.dataTestId}-date-time`).type(time)
    cy.get(`[data-test-id=${this.dataTestId}-validButton]`).click()
    return this
  }

  changeDateTime = (date: string, time: string): this => {
    this.changeDateTimeWithoutValidating(date, time)
    cy.get(`[data-test-id=${this.dataTestId}-validButton]`).click()
    return this
  }

  changeDateTimeWithoutValidating = (date: string, time: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}-editButton]`).click()
    cy.get(`#${this.dataTestId}-date-date`).type(date)
    cy.get(`#${this.dataTestId}-date-time`).type(time)
    return this
  }

  attributeDatetimeOfTimeShouldBe = (expectedDatetime: string): this => {
    cy.get(`[data-test-id=${this.dataTestId}] time`).should("have.attr", "datetime", expectedDatetime)
    return this
  }
}


export class ImgBlocObject extends BlocObject {
  constructor(dataTestId: string) {
    super(dataTestId)
  }
}

// @ts-ignore
export class PageFormObject<InitialBlocs extends Record<string, BlocObject>> {
  private readonly page: keyof typeof allPages
  private readonly initialBlocs: InitialBlocs

  constructor(page: keyof typeof allPages, initialBlocs: InitialBlocs) {
    this.page = page
    this.initialBlocs = initialBlocs
  }

  initialize = (): this => {
    cy.visit(`http://localhost:3000/tests/PageFormTest?q=${this.page}`)
    return this
  }

  getBloc = <Key extends keyof InitialBlocs>(key: Key): InitialBlocs[Key] => {
    return this.initialBlocs[key]
  }

  submit = (): this => {
    cy.get("[data-test-id=pageForm-submit]").click()
    return this
  }
}