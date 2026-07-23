"use client"
import { MyApplications, ProjectApplicationsData } from "@/lib/types/applications";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Badge } from "./badge";
import { applicationSchema, Status, statusEnum, statusLabels } from "@/lib/schemas/applications";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { toast } from "sonner";
import z from "zod/v4";


export default function MyInvitationsCard({item}: {item: ProjectApplicationsData}){
    const imgUrl = "/api/files/"
    const initials = (name: string, lastName: string)=>{
        return `${name.slice(0,1).toUpperCase()}${lastName.slice(0,1).toUpperCase()}`
    }   

    const statusClass = (status:string)=>{
        if(status == "pending"){
            return "bg-bgPending text-textPending border-borderPending"
        }
        if(status == "accepted"){
            return "bg-bgAccepted text-textAccepted border-borderAccepted"
        }
        if(status == "rejected"){
            return "bg-bgRejected text-textRejected border-borderRejected"
        }
    }

    const updateStatusMutation = useMutation({
        mutationKey: ["updateStatus"],
        mutationFn: async ({ status }: { status: Status })=>{
            const response = await api.applications({ id: item.id }).put({status})
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },  
        onSuccess: () => {
               queryClient.invalidateQueries({
                    queryKey:["project-applications"]
                })
                queryClient.invalidateQueries({
                    queryKey:["my-applications"]
                })
                queryClient.invalidateQueries({
                    queryKey: ["project-members"]
                })
                
                toast.success("Статус обновлен")
                
            },
            onError: (err: Error)=>{
                toast.error(`Ошибка обновления стуса:
                        ${err.message || err.name}`)
            }
    })

    return(
       <div className="mx-auto md:mx-0 relative w-[310px] h-fit bg-gray-component border border-gray-border rounded-[16px] text-tBlack-main shadow-custom3">
            <div className="p-4  flex flex-col gap-4 ">
                    
                <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar size="lg">
                                <AvatarImage src={item.user?.image ? `${imgUrl+item.user.image}` : "/img/avatar.svg"}/>
                            </Avatar>
                            <div>
                                <h3 className="text-base font-medium text-tBlack-main">{item.user?.name} {item.user?.lastName}</h3>
                                <p className="text-[14px] text-tGray-sub font-normal">{item.user?.personnel.specialization?.name}</p>
                            </div>
                        </div>

                        
                </div>
                <Badge className={`!h-[26px] text-[14px] ${statusClass(item.status)}`}>{statusLabels[item.status]}</Badge>

                <div>
                    <div className="flex gap-2">
                        <p className="text-[14px] text-tGray-sub">Проект:</p>
                        <p className="text-base text-tBlack-main">{item.project.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-[14px] text-tGray-sub">Отрасль:</p>
                        <p className="text-base text-tBlack-main">{item.project.industries.name}</p>
                    </div>
                    {item.vacancy && (<div className="flex gap-2">
                        <p className="text-[14px] text-tGray-sub">Вакансия:</p>
                        <p className="text-base text-tBlack-main">{item.vacancy?.name}</p>
                    </div>)}
                </div>

                <div  className="flex gap-2">
                    <p className="text-[14px] text-tGray-sub">{item.vacancy ? "Отклик от: " : "Приглашение от: "}</p>
                    <p className="text-[14px] text-tBlack-main">{item.createdAt.toLocaleDateString("ru-RU", { timeZone: "UTC" })}</p>
                </div>
                
                {item.status =="pending" && (
                    <div className="flex justify-between">
                        <Button className="bg-bgAccepted text-textAccepted border-borderAccepted hover:bg-borderAccepted" onClick={()=>updateStatusMutation.mutate({ status: "accepted" })}>Принять</Button>
                        <Button className="border-borderRejected border" variant={"destructive"} onClick={()=>updateStatusMutation.mutate({ status: "rejected" })}>Отклонить</Button>
                    </div>)
                }
            </div>
        </div>
    )
}