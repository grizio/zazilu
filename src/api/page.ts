import { literal, object, Result, Validator } from "idonttrustlikethat"
import { app } from "~/app"
import type { Bloc } from "~/model/Page"
import { pageValidation } from "~/model/validation/PageValidation"
import { replace } from "~/utils/arrays"
import { nonEmptyString } from "~/utils/validators"
import { badRequest, conflict, created, noContent, notFound, ok, Request, Response } from "./action"
import { onAuthenticatedAdmin } from "./authentication"

export async function getAllPages(request: Request): Promise<Response> {
  return onAuthenticatedAdmin(request, async () => {
    const pages = await app.pageRepository.getAll()
    return ok(pages)
  })
}

export async function getPage(request: Request): Promise<Response> {
  console.log(request.params)
  const pageContent = await app.pageRepository.get(request.params.slug)

  if (pageContent !== undefined) {
    return ok(pageContent)
  } else {
    return notFound({ message: "Not found" })
  }
}

export async function postPage(request: Request): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    const validation = pageValidation.validate(request.body)
    if (validation.ok) {
      const page = validation.value
      if (page.key === request.params.slug) {
        const existingPage = await app.pageRepository.get(page.key)
        if (existingPage === undefined) {
          await app.pageRepository.post(page)
          return created(page)
        } else {
          return conflict({ message: "The page already exist" })
        }
      } else {
        return badRequest({ message: "key in body and slug in path do not match", path: "key" })
      }
    } else {
      return badRequest(validation.errors)
    }
  })
}

export async function putPage(request: Request): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    const validation = pageValidation.validate(request.body)
    if (validation.ok) {
      if (validation.value.key === request.params.slug) {
        const existingPage = await app.pageRepository.get(request.params.slug)

        if (existingPage !== undefined) {
          await app.pageRepository.put(validation.value)
          return ok(validation.value)
        } else {
          return notFound({ message: `Not found` })
        }
      } else {
        return badRequest({ message: "key in body and slug in path do not match", path: "key" })
      }
    } else {
      return badRequest(validation.errors)
    }
  })
}

export async function deletePage(request: Request): Promise<Response> {
  return await onAuthenticatedAdmin(request, async () => {
    if (request.params.slug !== "home") {
      await app.pageRepository.remove(request.params.slug)
      return noContent()
    } else {
      return badRequest({ message: "You cannot remove the homepage" })
    }
  })
}

type PageAction = MeetRegisterAction

type MeetRegisterAction = {
  type: "meet.register"
  bloc: string
  name: string
}

const meetActionValidator: Validator<MeetRegisterAction> = object({
  type: literal("meet.register"),
  bloc: nonEmptyString,
  name: nonEmptyString
})

const actionValidator: Validator<PageAction> = meetActionValidator

export async function postAction(request: Request): Promise<Response> {
  const validation = actionValidator.validate(request.body)
  if (validation.ok) {
    const page = await app.pageRepository.get(request.params.slug)
    if (page !== undefined) {
      const blocIndex = page.content.findIndex(_ => _.id === validation.value.bloc)
      if (blocIndex !== -1) {
        const result = process(validation.value, page.content[blocIndex])
        if (result.ok) {
          const updatedPage = {
            ...page,
            content: replace(page.content, blocIndex, result.value)
          }
          await app.pageRepository.put(updatedPage)
          return ok(updatedPage)
        } else {
          return badRequest(result.errors)
        }
      } else {
        return notFound({ message: "Bloc not found" })
      }
    } else {
      return notFound({ message: "Page not found" })
    }
  } else {
    return badRequest(validation.errors)
  }
}

function process(action: PageAction, bloc: Bloc): Result<{ message: string }, Bloc> {
  switch (action.type) {
    case "meet.register": return processMeet(action, bloc)
  }
}

function processMeet(action: MeetRegisterAction, bloc: Bloc): Result<{ message: string }, Bloc> {
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