import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/server/api"
import { Search } from 'lucide-react';
import PersonnelList from "./personnel-list";
import { headers as nextHeaders} from "next/headers"

export default async function Personnel(){

    const categories = (await api.categories.get()).data
    const specializations = (await api.specialization.get()).data

    const personnel = (await api.personnel["all"].get()).data


    const favorite = (await api.favoritePersonnel.get({headers: await nextHeaders()})).data
    console.log(favorite)

    return(
       <main className="container w-[1312px] mx-auto">
            <div className="pt-[133px] pb-12 mx-auto text-center">
                <h1 className="text-[56px] font-semibold bg-gradient bg-clip-text text-transparent">Кадры в поиске стартапа</h1>
                <p className="text-xl text-tGray-sub w-170 mx-auto mt-4">Разместите информацию о себе в каталоге — дайте стартапам возможность найти вас и пригласить в команду! Перспективные проекты уже рядом.</p>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Select>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Категория" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                <SelectLabel>Категория</SelectLabel>
                                <SelectItem value={""}>{"Выберите категорию"}</SelectItem>
                                {categories?.map((item)=>(
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
                    <Select>
                        <SelectTrigger className="bg-gray-component min-w-[310px] !h-[44px] py-0 !text-[14px]">
                            <SelectValue placeholder="Специальность" className=""/>
                        </SelectTrigger>

                        {/* <SelectContent position="popper" sideOffset={4} className="} "> */}
                        <SelectContent position="popper" sideOffset={4} className="} ">
                            <SelectGroup>
                                <SelectLabel className="">Специальность</SelectLabel>
                                <SelectItem value={""}>{"Выберите специальность"}</SelectItem>
                                {specializations?.map((item)=>(
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
                
                <div className="relative">
                    <Input className="!text-base bg-gray-component min-w-[310px] !h-[44px] pr-[45px]" placeholder="Поиск специалиста"/>
                    <Search width={20} height={20} className="text-muted-foreground absolute right-[12.5px] top-1/2 -translate-y-1/2"/>                
                </div>
            </div>

            <PersonnelList initialData={personnel!} favorite = {favorite ?? []}/>
       </main>
    )
}