export type ImageMetadata = {
  key: string
  filename: string
}

export type ImageObject = {
  key: string
  contentType?: string
  contentLength?: number
  etag?: string
  content: Buffer
}

export type Image = ImageMetadata & ImageObject