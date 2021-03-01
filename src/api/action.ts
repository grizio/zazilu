import type * as express from "express"

export type Action = (request: Request) => Promise<Response>

export type Request = express.Request

export type Response = {
  status: number
  headers: Record<string, string>
  body?: string
  cookies?: Record<string, string | null>
}

type Options = {
  headers?: Record<string, string>
  cookies?: Record<string, string | null>
}
export function ok(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function created(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function noContent({ headers, cookies }: Options = {}): Response {
  return {
    status: 204,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    cookies
  }
}

export function badRequest(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 400,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function unauthenticated(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function forbidden(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 403,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function notFound(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}

export function conflict(body: any, { headers, cookies }: Options = {}): Response {
  return {
    status: 409,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: JSON.stringify(body),
    cookies
  }
}
