import { createAuthClient } from "better-auth/react"

let origin =''

if(typeof window !== "undefined"){
    origin = window.location.origin
}
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: origin
})