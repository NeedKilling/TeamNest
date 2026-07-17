
import { auth } from "@/server/auth/auth";
import {headers as nextHeaders} from "next/headers"
import { redirect } from "next/navigation";
import { SideBar } from "./sidebar";



export default async function ProfileLayout({children}:{children: React.ReactNode}){

    const session = (await auth.api.getSession({
        headers: await nextHeaders()
    
      }));
      console.log(session)

      if(!session?.user){
        redirect('not-found')
      }


    return(
        <div className="min-h-screen flex flex-col">
            <div className="pt-[133px] container w-[1312px] mx-auto flex gap-5 flex-1 ">
                <SideBar/>
                {children}
            
            </div>
        </div>
      
    )
}