"use client"

import { api } from "@/lib/client/api"
import { projectsSchema } from "@/lib/schemas/project"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import z from "zod/v4"

export function ProjectsList(){
    const {data: projects, isLoading} = useQuery({
        queryKey: ["projects"],
        queryFn: async ()=>{
            const responce =  (await api.projects.get()).data as (z.infer<typeof projectsSchema> & { id: string })[]
            console.log(!isLoading ? responce : "",'<---------------------------------dsdsdsd')
            return responce
        },
        placeholderData: keepPreviousData,
    })
    return(
        <div>
            {isLoading && <p className="text-4xl color-gray-200 mt-50">Данные загружаются ...</p>} 
            <div>
                {
                    !isLoading ? projects?.map((item)=>
                        <div key = {item.id} className="p-5 w-200px m-5 bg-blue-200">
                            <p>{item.name}</p>
                            <p>{item.stage}</p>
                            <p>{item.startDate.toLocaleDateString()}</p>
                        </div>
                    )
                    : <div></div>
                }
            </div>
        </div>
    )
}