import { array, literal, object, Result, union, Validator } from "idonttrustlikethat"
import { app } from "$server/app"
import type { Bloc, Page } from "$model/Page"
import { replace } from "$lib/utils/arrays"
import { nonEmptyString } from "$lib/utils/validators"
import { badRequest, conflict, created, noContent, notFound, ok } from "./responses"
import { onAuthenticatedAdmin } from "./authentication"
import type { ActionRequest } from "./RouterBuilder"
import type { Response } from "@sveltejs/kit"

export async function getAllPages(request: ActionRequest): Promise<Response> {
  return onAuthenticatedAdmin(request, async () => {
    const pages = await app.pageRepository.getAll()
    return ok(pages)
  })
}

export async function getPage(request: ActionRequest<{slug: string}>): Promise<Response> {
  const pageContent = await app.pageRepository.get(request.params.slug)

  if (pageContent === undefined) {
    return notFound({ message: "Not found" })
  } else {
    return ok(pageContent)
  }
}

export async function postPage(request: ActionRequest<{slug: string}, Page>): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    if (request.body.key !== request.params.slug) {
      return badRequest({ message: "key in body and slug in path do not match", path: "key" })
    } else {
      const existingPage = await app.pageRepository.get(request.body.key)
      if (existingPage !== undefined) {
        return conflict({ message: "The page already exist" })
      } else {
        await app.pageRepository.post(request.body)
        return created(request.body)
      }
    }
  })
}

export async function putPage(request: ActionRequest<{slug: string}, Page>): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    if (request.body.key !== request.params.slug) {
      return badRequest({ message: "key in body and slug in path do not match", path: "key" })
    } else {
      const existingPage = await app.pageRepository.get(request.params.slug)
      if (existingPage === undefined) {
        return notFound({ message: `Not found` })
      } else {
        await app.pageRepository.put(request.body)
        return ok(request.body)
      }
    }
  })
}

export async function deletePage(request: ActionRequest<{slug: string}>): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    if (request.params.slug === "home") {
      return badRequest({ message: "You cannot remove the homepage" })
    } else {
      await app.pageRepository.remove(request.params.slug)
      return noContent()
    }
  })
}

type PageAction = MeetRegisterAction | MeetsRegisterAction

type MeetRegisterAction = {
  type: "meet.register"
  bloc: string
  name: string
}

type MeetsRegisterAction = {
  type: "meets.register"
  bloc: string
  meets: Array<string>
  name: string
}

const meetRegisterActionValidator: Validator<MeetRegisterAction> = object({
  type: literal("meet.register"),
  bloc: nonEmptyString,
  name: nonEmptyString,
})

const meetsRegisterActionValidator: Validator<MeetsRegisterAction> = object({
  type: literal("meets.register"),
  bloc: nonEmptyString,
  meets: array(nonEmptyString),
  name: nonEmptyString,
})

export const actionValidator: Validator<PageAction> = union(meetRegisterActionValidator, meetsRegisterActionValidator)

export async function postAction(request: ActionRequest<{slug: string}>): Promise<Response> {
  const validation = actionValidator.validate(request.body)
  if (!validation.ok) {
    return badRequest(validation.errors)
  } else {
    const page = await app.pageRepository.get(request.params.slug)
    if (page === undefined) {
      return notFound({ message: "Page not found" })
    } else {
      const blocIndex = page.content.findIndex(_ => _.id === validation.value.bloc)
      if (blocIndex === -1) {
        return notFound({ message: "Bloc not found" })
      } else {
        const result = process(validation.value, page.content[blocIndex])
        if (!result.ok) {
          return badRequest(result.errors)
        } else {
          const updatedPage = {
            ...page,
            content: replace(page.content, blocIndex, result.value)
          }
          await app.pageRepository.put(updatedPage)
          return ok(updatedPage)
        }
      }
    }
  }
}

function process(action: PageAction, bloc: Bloc): Result<{ message: string }, Bloc> {
  switch (action.type) {
    case "meet.register": return processMeetRegister(action, bloc)
    case "meets.register": return processMeetsRegister(action, bloc)
  }
}

function processMeetRegister(action: MeetRegisterAction, bloc: Bloc): Result<{ message: string }, Bloc> {
  if (bloc.type === "meet") {
    return {
      ok: true,
      value: {
        ...bloc,
        members: [...bloc.members, action.name]
      }
    }
  } else {
    return {
      ok: false,
      errors: { message: "Bloc is not a meet" }
    }
  }
}

function processMeetsRegister(action: MeetsRegisterAction, bloc: Bloc): Result<{ message: string }, Bloc> {
  if (bloc.type === "meets") {
    return {
      ok: true,
      value: {
        ...bloc,
        meets: bloc.meets.map(meet => {
          if (action.meets.includes(meet.id)) {
            return { ...meet, members: [...meet.members, action.name] }
          } else {
            return meet
          }
        })
      }
    }
  } else {
    return {
      ok: false,
      errors: { message: "Bloc is not a meet" }
    }
  }
}