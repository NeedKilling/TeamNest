"use client"
import ProjectsCard from "@/components/ui/projects-card";
import { api } from "@/lib/client/api";
import { Projects } from "@/lib/types/projects";
import { useQuery } from "@tanstack/react-query";


export default function ProjectsList({initialData}: {initialData: Projects[]}){

     const {data: projects} = useQuery({
        queryKey: ["projects"],
        queryFn: async ()=>{
            return (await api.projects.get()).data
        },
        initialData: initialData,
    })

    return (
        <div className="py-12 flex gap-6 flex-wrap">
            {projects?.map((item)=>(
                <ProjectsCard key={item.id} item={item}/>
            ))}
        </div>
    )
}