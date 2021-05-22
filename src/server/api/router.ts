import { object, string } from "idonttrustlikethat"
import { RouterBuilder, Router } from "$server/api/RouterBuilder"
import { pageActionValidator } from "$server/service/PageActionService"
import { pageValidation } from "$model/validation/PageValidation"
import { LoginController } from "./LoginController"
import type { PageController } from "./PageController"


type Dependencies = {
  loginController: LoginController
  pageController: PageController
}
export default function buildRouter({ loginController, pageController }: Dependencies): Router {
  return new RouterBuilder()
    .post("/login", loginController.login, { body: LoginController.loginBody })
    .post("/logout", loginController.logout)
    .get("/pages.json", pageController.getAllPages)
    .get("/page/:slug.json", pageController.getPage, { params: object({ slug: string }) })
    .post("/page/:slug.json", pageController.postPage, { params: object({ slug: string }), body: pageValidation })
    .put("/page/:slug.json", pageController.putPage, { params: object({ slug: string }), body: pageValidation })
    .delete("/page/:slug.json", pageController.deletePage, { params: object({ slug: string }) })
    .post("/page/:slug/action.json", pageController.postAction, { params: object({ slug: string }), body: pageActionValidator })
    .build()
}
