"use client"

import MyApplicationsCard from "@/components/ui/my-applications-card"
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
    const myApplications = applications?.filter(item => item.type === "application");


    return(
        <div className="grid grid-cols-3 gap-10">
            {myApplications && myApplications.length > 0 ? myApplications.map((item)=>(
                <MyApplicationsCard key={item.id} item={item}/>
            ))
            : <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
                <p className="text-2xl font-medium">Вы пока не откликались</p>
            </div>   
            }
        </div>
    )
}