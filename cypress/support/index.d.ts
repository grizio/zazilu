declare namespace Cypress {
  interface cy extends Chainable<undefined> {
    selectNextCharacters(numberOfCharacters: number): Chainable
  }
}