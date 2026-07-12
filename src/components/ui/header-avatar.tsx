import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

import { ChevronDown,ChevronUp,LogOutIcon,UserIcon , CircleUserRound, FolderOpen, NotebookTabs, Star } from 'lucide-react'
import { User } from "better-auth"
import { authClient } from "@/lib/client/auth-client"
import Link from "next/link"


export default function HeaderAvatar({user}:{user: typeof authClient.$Infer.Session.user}){

    const [open,setOpen] = useState(false)



    return(
        <DropdownMenu open = {open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild >
               <button className="focus:outline-none flex items-center justify-between cursor-pointer border-none w-[62px] p-0 h-fit"  >
                    <Avatar>
                        <AvatarImage src="/img/avatar.svg"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {open ? <ChevronUp strokeWidth={1.5} className = "size-6  text-white-component" /> : <ChevronDown strokeWidth={1.5} className="size-6 text-white-component"/>}
               </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-2 w-[220px]  translate-x-3 translate-y-[19px]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex gap-2 mb-4">
                        <Avatar size="lg">
                            <AvatarImage src="/img/avatar.svg"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-medium text-tBlack-main">{user.name} {user.lastName}</p>
                            <p className="text-[14px] text-tGray-sub">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem><Link className="flex gap-2 items-center"href={"/profile"}> <CircleUserRound /> Мой профиль</Link></DropdownMenuItem>
                    <DropdownMenuItem><FolderOpen /> Мои проекты</DropdownMenuItem>
                    <DropdownMenuItem><NotebookTabs /> Мои отклики</DropdownMenuItem>
                    <DropdownMenuItem><Star /> Избранное</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(!open)} className="mt-2" variant="destructive"><Link className="flex gap-2 items-center" href={"/auth/sign-out"}><LogOutIcon />Выход</Link></DropdownMenuItem>
                    
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}