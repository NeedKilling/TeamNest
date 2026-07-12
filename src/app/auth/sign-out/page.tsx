"use client"
import { authClient } from "@/lib/client/auth-client"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignOut(){

    const router = useRouter()
    useEffect(()=>{
        authClient.signOut({
            fetchOptions:{
                onSuccess: ()=>{
                    router.replace("/")
                    router.refresh();
                }
            }
        })

    },[])


    return null
}