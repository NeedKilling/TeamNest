"use client"
import PersonnelCard from "@/components/ui/personnel-card";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { FavoritePersonnel } from "@/lib/types/favorite";
import { Personnel } from "@/lib/types/personnel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PersonnelList({initialData,favorite}:{initialData: Personnel[], favorite: FavoritePersonnel[]}){
    const {data: personnel} = useQuery({
        queryKey: ["personnels"],
        queryFn: async ()=>{
            return (await api.personnel["all"].get()).data
        },
        initialData: initialData,
    })

    const {data: favorites} = useQuery({
        queryKey: ["favoritesPersonnel"],
        queryFn: async ()=>{
            return (await api.favoritePersonnel.get()).data
        },
        initialData: favorite,
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


    return (
        <div className="py-12 flex gap-6 flex-wrap justify-center lg:justify-start min-h-[402px]">
            {personnel?.map((item)=>( 
                <PersonnelCard key={item!.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)}/> 
             ))}
        </div>
    )
}