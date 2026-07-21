"use client"
import { Search } from 'lucide-react';
import PersonnelList from "./personnel-list";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Categories } from '@/lib/types/categories';
import { Specialization } from '@/lib/types/specialization';
import { Personnel } from '@/lib/types/personnel';
import { FavoritePersonnel } from '@/lib/types/favorite';
import { useState } from 'react';
import { Projects } from '@/lib/types/projects';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/client/api';


export default function PersonnelClient({categories,specializations,personnel,favorite,MyProjects}:
    {categories:Categories[],specializations: Specialization[],personnel:Personnel[],favorite:FavoritePersonnel[],MyProjects: Projects[]}
){  

    const [category, setCategory] = useState<string>("")
    const [specializate, setSpecializate] = useState<string>("")
    const [search, setSearch] = useState<string>("")

    // const handleIndustryChange = (value: string) => setCategory(value);
    // const handleStageChange = (value: string) => setspecializate(value);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

    const  {data: myProjects} = useQuery({
        queryKey: ["my-projects"],
        queryFn: async () =>{
            return (await api.projects["my-projects"].get()).data
        },
        initialData: MyProjects
    })

    return(
        <main className="container w-[1312px] mx-auto">
            <div className="pt-[133px] pb-12 mx-auto text-center">
                <h1 className="text-[56px] font-semibold bg-gradient bg-clip-text text-transparent">Кадры в поиске стартапа</h1>
                <p className="text-xl text-tGray-sub w-170 mx-auto mt-4">Разместите информацию о себе в каталоге — дайте стартапам возможность найти вас и пригласить в команду! Перспективные проекты уже рядом.</p>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Категория" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                {/* <SelectLabel>Категория</SelectLabel> */}
                                <SelectItem className="bg-gray-component" value={""}>{"Все категории"}</SelectItem>
                                {categories?.map((item)=>(
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
                    <Select value={specializate} onValueChange={setSpecializate}>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Специальность" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                {/* <SelectLabel className="">Специальность</SelectLabel> */}
                                <SelectItem className="bg-gray-component" value={""}>{"Все специальности"}</SelectItem>
                                {specializations?.map((item)=>(
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
                
                <div className="relative">
                    <Input className="!text-base bg-gray-component min-w-[310px] !h-[44px] pr-[45px]" placeholder="Поиск специалиста"
                     value={search} onChange={handleSearchChange} />
                    <Search width={20} height={20} className="text-muted-foreground absolute right-[12.5px] top-1/2 -translate-y-1/2"/>                
                </div>
            </div>

            <PersonnelList initialData={personnel!} favorite = {favorite ?? []} filters={{category,specializate,search}} myProjects = {myProjects ?? []}/>
       </main>
    )
}