import { nonEmptyString } from "$lib/utils/validators"
import type { Bloc } from "$model/Page"
import { array, literal, object, Result, union, Validator } from "idonttrustlikethat"

export type PageAction = MeetRegisterAction | MeetsRegisterAction

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

export const pageActionValidator: Validator<PageAction> = union(meetRegisterActionValidator, meetsRegisterActionValidator)


export function processPageAction(action: PageAction, bloc: Bloc): Result<{ message: string }, Bloc> {
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