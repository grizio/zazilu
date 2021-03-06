import sirv from "sirv"
import express from "express"
import { json } from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import * as sapper from "@sapper/server"
import buildRouter from "./api/router"
import type { Request } from "./api/action"
import { extractUser } from "./api/authentication"

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === "development"

express()
  .use(
    json(),
    cookieParser("changeMe"),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    buildRouter(),
    sapper.middleware({
      // customize the session
      session: async (req, res) => {
        // @ts-ignore
        const appRequest = req as Request
        const user = await extractUser(appRequest)
        if (user !== undefined) {
          return { email: user.email, role: user.role }
        } else {
          return {}
        }
      }
    }),
  )
  .listen(PORT, () => {
    console.log("started")
  })
