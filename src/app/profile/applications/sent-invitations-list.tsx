"use client"

import MyApplicationsCard from "@/components/ui/my-applications-card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/client/api"
import { ProjectApplicationsData } from "@/lib/types/applications"
import { useQuery } from "@tanstack/react-query"

export default function SentInvitationsList({initialData}:{initialData:  ProjectApplicationsData[]}){

    const {data: applications} =useQuery({
        queryKey:["project-applications"],
        queryFn: async ()=>{
            return (await api.applications.invite.get()).data
        },
        initialData: initialData
    })

    const sentInvitations = applications?.filter(item => item.type === "invitation");

    return(
        <div className="xl:grid xl:grid-cols-3 xl:gap-10  flex flex-col gap-5  md:flex-row md:flex-wrap md:justify-center">
            {sentInvitations && sentInvitations.length > 0 ? sentInvitations.map((item)=>(
                    <MyApplicationsCard key={item.id} item={item}/>
                ))
        : <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
            <p className="text-2xl font-medium">Вы пока ни кого не приглашали</p>
        </div>   
        }
    </div>
    )
}