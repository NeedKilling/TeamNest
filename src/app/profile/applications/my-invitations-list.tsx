"use client"

import MyInvitationsCard from "@/components/ui/my-invitations-card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/client/api"
import { MyApplications } from "@/lib/types/applications"
import { useQuery } from "@tanstack/react-query"


export default function MyApplicationsList({initialData}:{initialData: MyApplications[]}){

    const {data: applications} =useQuery({
        queryKey:["my-applications"],
        queryFn: async ()=>{
            return (await api.applications.my.get()).data
        },
        initialData: initialData
    })


        
    const invitations = applications?.filter(item => item.type === "invitation");
    

    return(
        <div className="xl:grid xl:grid-cols-3 xl:gap-10  flex flex-col gap-5  md:flex-row md:flex-wrap md:justify-center">
            {invitations && invitations.length > 0 ? invitations.map((item)=>(
                    <MyInvitationsCard key={item.id} item={item}/>
                ))
        : <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
            <p className="text-2xl font-medium">Вас пока никто не приглашал</p>
        </div>   
        }
    </div>
    )
}