import type { Validation, Validator } from "idonttrustlikethat"
import type { Request, Response } from "@sveltejs/kit"
import type { User } from "$model/User"
import { badRequest } from "./responses"

type RouteOptions<Params extends {}, Query extends {}> = {
  params?: Validator<Params>
  query?: Validator<Query>
}

type RouteOptionsWithBody<Params extends {}, Query extends {}, Body> = RouteOptions<Params, Query> & {
  body?: Validator<Body>
}

export type Locals = {
  authenticatedUser?: User
}
export type Action<Params extends {}, Query extends {}, Body> = (request: ActionRequest<Params, Query, Body>) => Promise<Response>
export type ActionRequest<Params extends {} = {}, Query extends {} = {}, Body = unknown> = {
  request: Request<Locals, Body>
  params: Params
  query: Query
  body: Body
}

type Method = "GET" | "POST" | "PUT" | "DELETE"
type Route<Params extends {}, Query extends {}, Body> = {
  method: Method
  pattern: RegExp
  keys: Array<string>
  params?: Validator<Params>
  query?: Validator<Query>
  body?: Validator<Body>
  action: Action<Params, Query, Body>
}

export class RouterBuilder {
  private routes: Array<Route<any, any, any>> = []

  get = <Params, Query>(path: string, action: Action<Params, Query, any>, options: RouteOptions<Params, Query> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "GET", path }, action))
    return this
  }

  post = <Params, Query, Body>(path: string, action: Action<Params, Query, Body>, options: RouteOptionsWithBody<Params, Query, Body> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "POST", path }, action))
    return this
  }

  put = <Params, Query, Body>(path: string, action: Action<Params, Query, Body>, options: RouteOptionsWithBody<Params, Query, Body> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "PUT", path }, action))
    return this
  }

  delete = <Params, Query>(path: string, action: Action<Params, Query, Body>, options: RouteOptions<Params, Query> = {}): this => {
    this.routes.push(this.buildRoute({ ...options, method: "DELETE", path }, action))
    return this
  }

  build = (): Router => {
    return new Router(this.routes)
  }

  private buildRoute<Params, Query, Body>(options: RouteOptionsWithBody<Params, Query, Body> & { method: Method, path: string }, action: Action<Params, Query, Body>): Route<Params, Query, Body> {
    const keyPattern = /:([a-zA-Z]+)/g
    const keys: Array<string> = [...options.path.matchAll(keyPattern)].map(match => match[1])
    const pattern = new RegExp("^" + options.path.replace(keyPattern, "([^/]+?)") + "/?$", "i")
    return {
      method: options.method,
      pattern: pattern,
      keys: keys,
      params: options.params,
      query: options.query,
      body: options.body,
      action: action
    }
  }
}

export class Router {
  private readonly routes: Array<Route<any, any, any>>

  constructor(routes: Array<Route<any, any, any>>) {
    this.routes = routes
  }

  process = (request: Request<Locals>): Promise<Response> | undefined => {
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

  private processRoute = async <Params, Query, Body>(route: Route<Params, Query, Body>, request: Request<Locals, Body>, pathPatternResult: RegExpExecArray): Promise<Response> => {
    const params = this.extractParams(route, pathPatternResult)
    const query = this.extractQuery(route, request)

    if (!params.ok) {
      return badRequest(params.errors)
    } else if (!query.ok) {
      return badRequest(query.errors)
    } else {
      const body = this.extractBody(route, request)
      if (!body.ok) {
        return badRequest(body.errors)
      } else {
        return route.action({
          request: request,
          params: params.value,
          query: query.value,
          body: body.value,
        })
      }
    }
  }

  private extractParams = <Params extends {}>(route: Route<Params, any, any>, patternResult: RegExpExecArray): Validation<Params> => {
    if (route.params !== undefined) {
      const params: Record<string, string> = {}
      route.keys.forEach((key, index) => params[key] = decodeURIComponent(patternResult[index + 1]))

      return route.params.validate(params)
    } else {
      return { ok: true, value: {} as Params }
    }
  }

  private extractQuery = <Query extends {}>(route: Route<any, Query, any>, request: Request): Validation<Query> => {
    if (route.query !== undefined) {
      const query: Record<string, string> = {}
      request.query.forEach((value, key) => query[key] = value)

      return route.query.validate(query)
    } else {
      return { ok: true, value: {} as Query }
    }
  }

  private extractBody = <Body>(route: Route<any, any, Body>, request: Request): Validation<Body> => {
    if (route.body !== undefined) {
      return route.body.validate(request.body)
    } else {
      return { ok: true, value: undefined as unknown as Body }
    }
  }
}