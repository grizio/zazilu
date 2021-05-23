export type Image = {
  key: string
  contentType?: string
  contentLength?: number
  etag?: string
  content: Buffer
}