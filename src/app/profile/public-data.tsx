"use client"
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client/api";
import { authClient } from "@/lib/client/auth-client";
import { queryClient } from "@/lib/client/query-client";
import { personnelSchema } from "@/lib/schemas/personnel";
import { Personnel } from "@/lib/types/personnel";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil , X,Plus} from 'lucide-react';

import z from "zod/v4";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";

export function PublicData({initialData}:{initialData: Personnel | null}){

    const {data:session} = authClient.useSession()

    const [editing, setEditing] = useState<Record<string, boolean>>({})

    const addEditing = (name: string) =>{
        if(name in editing){
            setEditing((obj)=>({...obj, [name]: !obj[name]}))
            
        }else{
            setEditing((obj)=>({...obj, [name]:true}))
            
        }
        
    } 



    const {data: personnel} = useQuery({
        queryKey: ["personnel"],
        queryFn: async () =>{
            return (await api.personnel({id: session?.user?.personnelId!}).get()).data
        },
        initialData: initialData
    })


    const updatePersonnel = useMutation({
        mutationKey: ["update_personnel"],
        mutationFn: async (data: z.infer<typeof personnelSchema>)=>{
            const response = await api.personnel({id: personnel!.id}).put(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["personnel"],
            })
            toast.success("Ваши публичные данные успешно обновлены")
            form.reset()
            setEditing({})
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка обновления данных:  
                ${err.message || err.name}`)
            console.log(err.message || err.name)
        }
    })
    
    const form = useForm({
        defaultValues: {...personnel,
            age: personnel?.age ?? 16,
            city: personnel?.city ?? "",
            shortResume: personnel?. shortResume ?? "",
            education: personnel?.education ?? "",
            skills: personnel?.skills ?? [],
            specializationId: personnel?.specializationId ?? "",
            image: personnel?.image ?? "",
            categoriesId: personnel?.categoriesId ?? "",
            telegram: personnel?.telegram ?? "",
            vk: personnel?.vk ?? "",
        } as z.infer<typeof personnelSchema>,
        onSubmit: async ({value}) => {
            await updatePersonnel.mutate(value)
        },
        validators:{
            onSubmit: personnelSchema
        }
    })



   

    



    const {data: categories} = useQuery({
        queryKey: ["categories"],
        queryFn: async ()=>{
            return (await api.categories.get()).data
        }
    })
    const {data: specialization} = useQuery({
        queryKey: ["specialization"],
        queryFn: async ()=>{
            return (await api.specialization.get()).data
        }
    })



    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false)
    
    return(
        <form 
            onSubmit={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="flex flex-col gap-10 py-12"
        >
                <div className="flex xl:justify-between flex-col xl:flex-row gap-5">
                    <div className="xl:grid xl:grid-cols-2  xl:gap-y-5 xl:gap-x-15   flex flex-col gap-5 justify-center items-center">
                            <form.Field name="age">
                                {(field)=>{
                                    const isEdit = editing.age || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                            <p className="">Возраст {isEdit ? "(ред.)" : ""}</p>
                                            
                                            { isEdit ?  
                                                <div className="w-fit relative">
                                                    <Input className="!bg-white-component !text-base w-50 pr-[26px] relative" type={"number"} value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ? Number(e.target.value) : undefined)}  
                                                    placeholder="Введите возраст" 
                                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("age")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit ">
                                                    <div className="!bg-white-component w-50 h-8 text-base rounded-lg border  bg-transparent px-2.5 py-1 text-tGray-sub">{personnel?.age ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("age")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                            <form.Field name="city">
                                {(field)=>{
                                    const isEdit = editing.city || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                            <p>Город {isEdit ? "(ред.)" : ""}</p>
                                            
                                            { isEdit ?  
                                                <div className="w-fit relative">
                                                    <Input className="!bg-white-component !text-base w-50 pr-[26px] relative"  value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ?? undefined)}  
                                                    placeholder="Введите город" 
                                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("city")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit">
                                                    <div className="!bg-white-component w-50 h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-tGray-sub">{personnel?.city ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("city")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                        
                        
                            <form.Field name="categoriesId">
                                {(field)=>{
                                    const isEdit = editing.categoriesId || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                            <p>Категория</p>
                                            
                                            { isEdit ?  
                                                <div className="min-w-50 max-w-fit relative !bg-white-component">
                                                    <Select  onValueChange={(value)=>{field.handleChange(value)}}
                                                            value={field.state.value}
                                                    >
                                                    <SelectTrigger className="w-full text-base">
                                                        <SelectValue placeholder="Выбирите категорию" />
                                                    </SelectTrigger>

                                                    <SelectContent >
                                                        <SelectGroup >
                                                            <SelectLabel>Категории</SelectLabel>
                                                            
                                                            {categories?.map((item)=>(
                                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                            ))}
                                        
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("categoriesId")}><X width={18} height={18} className="relative top-[1px] text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit">
                                                    <div className="!bg-white-component min-w-50 max-w-fit h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-tGray-sub flex items-center">{personnel?.categories?.name ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("categoriesId")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                            <form.Field name="specializationId">
                                {(field)=>{
                                    const isEdit = editing.specializationId || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                            <p>Специалность</p>
                                            
                                            { isEdit ?  
                                                <div className="min-w-50 max-w-fit relative">
                                                    <Select  onValueChange={(value)=>{field.handleChange(value)}}
                                                                value={field.state.value}
                                                        >
                                                        <SelectTrigger className="w-fit !bg-white-component text-base !pl-2">
                                                            <SelectValue placeholder="Выбирите специалность" />
                                                        </SelectTrigger>

                                                        <SelectContent >
                                                            <SelectGroup >
                                                                <SelectLabel>Специальности</SelectLabel>
                                                                
                                                                {specialization?.map((item)=>(
                                                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                                ))}
                                            
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("specializationId")}><X width={18} height={18} className="relative top-[1px] text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit">
                                                    <div className="!bg-white-component min-w-50 max-w-fit h-8 rounded-lg border border-input bg-transparent px-2.5 pr-7 py-1 text-tGray-sub flex items-center">{personnel?.specialization?.name ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("specializationId")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                        
                        
                        
                       
                                <form.Field name="telegram">
                                {(field)=>{
                                    const isEdit = editing.telegram || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                           <div className="flex gap-2 items-center">
                                             <img src="/img/Telegram.png" alt="" />
                                             <p>Телеграмм {isEdit ? "(ред.)" : ""}</p>
                                           </div>
                                            
                                            { isEdit ?  
                                                <div className="w-fit relative">
                                                    <Input className="!bg-white-component !text-base w-50 pr-[26px] relative"  value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ?? undefined)}  
                                                    placeholder="Введите телеграмм" 
                                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("telegram")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit">
                                                    <div className="!bg-white-component w-50 h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-tGray-sub">{personnel?.telegram ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("telegram")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                            <form.Field name="vk">
                                {(field)=>{
                                    const isEdit = editing.vk || false
                                    return(
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 items-center">
                                             <img src="/img/VK.png" alt="" />
                                             <p>VK {isEdit ? "(ред.)" : ""}</p>
                                           </div>
                                            
                                            { isEdit ?  
                                                <div className="w-fit relative">
                                                    <Input className="!bg-white-component !text-base w-50 pr-[26px] relative"  value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ?? undefined)}  
                                                    placeholder="Введите vk" 
                                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("vk")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>

                                                :

                                                <div className="relative w-fit">
                                                    <div className="!bg-white-component w-50 h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-tGray-sub">{personnel?.vk ?? "-"}</div>
                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("vk")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                                </div>
                                            }
                                    
                                        </div>
                                    )
                                    
                                }}
                            </form.Field>
                       
                    </div>





                    <div className="flex flex-col gap-5">
                        <form.Field name="education"
                            validators={{
                                onChange: personnelSchema.shape.education
                            }}
                        >
                            
                            {(field)=>{
                                const isEdit = editing.education || false
                                return(
                                    <div className="flex flex-col gap-2">
                                        <p className="text-center xl:text-start">Образование {isEdit ? "(ред.)" : ""}</p>
                                        
                                        { isEdit ?  
                                            <div className="xl:w-120 relative">
                                                <Textarea className="!bg-white-component !text-base w-full min-h-20  relative resize-none h-fit !pl-2.5 !pr-7"  value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ?? undefined)}  
                                                placeholder="Введите образование" 
                                                errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("education")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                            </div>

                                            :

                                            <div className="relative xl:w-120">
                                                <div className="!bg-white-component w-full min-h-20 rounded-lg border border-input bg-transparent pl-2.5 pr-7  py-2 h-fit text-tGray-sub"><div className="relative  break-words">{personnel?.education ?? "-"}</div></div>
                                                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("education")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                            </div>
                                        }
                                
                                    </div>
                                )
                                
                            }}
                        </form.Field>
                       
                    </div>
                </div>
           
                    <form.Field name="shortResume"
                        validators={{
                            onChange: personnelSchema.shape.shortResume
                        }}
                    >
                            {(field)=>{
                                const isEdit = editing.shortResume || false
                                return(
                                    <div className="xl:w-[1018px] flex flex-col gap-2">
                                        <p className="text-center xl:text-start">Резюме {isEdit ? "(ред.)" : ""}</p>
                                        
                                        { isEdit ?  
                                            <div className="w-full relative">
                                                <Textarea className="!bg-white-component !text-base w-full min-h-20  relative resize-none h-fit !pl-2.5 !pr-7"  value={field.state.value} onChange={(e)=> field.handleChange(e.target.value ?? undefined)}  
                                                placeholder="Введите резюме" 
                                                errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("shortResume")}><X width={18} height={18} className=" text-tGray-sub"/></button>
                                            </div>

                                            :

                                            <div className="relative w-full">
                                                <div className="bg-white-component w-full min-h-20 rounded-lg border border-input bg-transparent pl-2.5 pr-7  py-2 h-fit text-tGray-sub"><div className="relative  break-words">{personnel?.shortResume ?? "-"}</div></div>
                                                <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={()=>addEditing("shortResume")}><Pencil width={18} height={18} className=" text-tGray-sub"/></button>
                                            </div>
                                        }
                                
                                    </div>
                                )
                                
                            }}
                        </form.Field>



                        <form.Field name="skills"
                            validators={{
                                onChange: personnelSchema.shape.skills
                            }}
                            >
                            {(field)=>{
                                const isEdit = editing.skills || false
                                const skills = field.state.value ?? [];

                                const addSkill = () => {
                                    const trimmed = inputValue.trim();
                                    if (!trimmed) return;
                                    if (skills.includes(trimmed)) {
                                        toast.warning('тег уже добавлен');
                                        return false;
                                    }
                                    field.handleChange([...skills, trimmed]);
                                    setInputValue('');
                                    return true
                                };

                                const removeSkill = (id: number) =>{
                                    const newSkills = [...skills]
                                    newSkills.splice(id,1)
                                    field.handleChange(newSkills);
                                }
                                    
                                return(
                                    <div className="flex flex-col gap-2">
                                        <p>Теги/skills</p>
                                        <div className="flex gap-2 break-words xl:w-[1018px] flex-wrap shrink-0">
                                            {skills.length ? 
                                               skills.map((item,index)=>(
                                                <div key={`${item}_${index}`} className="flex justify-between gap-3 items-center pr-2 pl-4 rounded-4xl  bg-gray-border shrink-0 h-9">
                                                   <div >{item}</div>
                                                   <button type={"button"} className="flex justify-center items-center shrink-0" onClick={()=>removeSkill(index)}><X className="text-tGray-sub" width={18} height={18}/></button>
                                                </div>
                                               ))
                                            :
                                            ""
                                            }
                                            

                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <button type={"button"} className="flex justify-center items-center p-2 border rounded-[100%]">
                                                        <Plus width={18} height={18}/>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        {"Создание  тега"}
                                                    </DialogHeader>

                                                    <Input onChange={(e)=>setInputValue(e.target.value)} placeholder="Введите тег" 
                                                     errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}
                                                     />
                                                    <div className="flex gap-5 justify-center">
                                                        <Button type={"button"} variant={"outline"} onClick={()=>setOpen(!open)}>Отмена</Button>
                                                        <Button type={"button"}  onClick={()=>{
                                                            if(addSkill()){
                                                                setOpen(!open)
                                                            }
                                                            }}>Создать</Button>
                                                    </div>

                                                </DialogContent>
                                            </Dialog>
                                            
                                        </div>
                                        
                                
                                    </div>
                                )
                                
                            }}
                        </form.Field>


            <form.Subscribe>
                {(state)=>{
                    return(
                        <div className="flex gap-5 justify-center">
                        <Button type={"button"} variant={"outline"} onClick={()=>{
                            form.reset()
                            setEditing({})
                        }}>Отмена</Button>
                        <Button type={"submit"} disabled={!state.isDirty}>Обновить</Button>
                    </div>
                    )
                }}
            </form.Subscribe>
            
        </form>
    )
}