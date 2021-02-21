import type { Request, Response } from "express"

export type AppRequest = Request & {
  signedCookies?: Record<string, string>
}

export type GetRequest = AppRequest

export type AppResponse = Response