"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/client/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HeaderAvatar from "../ui/header-avatar";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";

export default function Header(){
    const path = usePathname()
    const isActive = (href: string) => path.startsWith(href) ? "hidden" : ""
      


    const {data: session, isPending, error} = authClient.useSession()
    

    return(
        <div className="pr-[var(--removed-body-scroll-bar-size)] fixed top-4 left-1/2 -translate-x-1/2 mx-auto z-10">
            <div className={`${isActive("/admin")} ${isActive("/auth/sign-out")}  w-fit h-[69px]  px-3 flex items-center gap-12 bg-black-component rounded-xl shadow-custom `}>
                <Link className="w-[164px]" href={"/"}><img src="/img/Logo.png" alt="" /></Link>
                <nav className="flex gap-6 text-tWhite-main text-base ">
                    <Link className="hover:text-tGray-sub duration-300" href={"/personnel"}>Кадры</Link>
                    <Link className="hover:text-tGray-sub duration-300" href={"/projects"}>Стартапы</Link>
                    <Link className="hover:text-tGray-sub duration-300" href={"/contacts"}>Контакты</Link>
                </nav>
                
                {isPending ? 
                <div className="w-[62px] flex justify-center">
                    <Spinner className="text-tWhite-main size-8" />
                </div> : session?.user ? 
                    
                    <HeaderAvatar user={session.user}/>
                    : 
                        <Button className="h-[45px] bg-white-component text-base font-medium text-tBlack-main hover:bg-tGray-sub"><Link href="/auth/sign-up">Зарегистрироваться</Link></Button>}
            </div>
        </div>
    )
}