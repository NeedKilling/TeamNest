"use client"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Asterisk } from 'lucide-react'
export function SideBar(){

   const path = usePathname()

   const isActive = (href: string) => path === href ? <Asterisk /> : ""
   const ActiveClass = "text-zinc-500"

    return(
        <div className="flex w-50 text-center flex-none flex-col gap-3 border rounded-xl  p-5 bg-gray-component shrink-0 h-fit ">
            
            <Link href={"/profile"} className = {isActive("/profile") ? ActiveClass : ""}>Профиль {isActive("/profile")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/profile/my-projects"} className = {isActive("/profile/my-projects") ? ActiveClass : ""}>Мои проекты {isActive("/profile/my-projects")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/profile/applications"} className = {isActive("/profile/applications") ? ActiveClass : ""}>Мои отклики {isActive("/profile/applications")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/profile/favorite"} className = {isActive("/profile/favorite") ? ActiveClass : ""}>Избранное {isActive("/profile/favorite")?"*" : ""}</Link>
            
        </div>
    )
}