"use client"
import { Projects } from "@/lib/types/projects";
import { Star,CalendarDays, Dot } from "lucide-react";
import { Separator } from "./separator";
import { stageLabels } from "@/lib/schemas/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import Link from "next/link";
import DeleteProjects from "@/app/profile/my-projects/delete";
import { UpdateProjects } from "@/app/profile/my-projects/update";
import VacancyCard from "./vacansy-card";
import { useState } from "react";
import { Spinner } from "./spinner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client/api";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./avatar";
import { authClient } from "@/lib/client/auth-client";

export default function ProjectsProfileCard({item, isFavorite, toggle}:
    {item: Projects, isFavorite: boolean,toggle: (projectId: string, isFavorite: boolean) => void}){
    const imgUrl = "http://localhost:3000/api/files/"
    console.log(item)
   const handleClick = (e: React.MouseEvent)=>{
        e.stopPropagation() 
        toggle(item.id, isFavorite)
    }   

    const {data: session, isPending, error} = authClient.useSession()

    const {data: vacancies, isLoading} = useQuery({
        queryKey: ["vacancies", item.id],
        queryFn: async () =>{
            return (await api.vacancies["projects"]({projectId: item.id}).get()).data
        }
    })
    


    const [open,setOpen] = useState(false)
    const [open2,setOpen2] = useState(false)


    const {data: members} = useQuery({
        queryKey: ["project-members",item.id],
        queryFn: async () => {
            return (await api.applications.members({id: item.id}).get()).data
        },
        enabled: !!item.id
    })

    const initials = (name: string, lastName: string)=>{
        return `${name.slice(0,1).toUpperCase()}${lastName.slice(0,1).toUpperCase()}`
    }  
    const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);

    return(
        

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative w-[300px] h-[300px] bg-white-component border-gray-border border shadow-custom2 rounded-[16px] text-tBlack-main">
                    <img className = "w-full h-[180px] object-cover rounded-t-[16px]" src={imgUrl+item.image} 
                        onError={(e)=>e.currentTarget.src = "/img/noImage.png"} alt="project image" 
                         ref={(el) => {
                            if (el && el.complete && el.naturalWidth === 0) {
                                el.src = "/img/noImage.png";
                            }
                        }}
                    />
            
                    <div className="p-4  flex flex-col gap-4 ">
                        <div className="flex flex-col gap-[6px] relative">
                            <div className="flex justify-between">
                                <h3 className="text-base">{item.name}</h3>
                                <Star onClick={handleClick} className={`${isFavorite ? "fill-yellow-400 text-yellow-400" : ""} cursor-pointer`}/>
                            </div>
    
                           
                        </div>
                        <Separator/>
                        <div className="flex gap-2 items-center">
                            <div className="flex gap-1 bg-gray-border px-[6px] py-1 rounded-[12px]">
                                <CalendarDays width={18} height={18}/>
                                <p className="text-[14px]">{item.startDate.toLocaleDateString()}</p>    
                            </div>
                            <div className="bg-gray-border px-[6px] py-1 rounded-[12px] text-[14px] ">{stageLabels[item.stage!]}</div>
                        </div>
                    </div>


                    <div className="absolute top-0 right-0 rounded-[16px] rounded-br-[0px] rounded-tl-[0px] border border-[#ECEDEE66] bg-[#1C1C1C66] backdrop-blur-[10px] text-[14px] text-tWhite-main px-[6px] py-1 ">{item.industries.name}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-lightGray-component !p-0 md:!max-w-155 !max-w-[398px]">
                <DialogHeader className="p-4 pb-0 ">
                    <DialogTitle>Просмотр стартапа</DialogTitle>
                </DialogHeader>
                <img className = "w-full h-[256px] object-cover " src={imgUrl+item.image} 
                onError={(e)=>{e.currentTarget.src = "/img/noImage.png"
                    e.currentTarget.className="w-full h-[256px] object-fill"
                }} alt="project image" 
                />
                
                    
                <div className="p-4 pt-0 flex flex-col gap-1 md:gap-4 text-tBlack-main">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-medium ">{item.name}</h3>
                        <Star onClick={handleClick} className={`${isFavorite ? "fill-yellow-400 text-yellow-400" : ""} cursor-pointer`}/>
                    </div>
                    {members && members.length > 0 &&(
                        <AvatarGroup>
                        {members.map((mem)=>(
                            <Avatar key = {mem?.id} size="lg">
                                <AvatarImage src={mem?.image ? `${imgUrl+mem.image}` : ""} alt="avatar" />
                                    <AvatarFallback>{initials(mem!.name,mem!.lastName)}</AvatarFallback>
                            </Avatar>
                            
                        ))}
                         <AvatarGroupCount>+1</AvatarGroupCount>
                        </AvatarGroup> 
                        )} 
                    <div>
                        <p className="text-base font-medium">Описание</p>
                        <p className="h-fit line-clamp-5 md:line-clamp-4 text-[14px] md:text-base font-normal text-tGray-sub mt-1">{item.description} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro esse, modi blanditiis mollitia necessitatibus, fugit maiores consequatur earum placeat veniam facere! Hic soluta voluptatem sint ut ducimus nulla distinctio corrupti?</p>
                    </div>
                           
                        
                    <div className="text-base font-normal text-tGray-sub">
                        <p className="flex"><Dot className="block md:hidden"/>Стадия проекта: <span className="text-black">{stageLabels[item.stage!]}</span></p>
                        <p className="flex"><Dot className="block md:hidden"/>Проект: <Link href={item.linkProject} className="text-[#0B76FA] underline">{item.linkProject}</Link></p>
                        <p className="flex"><Dot className="block md:hidden"/>Дата начала: <span className="text-black">{item.startDate.toLocaleDateString()}</span></p>
                    </div>
                    


                    <Dialog open={open2} onOpenChange={setOpen2}>
                        <DialogTrigger asChild>
                            <div className="flex justify-center p-2 md:py-10">
                                <Button className="bg-black-component h-[45px] px-4 py-3 text-tWhite-main ">Смотреть вакансии</Button>
                            </div>
                        </DialogTrigger>

                        <DialogContent className="md:!max-w-155 !:max-w-[398px] min-h-[256px] ">
                            <DialogHeader>
                                <DialogTitle>Просмотр вакансий</DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col justify-between items-between">
                                {
                                    isLoading && <Spinner/>
                                }

                                {
                                    vacancies && vacancies.length > 0 ? 
            
                                    <>
                                        <div className="flex gap-4 flex-wrap">
                                            { vacancies.map((item)=>(
                                                <VacancyCard key={item.id} vac={item} isSelected={selectedVacancyId === item.id}
                                                    onSelect={() => setSelectedVacancyId(item.id)}/>
                                            ))}
                                            
                                        </div>
                                        <div className="flex items-end justify-end gap-4 shrink-0 text-base">
                                                    <Button className="mt-3 h-[45px] w-[82px] text-base" variant={"outline"} onClick={()=>setOpen2(!open)}>Назад</Button>
                                                    {/* <Button className=" h-[45px] w-[135px] text-base" >Откликнутся</Button> */}
                                            </div>
                                    </>
            
                                    : <div className="flex justify-center items-center text-xl text-tBlack-main">Вакансий нет</div>

                                }
                                
                                
                            </div>
                            
                        </DialogContent>
                    </Dialog>
                    

                    <div className="flex gap-5 justify-center">
                        <UpdateProjects projects = {item}/>
                        <DeleteProjects project={item}/>
                    </div>
                
                </div>
                    
                        
                        
                
            </DialogContent>
        </Dialog>
    )
}