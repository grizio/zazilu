import { object, Validator } from "idonttrustlikethat"
import { nonEmptyString } from "$lib/utils/validators"
import type { ImageMetadata } from "$model/Image"

export const imageMetadataValidator: Validator<ImageMetadata> = object({
  key: nonEmptyString,
  filename: nonEmptyString
})
