declare namespace Cypress {
  interface cy extends Chainable<undefined> {
    selectNextCharacters(numberOfCharacters: number): Chainable
    selectPreviousCharacters(numberOfCharacters: number): Chainable
  }

  interface Chainable<Subject = any> {
    selectText(startOffset: number, endOffset: number): Chainable<Subject>
  }
}