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


export default function HeaderAvatar({user, setIsOpen, isOpen}:{user: typeof authClient.$Infer.Session.user,
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void,
    isOpen: boolean | null
}){
    // const imgUrl = "/api/files/"
    const imgUrl = "/api/files/"
    const [open,setOpen] = useState(false)
    const initials = (name: string, lastName: string)=>{
        return `${name.slice(0,1).toUpperCase()}${lastName.slice(0,1).toUpperCase()}`
    } 


    

    return(
        <div className="flex flex-col justify-between items-between h-full ">
        <DropdownMenu open = {open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild >
               <button className="hidden  focus:outline-none md:flex items-center justify-between cursor-pointer border-none w-[62px] p-0 h-fit"  >
                    <Avatar>
                        <AvatarImage className="shrink-0" src={user?.image ? `${imgUrl+user.image}` : "/img/avatar.svg"}/>
                        <AvatarFallback>{initials(user.name,user.lastName)}</AvatarFallback>
                    </Avatar>
                    {open ? <ChevronUp strokeWidth={1.5} className = "size-6  text-white-component" /> : <ChevronDown strokeWidth={1.5} className="size-6 text-white-component"/>}
               </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-2 w-[220px]  translate-x-3 translate-y-[19px]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex gap-2 mb-4">
                        <Avatar size="lg">
                            <AvatarImage className="shrink-0" src={user?.image ? `${imgUrl+user.image}` : "/img/avatar.svg"}/>
                            <AvatarFallback>{initials(user.name,user.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-medium text-tBlack-main">{user.name} {user.lastName}</p>
                            <p className="text-[14px] text-tGray-sub">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem onClick={()=>setOpen(!open)}><Link className="flex gap-2 items-center" href={"/profile"}> <CircleUserRound /> Мой профиль</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(!open)}><Link className="flex gap-2 items-center" href={"/profile/my-projects"}><FolderOpen /> Мои проекты </Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(!open)}><Link className="flex gap-2 items-center" href={"/profile/applications"}><NotebookTabs /> Мои отклики</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(!open)}><Link className="flex gap-2 items-center" href={"/profile/favorite"}><Star /> Избранное</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(!open)} className="mt-2" variant="destructive"><Link className="flex gap-2 items-center" href={"/auth/sign-out"}><LogOutIcon />Выход</Link></DropdownMenuItem>
                    
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>



        
            <div  className="block relative left-[-10px] container w-[381px] md:hidden translate-x-3 translate-y-[19px]">
                <div>
                    <div className="flex gap-2 mb-4">
                        <Avatar size="lg">
                            <AvatarImage className="shrink-0" src={user?.image ? `${imgUrl+user.image}` : "/img/avatar.svg"}/>
                            <AvatarFallback>{initials(user.name,user.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-medium text-tBlack-main">{user.name} {user.lastName}</p>
                            <p className="text-[16px] text-tGray-sub">{user.email}</p>
                        </div>
                    </div>

                    <div  className="flex flex-col gap-2">
                        <div onClick={()=>setIsOpen(!isOpen)}><Link className="flex gap-2 items-center text-xl text-tBlack-main" href={"/profile"}> <CircleUserRound strokeWidth={1.5}/> Мой профиль</Link></div>
                        <div onClick={()=>setIsOpen(!isOpen)}><Link className="flex gap-2 items-center text-xl text-tBlack-main" href={"/profile/my-projects"}><FolderOpen strokeWidth={1.5}/> Мои проекты </Link></div>
                        <div onClick={()=>setIsOpen(!isOpen)}><Link className="flex gap-2 items-center text-xl text-tBlack-main" href={"/profile/applications"}><NotebookTabs strokeWidth={1.5}/> Мои отклики</Link></div>
                        <div onClick={()=>setIsOpen(!isOpen)}><Link className="flex gap-2 items-center text-xl text-tBlack-main" href={"/profile/favorite"}><Star strokeWidth={1.5}/> Избранное</Link></div>
                    </div>
                   
                    
                </div>
            </div>

             <button  onClick={()=>setIsOpen(!isOpen)} className="mt-2"><Link className="md:hidden flex gap-2 items-start text-xl text-[#FF3B30]" href={"/auth/sign-out"}><LogOutIcon className="text-[#FF3B30]" />Выход</Link></button>

        </div>
    )
}