import type { Page, PlainText, Strong } from "../../model/Page"

function text(content: string): PlainText {
  return { type: "text", content }
}

function strong(content: string): Strong {
  return { type: "strong", content: [text(content)] }
}

export const initialPage: Page = {
  "key": "home",
  "title": "Home",
  "content": [
    {
      "id": "s6eTVUS5LZ6O3K3FQlPB",
      "type": "h1",
      "content": [text("Title 1")]
    },
    {
      "id": "BixY2XQDgIVUx3A6Gzeg",
      "type": "h2",
      "content": [text("Title 2")]
    },
    {
      "id": "wCE6PHWsQAcsyM8On2wz",
      "type": "p",
      "content": [text("This is some text.")]
    },
    {
      "id": "KkDrx6vdtWZBNMV7SpOK",
      "type": "p",
      "content": [text("Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")]
    },
    {
      "id": "HdVEMtWlRqytL7YHz7rt",
      "type": "p",
      "content": [text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id finibus mauris. Morbi et porta nisl, vitae efficitur tellus. Etiam id cursus lectus, eu faucibus diam. Suspendisse fermentum magna eu justo elementum sagittis. Donec eget malesuada elit, nec gravida ligula. Aenean ut odio in elit pharetra volutpat. Phasellus finibus leo et ipsum vestibulum, vitae semper ligula venenatis. Mauris quam lectus, aliquam vitae sapien in, imperdiet eleifend dolor. Curabitur pharetra maximus sagittis. Donec dignissim eu nisi sed viverra. Vivamus cursus erat eu ligula auctor, in fringilla libero congue. Maecenas erat nisi, sagittis vitae mi nec, tincidunt hendrerit lectus. Nulla lobortis mollis tristique. Aliquam erat volutpat.")]
    },
    {
      "id": "h409p9NGTYsdQntU8lZO",
      "type": "p",
      "content": [text(" Aliquam erat volutpat. Proin ornare luctus iaculis. Duis ac dolor dui. Fusce non pretium metus, et ullamcorper velit. Maecenas ornare massa in orci varius posuere. Nam sollicitudin ullamcorper pulvinar. In libero magna, pretium quis felis sit amet, aliquam interdum est. Suspendisse pretium magna vitae turpis molestie scelerisque. Curabitur vel neque a sem lacinia fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis eget sapien pulvinar, vestibulum enim id, euismod ipsum. Morbi aliquam vestibulum aliquam. Suspendisse elementum ex at posuere lobortis. Nulla nisl velit, ultricies id sodales vel, bibendum quis nulla. Nulla facilisi.")]
    },
    {
      "id": "ZP5qjnTIdlTirqySjcsV",
      "type": "p",
      "content": [text("Another paragraph")]
    },
    {
      "id": "f9BUGtwwdOMuGL2H6A0I",
      "type": "h1",
      "content": [text("Title 12")]
    },
    {
      "id": "nUPMs4xi8RgJXDoCTJGY",
      "type": "p",
      "content": [text("Interdum et malesuada fames ac "), strong("ante ipsum"), text(" primis in faucibus")]
    },
    {
      "id": "7iGFyeZlNddiRpqX3FbN",
      "type": "p",
      "content": [strong("Aliquam dapibus, "), text("lorem eu molestie volutpat"), strong(", mi massa egestas velit, et dapibus dui est at quam")]
    }
  ]
}