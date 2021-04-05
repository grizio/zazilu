import { createHmac, timingSafeEqual } from "crypto"

const cookieSignatureKey = "changeme"

export function signCookie(cookie: string): string {
  const signature = createHmac('sha256', cookieSignatureKey)
    .update(cookie)
    .digest('base64')
    .replace(/\=+$/, '')
  return cookie + '.' + signature
}

export function unsignCookie(cookie: string): string | undefined {
  const cookieValue = cookie.slice(0, cookie.lastIndexOf("."))
  const expectedSignedCookie = signCookie(cookieValue)

  const expectedSignedCookieBuffer = Buffer.from(expectedSignedCookie)
  const cookieBuffer = Buffer.alloc(expectedSignedCookieBuffer.length)
  cookieBuffer.write(cookie)

  if (timingSafeEqual(expectedSignedCookieBuffer, cookieBuffer)) {
    return cookieValue
  } else {
    return undefined
  }
}