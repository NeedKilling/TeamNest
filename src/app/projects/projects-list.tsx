"use client"
import ProjectsCard from "@/components/ui/projects-card";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { FavoriteProjects } from "@/lib/types/favorite";
import { Projects } from "@/lib/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export default function ProjectsList({initialData, favorite}: {initialData: Projects[], favorite: FavoriteProjects[]}){

     const {data: projects} = useQuery({
        queryKey: ["projects"],
        queryFn: async ()=>{
            return (await api.projects.get()).data
        },
        initialData: initialData,
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




    return (
        <div className="py-12 flex gap-6 flex-wrap justify-center">
            {projects?.map((item)=>(
                <ProjectsCard key={item.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)}/>
            ))}
        </div>
    )
}