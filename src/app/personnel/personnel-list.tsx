"use client"
import PersonnelCard from "@/components/ui/personnel-card";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { FavoritePersonnel } from "@/lib/types/favorite";
import { Personnel } from "@/lib/types/personnel";
import { Projects } from "@/lib/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

type filter = {
    category?: string;
    specializate?: string;
    search?: string;
  };

export default function PersonnelList({initialData,favorite,filters,myProjects}:
    {initialData: Personnel[], favorite: FavoritePersonnel[],filters: filter, myProjects: Projects[]}){
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

    const  {data: MyProjects} = useQuery({
        queryKey: ["my-projects"],
        queryFn: async () =>{
            return (await api.projects["my-projects"].get()).data
        },
        initialData: myProjects
    })

    // const personnel = favorites?.map((item)=>item.personnel)

    const filtredPersonnel = useMemo(()=>{
            if(!personnel) return []
            
            return personnel.filter((item)=>{
                if (filters.category && item.categories?.id !== filters.category) {
            return false;
            }
            
            if (filters.specializate && item.specialization?.id !== filters.specializate) {
                return false;
            }
    
            if (filters.search) {
                const query = filters.search.toLowerCase();
                const education = item.education?.toLowerCase().includes(query);
                const resume = item.shortResume?.toLowerCase().includes(query);
                if (!education && !resume) {
                    return false;
                        }
                }
            return true;
    
            })
        },[personnel,filters])



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
        <div className={`h-fit flex-1 shrink-0 py-12 flex gap-6 flex-wrap justify-center ${filtredPersonnel.length > 0 ? "xl:justify-start": "xl:justify-center" }`}>
            {filtredPersonnel.length > 0 ? filtredPersonnel?.map((item)=>(
                <PersonnelCard key={item!.id} item={item} toggle = {handleToggle} isFavorite = {favoriteId.has(item.id)} myProjects={MyProjects!}/>
            ))
            :
            <div className="h-[408px] flex flex-1 items-center justify-center">Ничего не найдено по заданным параметрам.</div>    
        }
        </div>
    )
}