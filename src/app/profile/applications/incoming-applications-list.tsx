"use client"

import MyInvitationsCard from "@/components/ui/my-invitations-card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/client/api"
import { ProjectApplicationsData } from "@/lib/types/applications"
import { useQuery } from "@tanstack/react-query"

export default function IncomingApplicationsList({initialData}:{initialData:  ProjectApplicationsData[]}){

    const {data: applications} =useQuery({
        queryKey:["project-applications"],
        queryFn: async ()=>{
            return (await api.applications.invite.get()).data
        },
        initialData: initialData
    })

    const incomingApplications = applications?.filter(item => item.type === "application");

    return(
        <div className="grid grid-cols-3 gap-10">
                    {incomingApplications && incomingApplications.length > 0 ? incomingApplications.map((item)=>(
                            <MyInvitationsCard key={item.id} item={item}/>
                        ))
                : <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
                    <p className="text-2xl font-medium">На ваши проеты пока никто не откликался</p>
                </div>   
                }
            </div>
    )
}