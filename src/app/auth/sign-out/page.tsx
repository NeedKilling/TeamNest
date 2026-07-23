"use client"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/client/auth-client"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export const dynamic = 'force-dynamic'

export default function SignOut(){

    const router = useRouter()
    useEffect(()=>{
        authClient.signOut({
            fetchOptions:{
                onSuccess: ()=>{
                    // router.push("/")
                    // router.refresh();
                    window.location.href = "/"
                }
            }
        })

    },[])


    return (
        <div className="flex gap-5 min-h-screen items-center justify-center text-base text-tGray-sub">
            Выход из системы... <Spinner/>
        </div>
    )
}