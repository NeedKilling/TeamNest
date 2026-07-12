
import { auth } from "@/server/auth/auth";
import {headers as nextHeaders} from "next/headers"
import { redirect } from "next/navigation";



export default async function ProfileLayout({children}:{children: React.ReactNode}){

    const session = (await auth.api.getSession({
        headers: await nextHeaders()
    
      }));
      console.log(session)

      if(!session?.user){
        redirect('not-found')
      }


    return(
        <div className="pt-[133px] container w-[1312px] mx-auto">
            {children}
        </div>
      
    )
}