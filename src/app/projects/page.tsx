import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stage, stageLabels } from "@/lib/schemas/project";

import { api } from "@/server/api";
import { Search } from "lucide-react";
import ProjectsList from "./projects-list";
import { headers as nextHeaders} from "next/headers"

export default async function Projects(){
    


    const projects = (await api.projects.get()).data 

    const industries = (await api.industries.get()).data
    
    const favorite = (await api.favoriteProjects.get({headers: await nextHeaders()})).data
    console.log(favorite)

    return(
        <main className="container w-[1312px] mx-auto">
            <div className="pt-[133px] pb-12 mx-auto text-center">
                <h1 className="text-[56px] font-semibold bg-gradient bg-clip-text text-transparent">Стартапы в поисках команды</h1>
                <p className="text-xl text-tGray-sub w-170 mx-auto mt-4">Если вы ищете человека в команду, разместите информацию о вашем проекте в каталоге, чтобы её смогли найти соискатели</p>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Select>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Все отрасли" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                <SelectLabel>Отрасль</SelectLabel>
                                <SelectItem value={""}>{"Выберите Отрасль"}</SelectItem>
                                {industries?.map((item)=>(
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
                    <Select>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Все стадии" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                <SelectLabel className="">Стадии</SelectLabel>
                                <SelectItem value={""}>{"Выберите стадию"}</SelectItem>
                                {(Object.entries(stageLabels) as [Stage, string][]).map(([key, value], index) => (
                                    <SelectItem key={index} value={key}>{value} </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
                
                <div className="relative">
                    <Input className="!text-base bg-gray-component min-w-[310px] !h-[44px] pr-[45px]" placeholder="Поиск проектов"/>
                    <Search width={20} height={20} className="text-muted-foreground absolute right-[12.5px] top-1/2 -translate-y-1/2"/>                
                </div>
            </div>

            <ProjectsList initialData={projects!} favorite = {favorite ?? []}/>
       </main>
    )
}