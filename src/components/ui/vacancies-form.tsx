
"use client"
import { useState } from "react";
import Vacancy from "./vacansy";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Specialization } from "@/lib/types/specialization";
import { toast } from "sonner";

type Vacancy = { name: string; city: string; description: string };

export default function VacanciesForm({ vacancies, setVacancies , specialization}: { 
  vacancies: Vacancy[]; setVacancies: (v: Vacancy[]) => void, specialization: Specialization[] }){



    // const {data: vacancies} = useQuery({
    //     queryKey: ["vacancies"],
    //     queryFn: async () =>{
    //         return (await api.vacancies["projects"]().get()).data,
    //     }
    // })



        
    const [newVacancy, setNewVacancy] = useState<Vacancy>({ name: "", city: "", description: "" });

    const isVacancyValid = () =>{
       const hasEmptyFields = Object.values(newVacancy).some(value => !value.trim());
       if(hasEmptyFields){
        return false
       }else{
        return true
       }
    }

    const addVacancy = () => {
        if (!newVacancy.name.trim() || !newVacancy.city.trim() || !newVacancy.description.trim()) return false;
        setVacancies([...vacancies, { ...newVacancy }]);
        setNewVacancy({ name: "", city: "", description: "" });
        toast.success("Вакансия создана")
        return true
    };

    const removeVacancy = (index: number) => {
        const updated = [...vacancies];
        updated.splice(index, 1);
        setVacancies(updated);
        toast.success("Вакансия удалена")
    };

    const [open, setOpen] = useState(false)
        
       
        
                
    return(
        
            <div className="flex flex-col gap-3">
                    <p className="text-center font-medium">Вакансии</p>
                    <div className="flex flex-col gap-2 justify-center items-center">
                    
                    {vacancies.map((item, index) => (
                        <Vacancy key={`${item.name}_${index}`} item={item} index={index} removeVacancy = {removeVacancy}/>
                    ))}

                    
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button type="button" className="flex shrink-0 w-fit h-fit p-2 justify-center items-center p-2 border rounded-[100%]">
                                <Plus width={18} height={18} />
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>Создание вакансии</DialogHeader>

                        
                        <div className="flex flex-col gap-3">
                                <div>
                                    <p>Специальность</p>
                                    <Select required onValueChange={(e) => setNewVacancy((prev) => ({ ...prev, name: e ?? ""}))}
                                            value={newVacancy.name}
                                        >
                                        <SelectTrigger className="w-full mt-2">
                                            <SelectValue placeholder="Выбирите специальность" />
                                        </SelectTrigger>

                                        <SelectContent >
                                            <SelectGroup >
                                                <SelectLabel>Специалности</SelectLabel>
                                                
                                                {specialization?.map((item)=>(
                                                <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                                                ))}
                            
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            <div>
                                <p>Город</p>
                                <Input className="mt-2" required placeholder="Город" value={newVacancy.city}
                                    onChange={(e) => setNewVacancy((prev) => ({ ...prev, city: e.target.value ?? ""})) } />
                            </div>
                            <div>
                                <p>Описание</p>
                                <Textarea className="mt-2 resize-none" required placeholder="Описание" value={newVacancy.description}
                                    onChange={(e) => setNewVacancy((prev) => ({ ...prev, description: e.target.value ?? ""}))} />
                            </div>
                        </div>

                        <div className="flex gap-5 justify-center">
                            <Button type="button" variant="outline"
                                onClick={() => {setOpen(false);setNewVacancy({ name: "", city: "", description: "" }); }}>Отмена</Button>
                            <Button  type="button" 
                                onClick={() => { addVacancy() ; setOpen(false)}} disabled={!isVacancyValid()}>Добавить</Button>  
                        </div>

                        </DialogContent>
                    </Dialog>
                    </div>
                </div>
                                   
    
    )
                                    
}