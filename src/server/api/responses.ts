import { signCookie } from "$lib/utils/crypto"
import { removeUndefinedKeys } from "$lib/utils/objects"
import type { Response } from "@sveltejs/kit"

type Options = {
  headers?: Record<string, string | undefined>
  cookies?: Record<string, string | null>
}
export function ok(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 200,
    body
  })
}

export function created(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 201,
    body
  })
}

export function noContent(options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 204,
    body: undefined
  })
}

export function badRequest(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 400,
    body
  })
}

export function unauthenticated(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 401,
    body
  })
}

export function forbidden(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 403,
    body
  })
}

export function notFound(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 404,
    body
  })
}

export function conflict(body: any, options: Options = {}): Response {
  return buildResponse({
    ...options,
    status: 409,
    body
  })
}

type BuildResponseOptions = Options & {
  status: number
  body: any | undefined
}
function buildResponse({ status, headers, cookies, body }: BuildResponseOptions): Response {
  return {
    status: status,
    headers: {
      "Content-Type": "application/json",
      // @ts-ignore cf. comment in svelte-kit code
      "Set-Cookie": buildSetCookieHeader(cookies),
      ...(removeUndefinedKeys(headers ?? {}))
    },
    body: serializeBody(body)
  }
}

function serializeBody(body: any | undefined) {
  if (body === undefined) {
    return undefined
  } else if (body instanceof Buffer) {
    return body
  } else {
    return JSON.stringify(body)
  }
}

function buildSetCookieHeader(cookies: Record<string, string | null> | undefined): Array<string> {
  if (cookies !== undefined) {
    return Object.keys(cookies).map(key => {
      const value = cookies[key]
      if (value === null) {
        return `${key}=; Max-Age=0; HttpOnly`
      } else {
        return `${key}=${signCookie(value)}; Max-Age=3600; HttpOnly`
      }
    })
  } else {
    return []
  }
}