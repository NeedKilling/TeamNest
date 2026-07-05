
import { auth } from "@/server/auth/auth";
import {headers as nextHeaders} from "next/headers"
import { redirect } from "next/navigation";
import { SideBar } from "./sidebar";


export default async function AdminLayout({children}:{children: React.ReactNode}){

    const session = (await auth.api.getSession({
        headers: await nextHeaders()
    
      }));
      console.log(session)

      if(session?.user.role !== "admin"){
        redirect('not-found')
      }


    return(
       <div className="">
            <div className="text-center p-5 text-4xl">ADMIN</div>
            
            <div className="pl-60 p-10">
                <SideBar/>
                {children}
            </div>
       </div>
    )
}