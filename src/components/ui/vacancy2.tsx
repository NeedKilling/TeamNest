"use client"
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Vacancy } from "@/lib/types/vacancy"
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react"
import { toast } from "sonner";


export default function Vacancy2({item}:{item:Vacancy}){

    const deleteMutation = useMutation({
        mutationKey: ["deleteVacancies"],
        mutationFn: async ()=>{
            const response = await api.vacancies({ id: item.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["vacancies"]
            })
            toast.success("Вакансия успешно удалёна")
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка удаления :
                    ${err.message || err.name}`)
        }
        })

    return(
        <div  className="w-full flex py-2 justify-between gap-3 items-center pl-4 rounded-4xl bg-gray-border shrink-0 relative pr-8">
        <div>{item.name}</div>
        <div>{item.city}</div>
            <button type="button" className="flex justify-center items-center shrink-0 absolute right-2" onClick={() =>deleteMutation.mutate() }>
                <X className="text-tGray-sub" width={18} height={18} />
            </button>
        </div>
    )
}