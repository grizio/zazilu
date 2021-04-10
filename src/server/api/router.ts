import { RouterBuilder, Router } from "$server/api/RouterBuilder"
import { pageValidation } from "$model/validation/PageValidation"
import { object, string } from "idonttrustlikethat"
import { postLogin, postLoginBody, postLogout } from "./login"
import { deletePage, getAllPages, getPage, postPage, putPage, postAction, actionValidator } from "./page"


export default function buildRouter(): Router {
  return new RouterBuilder()
    .post("/login", postLogin, { body: postLoginBody })
    .post("/logout", postLogout)
    .get("/pages.json", getAllPages)
    .get("/page/:slug.json", getPage, { params: object({ slug: string }) })
    .post("/page/:slug.json", postPage, { params: object({ slug: string }), body: pageValidation })
    .put("/page/:slug.json", putPage, { params: object({ slug: string }), body: pageValidation })
    .delete("/page/:slug.json", deletePage, { params: object({ slug: string }) })
    .post("/page/:slug/action.json", postAction, { params: object({ slug: string }), body: actionValidator })
    .build()
}
