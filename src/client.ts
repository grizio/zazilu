import * as sapper from "@sapper/app"

const target = document.querySelector("#sapper")
if (target !== undefined && target !== null) {
  sapper.start({ target })
} else {
  console.error("No #sapper element found")
}
