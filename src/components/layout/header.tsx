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
import { Menu, X } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useState, useEffect, useRef } from "react";


export default function Header(){
    const path = usePathname()
    const isActive = (href: string) => path.startsWith(href) ? "hidden" : ""
      
    const [isVisible, setIsVisible] = useState(true);
    const Scroll = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > Scroll.current && currentScroll > 50) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        Scroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

    const {data: session, isPending, error} = authClient.useSession()
    
     const [isOpen, setIsOpen] = useState(false);

    return(
        <div className={`pr-[var(--removed-body-scroll-bar-size)] fixed top-4 left-1/2 -translate-x-1/2 mx-auto z-10 transition-transform duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-[calc(100%+1rem)]'}`}>
            <div className={`${isActive("/admin")} ${isActive("/auth/sign-out")} h-[48px] container w-[398px]  md:w-fit md:h-[69px]  px-3 flex items-center justify-between md:gap-12 bg-black-component rounded-xl shadow-custom `}>
                <Link className="w-[164px]" href={"/"}><img src="/img/Logo.png" alt="" /></Link>
                <nav className="hidden md:flex gap-6 text-tWhite-main text-base ">
                    <Link className="hover:text-tGray-sub duration-300" href={"/personnel"}>Кадры</Link>
                    <Link className="hover:text-tGray-sub duration-300" href={"/projects"}>Стартапы</Link>
                    <Link className="hover:text-tGray-sub duration-300" href={"/contacts"}>Контакты</Link>
                </nav>
                
                {isPending ? 
                <div className="w-[62px] hidden md:flex justify-center">
                    <Spinner className="text-tWhite-main size-8" />
                </div> : session?.user ? 
                    
                    <div className="hidden md:block">
                        <HeaderAvatar user={session.user} setIsOpen={setIsOpen} isOpen={isOpen}/>
                    </div>
                    : 
                        <Button className="hidden md:block h-[45px] bg-white-component text-base font-medium text-tBlack-main hover:bg-tGray-sub"><Link href="/auth/sign-up">Зарегистрироваться</Link></Button>}

                       
















                       <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button className="md:hidden text-white-component">
                            <Menu className="size-6" />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="right" className="!w-full p-0 flex flex-col bg-white-component border-l border-white/10 [&>button]:hidden">
                       <div className={`${isActive("/admin")} ${isActive("/auth/sign-out")} h-[48px] container w-[398px] mx-auto mt-4 md:w-fit md:h-[69px]  px-3 flex items-center justify-between md:gap-12 bg-black-component rounded-xl shadow-custom `}>
                            <Link className="w-[164px]" href={"/"}><img src="/img/Logo.png" alt="" /></Link>
                        
                            <SheetClose asChild>
                                <button className="text-white-component">
                                    <X className="size-6" />
                                </button>
                            </SheetClose>
                        </div>

                    
                        <div className="flex-1 flex flex-col items-start justify-start gap-8 p-6">
                            <nav className="flex flex-col items-start gap-6 text-tBlack-component text-lg">
                                <Link className="hover:text-tGray-sub duration-300" href={"/personnel"} onClick={()=>setIsOpen(!open)}>Кадры</Link>
                                <Link className="hover:text-tGray-sub duration-300" href={"/projects"} onClick={()=>setIsOpen(!open)}>Стартапы</Link>
                                <Link className="hover:text-tGray-sub duration-300" href={"/contacts"} onClick={()=>setIsOpen(!open)}>Контакты</Link>
                            </nav>

                      
                        {!isPending && session?.user && (
                            <>
                                <Separator/>
                                <div className="w-fit h-full">
                                    <HeaderAvatar user={session.user} setIsOpen={setIsOpen} isOpen={isOpen}/>
                                </div>
                            </>
                            
                        )}
                        </div>

                      
                        <div className="container w-[398px] mx-auto">
                            {isPending ? (
                                <div className="flex justify-center">
                                    <Spinner className="text-tWhite-main size-6" />
                                </div>
                            ) : session?.user ? 
                               <div></div>:
                                
                                <Button className="mb-9  mx-auto container  h-[45px] bg-black-component text-base font-medium text-tWhite-main hover:bg-tGray-sub"
                                    onClick={()=>setIsOpen(!open)}>
                                    <Link href="/auth/sign-up">Зарегистрироваться</Link>
                                </Button> 
                                
                                
                            }
                        </div>
                    </SheetContent>
                    </Sheet>

            </div>
            
        </div>
    )
}