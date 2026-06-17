import { auth } from "@/server/auth/auth";
import Elysia from "elysia";

export const userService = new Elysia({
    name: "user/service"
}) 
.derive({as: "global"}, async ({ request }) => {

    const BetterAuthSession = await auth.api.getSession({
        headers: request.headers
    })

    return{
        session: BetterAuthSession
    }
})
.macro({
    isSignedId:(enabled?: boolean) => {
        if(!enabled){
            return
        }

        return{
            beforeHandle({session ,status}){
                if(!session?.user){
                    return status(401,"Вы не авторизовались")
                }   
            }
            
        }
    },
    isAdmin: (enabled?: boolean) => {
        if(!enabled){
            return
        }
        return{
            beforeHandle({session,status}){
                if(session?.user.role !== "admin"){
                    return status(403, "Отказано")
                }
            }
        }
    }
})