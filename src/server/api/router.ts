import { object, string } from "idonttrustlikethat"
import { RouterBuilder, Router } from "$server/api/RouterBuilder"
import { pageActionValidator } from "$server/service/PageActionService"
import { pageValidation } from "$model/validation/PageValidation"
import { LoginController } from "./LoginController"
import type { PageController } from "./PageController"
import { ImageController } from "./ImageController"
import { nonEmptyString } from "$lib/utils/validators"


type Dependencies = {
  loginController: LoginController
  pageController: PageController
  imageController: ImageController
}
export default function buildRouter({ loginController, pageController, imageController }: Dependencies): Router {
  return new RouterBuilder()
    .post("/login", loginController.login, { body: LoginController.loginBody })
    .post("/logout", loginController.logout)

    .get("/pages.json", pageController.getAllPages)
    .get("/page/:slug.json", pageController.getPage, { params: object({ slug: string }) })
    .post("/page/:slug.json", pageController.postPage, { params: object({ slug: string }), body: pageValidation })
    .put("/page/:slug.json", pageController.putPage, { params: object({ slug: string }), body: pageValidation })
    .delete("/page/:slug.json", pageController.deletePage, { params: object({ slug: string }) })
    .post("/page/:slug/action.json", pageController.postAction, { params: object({ slug: string }), body: pageActionValidator })

    .get("/images", imageController.search, { query: ImageController.searchQuery })
    .post("/image", imageController.upload, { query: object({ filename: nonEmptyString, contentType: nonEmptyString }), body: nonEmptyString })
    .get("/image/:key", imageController.get, { params: object({ key: string }) })
    .post("/image/:key/rename", imageController.rename, { params: object({ key: nonEmptyString }), body: object({ filename: nonEmptyString }) })

    .build()
}
