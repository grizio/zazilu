describe("TextEdit", () => {
  function initialize() {
    cy.visit("http://localhost:3000/tests/PageFormTest")
  }

  const firstParagraph = "[data-test-id=wCE6PHWsQAcsyM8On2wz]"
  const secondParagraph = "[data-test-id=KkDrx6vdtWZBNMV7SpOK]"
  const thirdParagraph = "[data-test-id=HdVEMtWlRqytL7YHz7rt]"
  const fourthParagraph = "[data-test-id=h409p9NGTYsdQntU8lZO]"

  it("should update accordingly to user writing", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("Added text")
    cy.get(firstParagraph).should("have.text", "This is some text.Added text")
  })

  it("should correctly move cursor to the left", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}")
    cy.get(firstParagraph).type("modified ")
    cy.get(firstParagraph).should("have.text", "This is some modified text.")
  })

  it("should correctly move cursor to the beginning", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{home}")
    cy.get(firstParagraph).type("Yo! ")
    cy.get(firstParagraph).should("have.text", "Yo! This is some text.")
  })

  it("should correctly move cursor to the right", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{home}")
    cy.get(firstParagraph).type("{rightarrow}{rightarrow}{rightarrow}{rightarrow}")
    cy.get(firstParagraph).type(", this")
    cy.get(firstParagraph).should("have.text", "This, this is some text.")
  })

  it("should correctly move cursor to the bottom, remaining on the bloc when multiline and not on last line", () => {
    initialize()
    cy.get(thirdParagraph).click()
    cy.get(thirdParagraph).type("{movetostart}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}")
    cy.get(thirdParagraph).type("{downarrow}")
    cy.get(thirdParagraph).type("xxx")
    cy.get(thirdParagraph).should("have.text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. xxxEtiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat.")
  })

  it("should correctly move cursor to the bottom, going on the next bloc when one line", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}")
    cy.get(firstParagraph).type("{downarrow}")
    cy.get(secondParagraph).type("xxxx")
    cy.get(secondParagraph).should("have.text", "Class aptent xxxxtaciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly move cursor to the bottom, going on the next bloc when multiline and on last line", () => {
    initialize()
    cy.get(thirdParagraph).click()
    cy.get(thirdParagraph).type("{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}")
    cy.get(thirdParagraph).type("{downarrow}")
    cy.get(fourthParagraph).type("xxx")
    cy.get(fourthParagraph).should("have.text", " Aliqxxxuam erat volutpat. Proin ornare luctus iaculis. Duis ac dolor dui. Fusce non pretium metus, et ullamcorper velit. Maecenas ornare massa in orci varius posuere. Nam sollicitudin ullamcorper pulvinar. In libero magna, pretium quis felis sit amet, aliquam interdum est. Suspendisse pretium magna vitae turpis molestie scelerisque. Curabitur vel neque a sem lacinia fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis eget sapien pulvinar, vestibulum enim id, euismod ipsum. Morbi aliquam vestibulum aliquam. Suspendisse elementum ex at posuere lobortis. Nulla nisl velit, ultricies id sodales vel, bibendum quis nulla. Nulla facilisi.")
  })

  it("should correctly move cursor to the top, remaining on the bloc when multiline and not on first line", () => {
    initialize()
    cy.get(thirdParagraph).click()
    cy.get(thirdParagraph).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}")
    cy.get(thirdParagraph).type("{uparrow}")
    cy.get(thirdParagraph).type("xxx")
    cy.get(thirdParagraph).should("have.text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maexxxcenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat.")
  })

  it("should correctly move cursor to the top, going on the previous bloc when one line", () => {
    initialize()
    cy.get(secondParagraph).click()
    cy.get(secondParagraph).type("{home}{rightarrow}{rightarrow}{rightarrow}")
    cy.get(secondParagraph).type("{uparrow}")
    cy.get(firstParagraph).type("xxxx")
    cy.get(firstParagraph).should("have.text", "Thixxxxs is some text.")
  })

  it("should correctly move cursor to the top, going on the previous bloc when multiline and on first line", () => {
    initialize()
    cy.get(fourthParagraph).click()
    cy.get(fourthParagraph).type("{movetostart}{rightarrow}{rightarrow}")
    cy.get(fourthParagraph).type("{uparrow}")
    cy.get(thirdParagraph).type("xxx")
    cy.get(thirdParagraph).should("have.text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis trxxxistique. Aliquam erat volutpat.")
  })

  it("should correctly add a new paragraph", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{enter}")
    cy.get(`${firstParagraph} + p`).should("be.empty")
    cy.get(`${firstParagraph} + p`).type("A new paragraph!")
    cy.get(`${firstParagraph} + p`).should("have.text", "A new paragraph!")
    cy.get(secondParagraph).should("have.text", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly add a new paragraph with the text on right of cursor", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}")
    cy.get(firstParagraph).type("{enter}")
    cy.get(`${firstParagraph} + p`).should("have.text", "text.")
    cy.get(`${firstParagraph} + p`).type("Changed ")
    cy.get(`${firstParagraph} + p`).should("have.text", "Changed text.")
    cy.get(secondParagraph).should("have.text", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using backspace", () => {
    initialize()
    cy.get(secondParagraph).click()
    cy.get(secondParagraph).type("{movetostart}")
    cy.get(secondParagraph).type("{backspace}")
    cy.get(firstParagraph).should("have.text", "This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    cy.get(secondParagraph).should("not.exist")
    cy.get(firstParagraph).type("xxx")
    cy.get(firstParagraph).should("have.text", "This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })

  it("should correctly merge two paragraphs when using delete", () => {
    initialize()
    cy.get(firstParagraph).click()
    cy.get(firstParagraph).type("{del}")
    cy.get(firstParagraph).should("have.text", "This is some text.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    cy.get(secondParagraph).should("not.exist")
    cy.get(firstParagraph).type("xxx")
    cy.get(firstParagraph).should("have.text", "This is some text.xxxClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
  })
})
