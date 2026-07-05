"use client"
import { Separator } from "@/components/ui/separator"
import { is } from "drizzle-orm"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Asterisk } from 'lucide-react'
export function SideBar(){

   const path = usePathname()

   const isActive = (href: string) => path === href ? <Asterisk /> : ""
   const ActiveClass = "text-zinc-500"

    return(
        <div className="fixed left-10 flex flex-col gap-3 border rounded-xl  p-5">
            <Link href={"/admin/industries"} className = {isActive("/admin/industries") ? ActiveClass : ""}>Отрасли {isActive("/admin/industries")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/admin/projects"} className = {isActive("/admin/projects") ? ActiveClass : ""}>Стартапы {isActive("/admin/projects")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/admin/categories"} className = {isActive("/admin/categories") ? ActiveClass : ""}>Категории {isActive("/admin/categories")?"*" : ""}</Link>
            <Separator/>
            <Link href={"/admin/specialization"} className = {isActive("/admin/specialization") ? ActiveClass : ""}>Специальности {isActive("/admin/specialization")?"*" : ""}</Link>
        </div>
    )
}