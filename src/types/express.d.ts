import type { JwtUserPayload } from "@/shared/interfaces/user.interfaces.ts"

declare global {
  namespace Express {
    interface Request {
      token?: string,
      user?: JwtUserPayload
    }
  }
}
export { }
