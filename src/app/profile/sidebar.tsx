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
        <div className="flex w-full  flex-row container  xl:w-50 xl:min-w-50 text-center flex-none xl:flex-col justify-between xl:justify-start  xl:gap-3 border rounded-xl p-2  xl:p-5 bg-gray-component xl:shrink-0 h-fit text-[14px] xl:text-base">
            <Link href={"/profile"} className = {isActive("/profile") ? ActiveClass : ""}>Профиль {isActive("/profile")?"*" : ""}</Link>
            <Separator className="hidden xl:block"/>
            <Link href={"/profile/my-projects"} className = {isActive("/profile/my-projects") ? ActiveClass : ""}>Мои проекты {isActive("/profile/my-projects")?"*" : ""}</Link>
            <Separator className="hidden xl:block"/>
            <Link href={"/profile/applications"} className = {isActive("/profile/applications") ? ActiveClass : ""}>Мои отклики {isActive("/profile/applications")?"*" : ""}</Link>
            <Separator className="hidden xl:block"/>
            <Link href={"/profile/favorite"} className = {isActive("/profile/favorite") ? ActiveClass : ""}>Избранное {isActive("/profile/favorite")?"*" : ""}</Link>
            
        </div>
    )
}