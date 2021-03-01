import type * as express from "express"
import { RouterBuilder } from "~/api/RouterBuilder"
import { postLogin } from "./login"
import { deletePage, getAllPages, getPage, postPage, putPage, postAction } from "./page"


export default function buildRouter(): express.Router {
  return new RouterBuilder()
    .post("/login", postLogin)
    .get("/pages.json", getAllPages)
    .get("/page/:slug.json", getPage)
    .post("/page/:slug.json", postPage)
    .put("/page/:slug.json", putPage)
    .delete("/page/:slug.json", deletePage)
    .post("/page/:slug/action.json", postAction)
    .build()
}
