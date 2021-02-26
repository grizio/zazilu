// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { XRange } from "../../src/utils/dom/Selection"
import { XNode } from "../../src/utils/dom/XNode"

Cypress.Commands.add("selectNextCharacters", { prevSubject: false }, (numberOfCharacters: number) => {
  return cy.document()
    .then($document => {
      const selection = $document.getSelection() ?? undefined
      if (selection !== undefined && selection.rangeCount === 1) {
        const range = selection.getRangeAt(0)
        range.setEnd(range.endContainer, range.endOffset + numberOfCharacters)
      } else {
        console.warn("Multiple ranges, ignoring command")
      }
    })
})

Cypress.Commands.add("selectPreviousCharacters", { prevSubject: false }, (numberOfCharacters: number) => {
  return cy.document()
    .then($document => {
      const selection = $document.getSelection() ?? undefined
      if (selection !== undefined && selection.rangeCount === 1) {
        const range = selection.getRangeAt(0)
        range.setStart(range.endContainer, range.startOffset - numberOfCharacters)
      } else {
        console.warn("Multiple ranges, ignoring command")
      }
    })
})

Cypress.Commands.add("selectText", { prevSubject: "element" }, (element, startOffset, endOffset) => {
  return cy.wrap(element)
    .then($element => {
      // @ts-ignore
      const range = XRange.from(new XNode($element[0]), startOffset, endOffset)
      if (range !== undefined) {
        console.log("replace selection with", range.range.startContainer, range.startOffset, range.range.endContainer, range.range.endOffset)
        cy.document()
          .then($document => {
            const selection = $document.getSelection()
            if (selection !== undefined && selection !== null) {
              selection.removeAllRanges()
              selection.addRange(range.range)
            }
          })
      } else {
        console.warn("Could not create selection")
      }
    })
})