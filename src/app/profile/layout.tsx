
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
            <div className="pt-[133px] container w-[398px] sm:w-full xl:w-[1312px] mx-auto flex xl:flex-row flex-col gap-5 flex-1 ">
                <div className="xl:sticky xl:top-[133px] xl:self-start xl:h-fit xl:w-50 xl:min-w-50">
                    <SideBar />
                </div>
                
                {children}
            
            </div>
        </div>
      
    )
}