"use client"
import { Button } from "@/components/ui/button";
import { AboutImg } from "@/components/layout/about-img";
import Link from "next/link";
import { authClient } from "@/lib/client/auth-client";
import { Spinner } from "@/components/ui/spinner";
export const dynamic = 'force-dynamic'

export default function Home() {




  const {data: session, isPending, error} = authClient.useSession()
 

  const spanItalic = "font-semibold italic"

  return (
      <main className="">

        <section className="relative mx-auto  text-center py-[225px] xl:py-[241px] bg-[url(../../public/img/Hero.svg)] bg-cover flex flex-col items-center">

          <p className="bg-[#0B76FA1A] text-[#0B76FA] text-xl font-medium w-fit px-2 py-1 rounded-4xl">Вместе сильнее!</p>

          <div className=" container min-w-[398px] mx-auto xl:w-6xl text-center flex flex-col gap-4">
              <h1 className="mt-6  font-normal text-[28px] xl:text-[56px] md:text-[40px] bg-gradient bg-clip-text text-transparent">TEAM
                <span className="font-semibold ">NEST объединяем амбициозных для создания больших проектов</span>
            </h1>

            <p className=" container min-w-[398px]  xl:w-170 mx-auto text-base xl:text-xl font-normal text-tGray-sub">Мы объединяем <span className={spanItalic}>амбициозных</span> и <span className={spanItalic}>молодых</span> специалистов, чтобы запускать <span className={spanItalic}>сильные команды</span> и воплощать <span className={spanItalic}>смелые идеи</span> в жизнь.</p>
          </div>

          {isPending ? <Spinner className="py-5 size-6"/>  : session?.user ? <div></div> :
                <Button className={`w-full container w-[398px] mx-auto xl:w-fit h-[50px] mt-12 bg-black-component px-4 py-3 text-tWhite-main text-xl font-medium border border-glass`}><Link href="/auth/sign-up" >Зарегистрироваться</Link></Button>
              }
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        <section className="py-9 md:py-12 container w-[398px]  md:w-[800px] xl:w-[1312px] mx-auto flex flex-col xl:gap-12 gap-9 items-center">
          <div className="w-full xl:w-5xl flex flex-col items-center gap-4 text-center">
            <h2 className="xl:text-[56px] md:text-[40px] text-[28px] font-semibold bg-gradient bg-clip-text text-transparent">Платформа для тех, кто хочет создавать, а не ждать</h2>
            <p className="w-full xl:w-175 xl:text-xl text-base font-normal text-tGray-sub">Мы помогаем находить команду, запускать стартапы и делать первые шаги к настоящим изменениям.</p>
          </div>

          <div className="">{<AboutImg/>}</div>
          <p className="xl:w-6xl xl:text-2xl text-base  container w-[398px] mx-auto text-start xl:text-center">Наша миссия — дать каждому шанс воплотить идею в жизнь и получить поддержку<br/> на каждом этапе пути. Присоединяйтесь и начинайте строить будущее вместе с нами!</p>
        </section>

        


      </main>
  );
}
