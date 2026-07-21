"use client"
import { api } from "@/lib/client/api"
import { Projects } from "@/lib/types/projects"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FavoriteProjects } from "@/lib/types/favorite"
import { queryClient } from "@/lib/client/query-client"
import { toast } from "sonner"
import FavoriteProjectsCard from "@/components/ui/favorite-projects-card"
export default function FavoriteProjectList({initialData, favorite}: {initialData: Projects[], favorite: FavoriteProjects[]}){

    const {data: favorites} = useQuery({
            queryKey: ["favoritesProjects"],
            queryFn: async ()=>{
                return (await api.favoriteProjects.get()).data
            },
            initialData: favorite,
        })
    console.log(favorites)

    const projects = favorites?.map((item)=>item.project)
    

    
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
                   { projects?.length ?? 0 > 0 ? 
                        projects?.map((item)=>(
                            <FavoriteProjectsCard key={item.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)} />
                        ))
                    
                   : 
                        <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
                                <div className="text-2xl font-medium">
                                    У вас пока нет проектов в избранном
                                </div>
                        </div>
                   }
                   
       
                   
               </div>
    )

}