import { literal, object, Result, Validator } from "idonttrustlikethat"
import { app } from "~/app"
import type { Bloc } from "~/model/Page"
import { replace } from "~/utils/arrays"
import { AppResponse, badRequest, notFound, ok, PostRequest } from "~/utils/requests"
import { nonEmptyString } from "~/utils/validators"

type Params = { slug: string }

type Action = MeetRegisterAction

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

const actionValidator: Validator<Action> = meetActionValidator

export async function post(req: PostRequest<Params>, res: AppResponse) {
  const validation = actionValidator.validate(req.body)
  if (validation.ok) {
    const page = await app.pageRepository.get(req.params.slug)
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
          ok(res, updatedPage)
        } else {
          badRequest(res, result.errors)
        }
      } else {
        notFound(res, { message: "Bloc not found" })
      }
    } else {
      notFound(res, { message: "Page not found" })
    }
  } else {
    badRequest(res, validation.errors)
  }
}

function process(action: Action, bloc: Bloc): Result<{ message: string }, Bloc> {
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