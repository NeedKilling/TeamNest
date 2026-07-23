"use client"
import { api } from "@/lib/client/api"
import { Projects } from "@/lib/types/projects"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FavoritePersonnel, FavoriteProjects } from "@/lib/types/favorite"
import { queryClient } from "@/lib/client/query-client"
import { toast } from "sonner"
import { Personnel } from "@/lib/types/personnel"
import PersonnelCard from "@/components/ui/personnel-card"

export default function FavoritePersonneList({initialData, favorite,MyProjects}: {initialData: Personnel[],favorite: FavoritePersonnel[],MyProjects: Projects[]}){

        const {data: favorites} = useQuery({
                queryKey: ["favoritesPersonnel"],
                queryFn: async ()=>{
                    return (await api.favoritePersonnel.get()).data
                },
                initialData: favorite,
            })
        console.log(favorites)
        const personnels = favorites?.map((item)=>item.personnel)


        const  {data: myProjects} = useQuery({
                queryKey: ["my-projects"],
                queryFn: async () =>{
                    return (await api.projects["my-projects"].get()).data
                },
                initialData: MyProjects
            })


        const favoriteId = new Set(favorites?.map((item)=>item.personnelId) || [])
            const toggleMutation = useMutation({
                mutationKey: ["toggle"],
                mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean })=>{
                    if(!isFavorite){
                        const response = await api.favoritePersonnel.post({id})
                        if (response.error) {
                            const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                            throw new Error(errorMessage);
                        } 
                    }else{
                        const response = await api.favoritePersonnel({id}).delete()
                        if (response.error) {
                            const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                            throw new Error(errorMessage);
                        } 
                    }
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["favoritesPersonnel"]
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
        <div className="lg:grid lg:grid-cols-3 lg:gap-10  flex flex-col gap-5  md:flex-row md:flex-wrap md:justify-center">
            { personnels?.length ?? 0 > 0 ? 
                personnels?.map((item)=>(
                    <PersonnelCard key={item.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)} myProjects={myProjects!}/>
                ))
            
            : 
                <div className="col-span-3 flex flex-col justify-center items-center gap-6 py-10 text-center">
                        <div className="text-2xl font-medium">
                            У вас пока нет кадров в избранном
                        </div>
                </div>
            }
            

            
        </div>
    )
}