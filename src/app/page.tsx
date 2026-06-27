import { api } from "@/server/api";
import { auth } from "@/server/auth/auth";
import Image from "next/image";
import {headers as nextHeaders} from "next/headers"
import z from "zod/v4"
import { projectsSchema } from "@/lib/schemas/project";

const imgUrl = "http://localhost:3000/api/files/"

export default async function Home() {

  const projects = (await api.projects.get({headers: await nextHeaders()})).data as (z.infer<typeof projectsSchema> & { id: string })[]
  console.log(projects)

  const session = await auth.api.getSession({
    headers: await nextHeaders()

  });
  console.log(session)

  console.log((await api.projects.get({headers: await nextHeaders()})).data as z.infer<typeof projectsSchema>[]);

  // 019ef5e2-2433-7000-81ea-1460c988429e

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>{
          projects?.map((item)=>
          <div key = {item.id} className="p-5 w-200px m-5 bg-blue-200">
              <p>{item.name}</p>
              <p>{item.stage}</p>
              <p>{item.startDate.toLocaleDateString()}</p>
              <img className = "w-100 mx-auto " src={item.image ? imgUrl+item.image : "/noImage.png"} alt="" />
          </div>
          )
        }</div>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <img src="http://localhost:3000/api/files/019ef5a7-cf57-7000-a972-cb1eb0a2ec46" alt="img" />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
