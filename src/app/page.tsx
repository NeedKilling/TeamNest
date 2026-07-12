import { api } from "@/server/api";
import { auth } from "@/server/auth/auth";
import Image from "next/image";
import {headers as nextHeaders} from "next/headers"
import z from "zod/v4"
import { projectsSchema } from "@/lib/schemas/project";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AboutImg } from "@/components/layout/about-img";
import Link from "next/link";


export default async function Home() {




  // const projects = (await api.projects.get({headers: await nextHeaders()})).data as (z.infer<typeof projectsSchema> & { id: string })[]
  // console.log(projects)

  const session = await auth.api.getSession({
    headers: await nextHeaders()

  });
  let buttonReg = ""
  if(session?.user){
    buttonReg = "hidden"
  }
  console.log(session)

  // console.log((await api.projects.get({headers: await nextHeaders()})).data as z.infer<typeof projectsSchema>[]);

  // 019ef5e2-2433-7000-81ea-1460c988429e
  const spanItalic = "font-semibold italic"

  return (
      <main>

        <section className="relative mx-auto  text-center py-[241px] bg-[url(../../public/img/Hero.svg)] bg-cover flex flex-col items-center">

          <p className="bg-[#0B76FA1A] text-[#0B76FA] text-xl font-medium w-fit px-2 py-1 rounded-4xl">Вместе сильнее!</p>

          <div className="w-6xl text-center flex flex-col gap-4">
              <h1 className="mt-6  font-normal text-[56px] bg-gradient bg-clip-text text-transparent">TEAM
                <span className="font-semibold">NEST объединяем амбициозных для создания больших проектов</span>
            </h1>

            <p className="w-170 mx-auto text-xl font-normal text-tGray-sub">Мы объединяем <span className={spanItalic}>амбициозных</span> и <span className={spanItalic}>молодых</span> специалистов, чтобы запускать <span className={spanItalic}>сильные команды</span> и воплощать <span className={spanItalic}>смелые идеи</span> в жизнь.</p>
          </div>

          <Button className={`${buttonReg}  h-[50px] mt-12 bg-black-component px-4 py-3 text-tWhite-main text-xl font-medium border border-glass`}><Link href="/auth/sign-up" >Зарегистрироваться</Link></Button>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        <section className="py-12 container w-[1312px] mx-auto flex flex-col gap-12 items-center">
          <div className="w-5xl flex flex-col items-center gap-4 text-center">
            <h2 className="text-[56px] font-semibold bg-gradient bg-clip-text text-transparent">Платформа для тех, кто хочет создавать, а не ждать</h2>
            <p className="w-175 text-xl font-normal text-tGray-sub">Мы помогаем находить команду, запускать стартапы и делать первые шаги к настоящим изменениям.</p>
          </div>

          <div className="">{<AboutImg/>}</div>
          <p className="w-6xl text-2xl text-center">Наша миссия — дать каждому шанс воплотить идею в жизнь и получить поддержку<br/> на каждом этапе пути. Присоединяйтесь и начинайте строить будущее вместе с нами!</p>
        </section>

        


      </main>
  );
}
