import type { Request, Response } from "express"

type DefaultParams = {}
type DefaultBody = unknown
type DefaultQuery = {}

export type AppRequest<Params = DefaultParams, Body = DefaultBody, Query = DefaultQuery> =
  Request<Params, any, Body, Query>
  & { signedCookies?: Record<string, string> }

export type GetRequest<Params = DefaultParams, Query = DefaultQuery> = AppRequest<Params, DefaultBody, Query>
export type PostRequest<Params = DefaultParams, Body = DefaultBody, Query = DefaultQuery> = AppRequest<Params, Body, Query>
export type PutRequest<Params = DefaultParams, Body = DefaultBody, Query = DefaultQuery> = AppRequest<Params, Body, Query>
export type DeleteRequest<Params = DefaultParams, Query = DefaultQuery> = AppRequest<Params, DefaultBody, Query>

export type AppResponse = Response

type Options = {
  cookies?: Record<string, string | null>
}
export function ok(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function created(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function noContent(res: AppResponse, options: Options = {}): void {
  processResponse(res, {
    status: 204,
    headers: { "Content-Type": "application/json" },
    ...options
  })
}

export function badRequest(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 400,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function unauthenticated(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function forbidden(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 403,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function notFound(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

export function conflict(res: AppResponse, value: any, options: Options = {}): void {
  processResponse(res, {
    status: 409,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    ...options
  })
}

type ProcessResponseParameters = Options & {
  status: number
  headers: Record<string, string>
  body?: string
}
function processResponse(res: AppResponse, {status, headers, cookies, body }: ProcessResponseParameters): void {
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
}