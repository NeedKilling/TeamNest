"use client"

import ProjectsProfileCard from "@/components/ui/projects-profile-card"
import { api } from "@/lib/client/api"
import { Projects } from "@/lib/types/projects"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Divide } from "lucide-react"
import { CreateProjects } from "./create"
import { FavoriteProjects } from "@/lib/types/favorite"
import { queryClient } from "@/lib/client/query-client"
import { toast } from "sonner"

export default function ProjectList({initialData, favorite}: {initialData: Projects[], favorite: FavoriteProjects[]}){
    const  {data: projects} = useQuery({
        queryKey: ["my-projects"],
        queryFn: async () =>{
            return (await api.projects["my-projects"].get()).data
        },
        initialData: initialData
    })
    const {data: favorites} = useQuery({
            queryKey: ["favoritesProjects"],
            queryFn: async ()=>{
                return (await api.favoriteProjects.get()).data
            },
            initialData: favorite,
        })
    
    
        const favoriteId = new Set(favorites?.map((item)=>item.projectId) || [])
        const toggleMutation = useMutation({
            mutationKey: ["toggle"],
            mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean })=>{
                if(!isFavorite){
                    const response = await api.favoriteProjects.post({id})
                    if (response.error) {
                        const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                        throw new Error(errorMessage);
                    } 
                }else{
                    const response = await api.favoriteProjects({id}).delete()
                    if (response.error) {
                        const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                        throw new Error(errorMessage);
                    } 
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["favoritesProjects"]
                })
            },
            onError: (err: Error)=>{
                toast.error(`Ошибка:
                        ${err.message || err.name}`)
            }
        })
    
    
            const handleToggle = (id: string, isFavorite: boolean)=>{
                toggleMutation.mutate({id,isFavorite})
            }
    

    return(
        <div className="grid grid-cols-3 gap-10">
            {projects?.length ? 

                <>
                    {projects.map((item)=>(
                        <ProjectsProfileCard key={item.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)}/>
                    ))}

                    <div className={`  flex justify-center items-center w-[300px] h-[300px]  `}>
                        <CreateProjects />
                    </div>

                </>
            : 
                <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
                        <div className="text-2xl font-medium">
                            У вас пока нет проектов, создайте ваш стартап уже сейчас
                        </div>
                        <div className="flex justify-center items-center w-[300px] h-[300px]">
                            <CreateProjects />
                        </div>
                </div>
            }

            
        </div>
    )
}

