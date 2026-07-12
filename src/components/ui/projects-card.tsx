"use client"
import { Projects } from "@/lib/types/projects";
import { Star,CalendarDays } from "lucide-react";
import { Separator } from "./separator";
import { stageLabels } from "@/lib/schemas/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import Link from "next/link";

export default function ProjectsCard({item}:{item: Projects}){
    const imgUrl = "http://localhost:3000/api/files/"
    
   
    return(
        

        <Dialog >
            <DialogTrigger asChild>
                <div className="relative w-[310px] max-h-[483px] bg-gray-component border border-gray-border rounded-[16px] text-tBlack-main">
                    <img className = "w-full h-[256px] object-fill rounded-t-[16px]" src={imgUrl+item.image} 
                        onError={(e)=>e.currentTarget.src = "/img/noImage.png"} alt="project image" 
                         ref={(el) => {
                            // Хак для кэша браузера: если картинка уже загрузилась с ошибкой (битая)
                            if (el && el.complete && el.naturalWidth === 0) {
                                el.src = "/img/noImage.png";
                            }
                        }}
                    />
            
                    <div className="p-4  flex flex-col gap-4 ">
                        <div className="flex flex-col gap-[6px] relative">
                            <div className="flex justify-between">
                                <h3 className="text-xl font-medium ">{item.name}</h3>
                                <Star/>
                            </div>
                            <p className="min-h-[96px] line-clamp-4 text-base font-normal text-tGray-sub">{item.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, minima velit commodi vel, officia enim eum ipsum recusandae, sapiente exercitationem fuga in non placeat natus! Debitis, quidem? Voluptatem, quaerat non?</p>
                            <div className="absolute inset-x-0 bottom-0 h-[36px] bg-gradient-to-b from-transparent to-gray-component pointer-events-none" />
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


                    <div className="absolute top-4 right-4 bg-[#1C1C1C66] backdrop-blur-[10px] text-[14px] text-tWhite-main px-[6px] py-1 rounded-[16px]">{item.industries.name}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-lightGray-component !p-0 !max-w-155 ">
                <DialogHeader className="p-4 pb-0 ">
                    <DialogTitle>Просмотр стартапа</DialogTitle>
                </DialogHeader>
                <img className = "w-full h-[256px] object-cover " src={imgUrl+item.image} 
                onError={(e)=>{e.currentTarget.src = "/img/noImage.png"
                    e.currentTarget.className="w-full h-[256px] object-fill"
                }} alt="project image" 
                />
                
                    
                <div className="p-4 pt-0 flex flex-col gap-4 text-tBlack-main">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-medium ">{item.name}</h3>
                        <Star/>
                    </div>
                    <div>
                        <p className="text-base font-medium">Описание</p>
                        <p className="h-fit line-clamp-4 text-base font-normal text-tGray-sub mt-1">{item.description} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro esse, modi blanditiis mollitia necessitatibus, fugit maiores consequatur earum placeat veniam facere! Hic soluta voluptatem sint ut ducimus nulla distinctio corrupti?</p>
                    </div>
                           
                        
                    <div className="text-base font-normal text-tGray-sub">
                        <p >Стадия проекта: <span className="text-black">{stageLabels[item.stage!]}</span></p>
                        <p >Проект: <Link href={item.linkProject} className="text-[#0B76FA] underline">{item.linkProject}</Link></p>
                        <p >Дата начала: <span className="text-black">{item.startDate.toLocaleDateString()}</span></p>
                    </div>
                    

                    <div className="flex justify-end">
                        <Button className="bg-black-component h-[45px] px-4 py-3 text-tWhite-main ">Смотреть вакансии</Button>
                    </div>
                
                </div>
                    
                        
                        
                
            </DialogContent>
        </Dialog>
    )
}