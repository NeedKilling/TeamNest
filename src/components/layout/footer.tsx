"use client"
import Link from "next/link"
import { Separator } from "../ui/separator"
import PartnerList from "./partner-list"
import { usePathname } from "next/navigation"




export default function Footer(){
    const path = usePathname()
    const isActive = (href: string) => path.startsWith(href) ? "hidden" : ""
    
    return(
        <div className={`${isActive("/admin")} ${isActive("/auth/sign-out")} container w-[1312px] py-12 mx-auto flex flex-col gap-6`}>
            <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                    <p className="text-xl  text-tBlack-main">TeamNest@bk.ru</p>
                    <Link href={"#"}><img src="/img/VK.png" alt="vk" /></Link>
                    <Link href={"#"}><img src="/img/Telegram.png" alt="telegram" /></Link>
                </div>

                <PartnerList/>
            </div>

            <Separator className="bg-[#F4F4F4]"/>    

            <div className="flex justify-between items-center">
                <div className="flex gap-7">
                    <Link href={"/"} className="w-[172px]"><img className= "" src="/img/Logo (1).png" alt="" /></Link>
                    <nav className="flex gap-6 text-tBlack-main text-base">
                        <Link className="hover:underline duration-300" href={"/personnel"}>Кадры</Link>
                        <Link className="hover:underline duration-300" href={"/projects"}>Стартапы</Link>
                        <Link className="hover:underline duration-300" href={"/contacts"}>Контакты</Link>
                    </nav>
                </div>

                <div className="">©2026</div>
            </div>
        </div>
    )
}