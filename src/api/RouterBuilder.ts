import * as express from "express"
import type { Action } from "~/api/action"

export class RouterBuilder {
  private router: express.Router

  constructor() {
    this.router = express.Router()
  }

  get = (path: string, action: Action): this => {
    this.router.get(path, this.buildActionFunction(action))
    return this
  }

  post = (path: string, action: Action): this => {
    this.router.post(path, this.buildActionFunction(action))
    return this
  }

  put = (path: string, action: Action): this => {
    this.router.put(path, this.buildActionFunction(action))
    return this
  }

  delete = (path: string, action: Action): this => {
    this.router.delete(path, this.buildActionFunction(action))
    return this
  }

  private buildActionFunction = (action: Action): (req: express.Request, res: express.Response, next: () => void) => void => {
    return (req, res) => {
      action(req)
        .then(({ status, headers, body, cookies }) => {
          if (cookies !== undefined) {
            Object.keys(cookies)
              .forEach(key => {
                const cookieValue = cookies[key]
                if (cookieValue !== null) {
                  res.cookie(key, cookieValue, { signed: true })
                } else {
                  res.clearCookie(key)
                }
              })
          }
          res.writeHead(status, headers)

          res.end(body)
        })
    }
  }

  build = (): express.Router => this.router
}