

"use client"
import { api } from "@/lib/client/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Specialization } from "@/lib/types/specialization";
import { Spinner } from "./spinner";
import { vacancyFormSchema, vacancySchema } from "@/lib/schemas/vacancies";
import z from "zod/v4";
import { toast } from "sonner";
import { queryClient } from "@/lib/client/query-client";
import { useForm } from "@tanstack/react-form";
import Vacancy2 from "./vacancy2";

export default function VacanciesFormUpdate({specialization,projectId}: { specialization: Specialization[],  projectId: string}){


    const {data: vacancies, isLoading} = useQuery({
        queryKey: ["vacancies", projectId],
        queryFn: async () =>{
            return (await api.vacancies["projects"]({projectId: projectId}).get()).data
        }
    })


    const createMutation = useMutation({
        mutationKey: ["createVacancies"],
        mutationFn: async(data: z.infer<typeof vacancySchema>)=>{
            const response = await api.vacancies.post(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: ()=>{
            form.reset()
            toast.success("Вакансия создана")
            queryClient.invalidateQueries({
                queryKey:["vacancies",projectId]
            })
            setOpen(!open)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка создания вакансии:
                 ${err.message || err.name}`)
        }
    })


    const form = useForm({
        defaultValues: {} as z.infer<typeof vacancyFormSchema>,
        onSubmit: async ({value}) =>{
            console.log('Submitting vacancy with value:', value, 'projectId:', projectId);
            await createMutation.mutate({ ...value, projectId })
        },
        validators:{
            onSubmit: vacancyFormSchema,
        }
    })


    


    // const isVacancyValid = () =>{
    //    const hasEmptyFields = Object.values(newVacancy).some(value => !value.trim());
    //    if(hasEmptyFields){
    //     return false
    //    }else{
    //     return true
    //    }
    // }

    const [open, setOpen] = useState(false)
        
       
        
                
    return(
        
            <div className="flex flex-col gap-3">
                <p className="text-center font-medium">Вакансии</p>
                <div className="flex flex-col gap-2 justify-center items-center">
                    {
                        isLoading && <Spinner/>
                    }
                    {
                        vacancies && vacancies.length > 0 ? 

                        vacancies.map((item)=>(
                            <Vacancy2 key={item.id} item={item}/>
                        ))

                        : <div></div>
                    } 
                    

                    
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button type="button" className="flex shrink-0 w-fit h-fit p-2 justify-center items-center p-2 border rounded-[100%]">
                                <Plus width={18} height={18} />
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>Создание вакансии</DialogHeader>

                        
                        <form className="flex flex-col gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                        >
                            <form.Field name='name'>
                                {(field)=>(
                                            <div>
                                        <p>Специальность</p>
                                        <Select required onValueChange={(value)=>{field.handleChange(value)}}
                                             value={field.state.value}
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
                                        {field.state.meta.errors.map((err,index)=><p className="text-red-500" key={index}>{err?.message}</p>)}
                                    </div>
                                )}
                            </form.Field>


                            <form.Field name="city">
                                {(field)=>(
                                    <div>
                                        <p>Город</p>
                                        <Input className="mt-2" required placeholder="Город" 
                                        value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)} 
                                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="description">
                                {(field)=>(
                                    <div>
                                        <p>Описание</p>
                                        <Textarea className="mt-2 resize-none" required placeholder="Описание" 
                                        value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}
                                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))} />
                                    </div>
                                )}
                            </form.Field>
                            

                            <form.Subscribe>
                                {(state)=>{
                                    console.log('canSubmit:', state.canSubmit, 'isDirty:', state.isDirty, 'errors:', state.errors);
                                    return(
                                        <div className="flex gap-5 justify-center">
                                            <Button type="button" variant="outline"
                                                onClick={() => {setOpen(false); form.reset()}}>Отмена</Button>
                                            <Button type="submit"
                                                disabled = {!state.isDirty || createMutation.isPending}>Добавить</Button>  
                                        </div>
                                    )
                                    
                                }}
                            </form.Subscribe>

                        </form>

                        

                        </DialogContent>
                    </Dialog>
                    </div>
                </div>
                                   
    
    )
                                    
}