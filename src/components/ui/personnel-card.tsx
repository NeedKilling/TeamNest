"use client"
import { Personnel } from "@/lib/types/personnel";
import { Star,CalendarDays,Dot } from "lucide-react";
import { Separator } from "./separator";
import { stageLabels } from "@/lib/schemas/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Projects } from "@/lib/types/projects";
import { useState } from "react";
import InviteProjects from "./invite-projects";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/client/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/client/query-client";

export default function PersonnelCard({item, isFavorite, toggle,myProjects}:
    {item: Personnel, isFavorite: boolean,toggle: (projectId: string, isFavorite: boolean) => void, myProjects: Projects[]}){
    const imgUrl = "http://localhost:3000/api/files/"
    const [open,setOpen] = useState(false)

    const initials = (name: string, lastName: string)=>{
        return `${name.slice(0,1).toUpperCase()}${lastName.slice(0,1).toUpperCase()}`
    }   

    const handleClick = (e: React.MouseEvent)=>{
        e.stopPropagation() 
        toggle(item.id, isFavorite)
    } 
    console.log(item)


    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const inviteMutate = useMutation({
        mutationKey: ["invite"],
        mutationFn: async ({projectId, userId}:{projectId:string, userId:string})=>{
            const response = await api.applications.post({projectId: projectId, userId:userId})
                if (response.error) {
                    const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                    throw new Error(errorMessage);
                } 
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey:["project-applications"]
            })
            queryClient.invalidateQueries({
                queryKey:["my-applications"]
            })
            toast.success("Приглашение отправлено")
            setOpen(!open)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка:
                    ${err.message || err.name}`)
        }
    })

    const handleInvite = ()=>{
        if(!selectedProjectId){
            toast.warning("Выберите проект")
            return
        }
        inviteMutate.mutate({projectId: selectedProjectId, userId: item.user.id})
    }   


    return(
        
        <Dialog >
            <DialogTrigger asChild>
                <div className="relative shadow-custom3 w-[310px] h-fit bg-gray-component border border-gray-border rounded-[16px] text-tBlack-main">

                   
            
                    <div className="p-4  flex flex-col gap-4 ">
                        <div className="flex flex-col gap-[6px] relative">
 
                            <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="lg">
                                            <AvatarImage src={item.user?.image ? `${imgUrl+item.user.image}` : "/img/avatar.svg"} 
                                            
                                                />
                                            <AvatarFallback>{initials(item.user.name,item.user.lastName)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-base font-medium text-tBlack-main">{item.user.name} {item.user.lastName}</h3>
                                            <p className="text-[14px] text-tGray-sub font-normal">{item.specialization?.name}</p>
                                        </div>
                                    </div>
                                <Star onClick={handleClick} className={`${isFavorite ? "fill-yellow-400 text-yellow-400" : ""} cursor-pointer`}/>
                            </div>
                            


                            <p className="min-h-[96px] line-clamp-4 text-base font-normal text-tGray-sub">{item.shortResume}</p>
                            <div className="absolute inset-x-0 bottom-0 h-[36px] bg-gradient-to-b from-transparent to-gray-component pointer-events-none" />
                        </div>


                        <Separator/>
                        <div className="flex flex-wrap gap-2 items-center overflow-hidden h-[30px]  ">
                            {item.skills?.map((skill,index)=>(
                                <div key={`${skill}_${index}`} className="bg-gray-border px-[6px] py-1 rounded-[12px] text-[14px] whitespace-nowrap ">{skill}</div>
                                ))}
                        </div>
                    </div>

                </div>
            </DialogTrigger>
            <DialogContent className="bg-lightGray-component !p-0 container !max-w-[398px]  md:!max-w-[620px] w-full !min-w-0 overflow-hidden">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle>Просмотр кадра</DialogTitle>
                </DialogHeader>
   
              
                <div className="p-4 pt-0 flex flex-col gap-4 text-tBlack-main w-full max-w-full overflow-hidden">
                    <div className="flex justify-between items-center w-full">
                       
                        <div className="flex items-center gap-2 min-w-0">
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Avatar size="lg" className="">
                                        <AvatarImage src={item.user?.image ? `${imgUrl+item.user.image}` : "/img/avatar.svg"}/> 
                                   
                                        <AvatarFallback>{initials(item.user.name,item.user.lastName)}</AvatarFallback>
                                    </Avatar>
                                </HoverCardTrigger>

                                <HoverCardContent side="top" align="start" className="!bg-[#1c1c1c00] !w-fitt p-0 relative right-6">
                                    <img className="w-[100px] h-[100px] rounded-[100%]" src={item.user?.image ? `${imgUrl+item.user.image}` : "/img/avatar.svg"} alt="avatar" />
                                </HoverCardContent>
                            </HoverCard>
                            
                            <div className="min-w-0">
                                <h3 className="text-base font-medium text-tBlack-main truncate">
                                    {item.user.name} {item.user.lastName}
                                </h3>
                                <p className="text-[14px] text-tGray-sub font-normal truncate">
                                    {item.specialization?.name}
                                </p>
                            </div>
                        </div>
                         <Star onClick={handleClick} className={`${isFavorite ? "fill-yellow-400 text-yellow-400" : ""} cursor-pointer`}/>
                    </div>
                    
                    <div className="flex gap-1 text-base text-tGray-sub flex-wrap">
                        <p className="truncate">{item.city}</p>
                        <Dot className={`${item.city ?? ""}`}/>
                        <p className="">{item.age}</p>
                    </div>

                   
                    <div className="flex flex-col gap-1 w-full break-all">
                        <h3 className="text-xl font-medium text-tBlack-main">Краткое резюме</h3>
                        <p className="text-[14px] md:text-base text-tGray-sub">{item.shortResume}</p>
                    </div>

                    <div className="flex flex-col gap-1 w-full break-all">
                        <h3 className="text-xl font-medium text-tBlack-main">Образование</h3>
                        <p className="text-[14px] md:text-base text-tGray-sub">{item.education}</p>
                    </div>
                    
                    <Separator/>
                  
                    <div className="flex flex-wrap gap-2 items-center overflow-hidden w-full break-all text-wrap">
                        {item.skills?.map((skill, index) => (
                            <div 
                                key={`${skill}_${index}`} 
                                className="bg-gray-border px-[6px] py-1 rounded-[12px] text-[16px]   truncate"
                            >
                                {skill}
                            </div>

                            
                        ))}
                    </div>
                    
                   

                    <Separator className={`${item.skills?.length ? "" : "hidden"}`}/>

                    <div className="flex flex-col gap-5">
                        <div className={`flex gap-1 items-center ${item.telegram || "hidden"}`}>
                            <img className="w-6 " src="/img/Telegram.png" alt="" />
                            <p className="text-base text-tBlack-main">Telegram:</p>
                            <Link className="underline text-[#0B76FA]" href={`${item.telegram}`}>{item.telegram}</Link>
                        </div>

                        <div className={`flex gap-1 items-center ${item.vk || "hidden"}`}>
                            <img className="w-6 " src="/img/VK.png" alt="" />
                            <p className="text-base text-tBlack-main">Telegram:</p>
                            <Link className="underline text-[#0B76FA]" href={`${item.vk}`}>{item.vk}</Link>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-black-component h-[45px] px-4 py-3 text-tWhite-main">
                                    Пригласить в проект
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={` min-h-[256px] max-h-[800px] 
                                  ${myProjects && myProjects.length>4 ? "md:!max-w-[1300px] md:!min-w-155 max-w-[398px] " : "container w-[400px] md:w-full !max-w-155"}`}>
                                <DialogHeader>
                                    <DialogTitle>Просмотр кадра</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-5 justify-between items-between">
                                    {myProjects && myProjects.length  > 0 ? 
                                    <>
                                        <div className="flex gap-5 md:gap-4 flex-wrap">
                                            {myProjects.map((proj,index)=>(
                                                <InviteProjects key = {`${proj}_${index}`} project={proj}
                                                    isSelected={selectedProjectId === proj.id}
                                                    onSelect={() => setSelectedProjectId(proj.id)}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between md:items-end md:justify-end gap-4 shrink-0 text-base">
                                            <Button className=" h-[45px] w-[82px] text-base" variant={"outline"} onClick={()=>{setOpen(!open), setSelectedProjectId(null)}}>Назад</Button>
                                            <Button className=" h-[45px] w-fit text-base" onClick={handleInvite} disabled={!selectedProjectId} >Пригласить в проект</Button>
                                        </div>
                                    </>
                                    :
                                        <div className="flex justify-center items-center text-xl text-tBlack-main gap-2">У вас пока еще нет своих проектов <Link className="underline hover:text-tGray-sub"href="/profile/my-projects">создать?</Link></div>
                                    }
                            </div>

                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    
    )
}





   
    
   
