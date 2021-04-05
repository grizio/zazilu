import type { Request, Response } from "@sveltejs/kit"
import type { Validation, Validator } from "idonttrustlikethat"
import type { Context } from "src/hooks"
import { badRequest } from "./responses"

type RouteOptions<Params extends {}> = {
  params?: Validator<Params>
}

type RouteOptionsWithBody<Params extends {}, Body> = RouteOptions<Params> & {
  body?: Validator<Body>
}

export type Action<Params extends {}, Body> = (request: ActionRequest<Params, Body>) => Promise<Response>
export type ActionRequest<Params extends {} = {}, Body = unknown> = {
  request: Request<Context>
  params: Params
  body: Body
}

type Method = "GET" | "POST" | "PUT" | "DELETE"
type Route<Params extends {}, Body> = {
  method: Method
  pattern: RegExp
  keys: Array<string>
  params?: Validator<Params>
  body?: Validator<Body>
  action: Action<Params, Body>
}

export class RouterBuilder {
  private routes: Array<Route<any, any>> = []

  get = <Params>(path: string, action: Action<Params, any>, options: RouteOptions<Params> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "GET", path }, action))
    return this
  }

  post = <Params, Body>(path: string, action: Action<Params, Body>, options: RouteOptionsWithBody<Params, Body> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "POST", path }, action))
    return this
  }

  put = <Params, Body>(path: string, action: Action<Params, Body>, options: RouteOptionsWithBody<Params, Body> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "PUT", path }, action))
    return this
  }

  delete = <Params>(path: string, action: Action<Params, Body>, options: RouteOptions<Params> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "DELETE", path }, action))
    return this
  }

  build = (): Router => {
    return new Router(this.routes)
  }

  private buildRoute<Params, Body>(options: RouteOptionsWithBody<Params, Body> & { method: Method, path: string }, action: Action<Params, Body>): Route<Params, Body> {
    const keyPattern = /:([a-zA-Z]+)/g
    const keys: Array<string> = [...options.path.matchAll(keyPattern)].map(match => match[1])
    const pattern = new RegExp("^" + options.path.replace(keyPattern, "([^/]+?)") + "/?$", "i")
    return {
      method: options.method,
      pattern: pattern,
      keys: keys,
      params: options.params,
      body: options.body,
      action: action
    }
  }
}

export class Router {
  private readonly routes: Array<Route<any, any>>

  constructor(routes: Array<Route<any, any>>) {
    this.routes = routes
  }

  process = (request: Request): Promise<Response> | undefined => {
    for (const route of this.routes) {
      if (request.method === route.method) {
        const result = route.pattern.exec(request.path)
        if (result !== null) {
          return this.processRoute(route, request, result)
        }
      }
    }
    return undefined
  }

  private processRoute = async <Params, Body>(route: Route<Params, Body>, request: Request, pathPatternResult: RegExpExecArray): Promise<Response> => {
    const params = this.extractParams(route, pathPatternResult)

    if (params.ok) {
      const body = this.extractBody(route, request)
      if (body.ok) {
        return route.action({
          request: request,
          params: params.value,
          body: body.value
        })
      } else {
        return badRequest(body.errors)
      }
    } else {
      return badRequest(params.errors)
    }
  }

  private extractParams = <Params extends {}>(route: Route<Params, any>, patternResult: RegExpExecArray): Validation<Params> => {
    if (route.params !== undefined) {
      const params: Record<string, string> = {}
      route.keys.forEach((key, index) => params[key] = patternResult[index + 1])

      return route.params.validate(params)
    } else {
      return { ok: true, value: {} as Params }
    }
  }

  private extractBody = <Body>(route: Route<any, Body>, request: Request): Validation<Body> => {
    if (route.body !== undefined) {
      return route.body.validate(request.body)
    } else {
      return { ok: true, value: undefined as unknown as Body }
    }
  }
}