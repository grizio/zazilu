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