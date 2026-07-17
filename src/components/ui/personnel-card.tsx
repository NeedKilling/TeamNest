import { Personnel } from "@/lib/types/personnel";
import { Star,CalendarDays,Dot } from "lucide-react";
import { Separator } from "./separator";
import { stageLabels } from "@/lib/schemas/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export default function PersonnelCard({item, isFavorite, toggle}:
    {item: Personnel, isFavorite: boolean,toggle: (projectId: string, isFavorite: boolean) => void}){
    const imgUrl = "http://localhost:3000/api/files/"
   
    const initials = (name: string, lastName: string)=>{
        return `${name.slice(0,1).toUpperCase()}${lastName.slice(0,1).toUpperCase()}`
    }   

    const handleClick = (e: React.MouseEvent)=>{
        e.stopPropagation() 
        toggle(item.id, isFavorite)
    } 

    return(
        
        <Dialog >
            <DialogTrigger asChild>
                <div className="relative w-[310px] h-fit bg-gray-component border border-gray-border rounded-[16px] text-tBlack-main">

                   
            
                    <div className="p-4  flex flex-col gap-4 ">
                        <div className="flex flex-col gap-[6px] relative">
 
                            <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="lg">
                                            <AvatarImage src={item.user?.image ? `${imgUrl+item.user.image}` : "/img/avatar.svg"} 
                                                onError={(e)=>e.currentTarget.src = "/img/avatar.svg"} alt="avatar" 
                                                    ref={(el) => {
                                                        if (el && el.complete && el.naturalWidth === 0) {
                                                        el.src = "/img/avatar.svg";
                                                    }
                                                }}/>
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
            <DialogContent className="bg-lightGray-component !p-0 !max-w-[620px] w-full !min-w-0 overflow-hidden">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle>Просмотр кадра</DialogTitle>
                </DialogHeader>
   
              
                <div className="p-4 pt-0 flex flex-col gap-4 text-tBlack-main w-full max-w-full overflow-hidden">
                    <div className="flex justify-between items-center w-full">
                       
                        <div className="flex items-center gap-2 min-w-0">
                            <Avatar size="lg" className="">
                                <AvatarImage src={imgUrl+item.image} 
                                    onError={(e)=>e.currentTarget.src = "/img/avatar.svg"} alt="avatar" 
                                    ref={(el) => {
                                        if (el && el.complete && el.naturalWidth === 0) {
                                            el.src = "/img/avatar.svg";
                                        }
                                    }}
                                />
                                <AvatarFallback>{initials(item.user.name,item.user.lastName)}</AvatarFallback>
                            </Avatar>
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
                        <p className="text-base text-tGray-sub">{item.shortResume}</p>
                    </div>

                    <div className="flex flex-col gap-1 w-full break-all">
                        <h3 className="text-xl font-medium text-tBlack-main">Образование</h3>
                        <p className="text-base text-tGray-sub">{item.education}</p>
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
                        <Button className="bg-black-component h-[45px] px-4 py-3 text-tWhite-main">
                            Смотреть вакансии
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    
    )
}





   
    
   
