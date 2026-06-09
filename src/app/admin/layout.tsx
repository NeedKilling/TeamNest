
import { auth } from "@/server/auth/auth";
import {headers as nextHeaders} from "next/headers"
import { redirect } from "next/navigation";


export default async function AdminLayout({children}:{children: React.ReactNode}){

    const session = (await auth.api.getSession({
        headers: await nextHeaders()
    
      }));
      console.log(session)

      if(session?.user.role !== "admin"){
        redirect('not-found')
      }


    return(
        <div className="flex flex-col gap-5">
            <div className="mx-auto p-5 text-4xl">ADMIN</div>
            {children}
        </div>
    )
}