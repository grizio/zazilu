import { string, Validator } from "idonttrustlikethat"

export const nonEmptyString: Validator<string> = string.filter(_ => _ !== "")