"use client"

import { api } from "@/app/lib/client/api"
import { useQuery } from "@tanstack/react-query"

export default function ProjectCards(){

    const {data: projects, isLoading} = useQuery({
        queryKey: ['projects'],
        queryFn: async ()=>{
            return ((await api.projects.get()).data)
        }
    })

    return(
        <div className="mt-10">
            <p>вот карточки</p>
            {isLoading && <p className="text-4xl color-gray-200 mt-50">Данные загружаются ...</p>} 
            <div>
                {
                    projects?.map((item)=>
                        <div key = {item.id} className="p-5 w-200px m-5 bg-blue-200">
                            <p>{item.name}</p>
                            <p>{item.stage}</p>
                            <p>{item.startDate.toLocaleDateString()}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}