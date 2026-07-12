"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import ImageInput from "@/components/ui/image-input"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/client/api"
import { queryClient } from "@/lib/client/query-client"
import { projectsSchema, stageEnum } from "@/lib/schemas/project"
// import { projectsSchema } from "@/lib/schemas/projects"
import { Projects } from "@/lib/types/projects"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CalendarIcon, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod/v4"
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru"

export function CreateUpdateProjects({projects}: {projects?: Projects}){

    const [isOpen, setIsOpen] = useState(false)
    const [step,setStep] = useState(0)

  



    const createMutation = useMutation({
        mutationKey: ["createProjects"],
        mutationFn: async (data: z.infer<typeof projectsSchema>)=>{
            const response = await api.projects.post(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
            toast.success("Стартап успешно создан")
            form.reset()
            setIsOpen(false)
            setStep(0)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка создания стартапа:
                 ${err.message || err.name}`)
        }
    })


    const updateMutation = useMutation({
        mutationKey: ["updateProjects"],
        mutationFn: async (data: z.infer<typeof projectsSchema>)=>{
            const response = await api.projects({id: projects!.id}).put(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
            toast.success("Стартап успешно обновлен")
            setIsOpen(false)
            setStep(0)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка обновления стартапа:  
                ${err.message || err.name}`)

        }
    })

    const form = useForm({
        defaultValues: {...projects} as z.infer<typeof projectsSchema>,
        onSubmit: async ({value}) =>{
            
            
            if(projects){
                await updateMutation.mutate(value)
            }else{
                await createMutation.mutate(value)
            }
        },
        
        
        validators:{
            onSubmit: projectsSchema,
            // onBlur: projectsSchema
        }
    })


    const {data: industries, isLoading} = useQuery({
        queryKey: ["industries"],
        queryFn: async ()=>{
            return (await api.industries.get()).data
        }
    })
    const stageEnumProjects = stageEnum.options



    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick = {()=>setStep(0)} variant={"outline"}>{projects ? "Редактировать" : "Создать"}</Button>
            </DialogTrigger>
            <DialogContent className = "min-h-85">
                <DialogHeader className="text-center">
                    {projects ? "Обновление стартапа" : "Создание стартапа"}

                    <form.Subscribe>

                        {(state) => {
                            const allErrors = state.errors[0] ? Object.keys(state.errors[0]).length : state.errors[0];
                            
                            if (!allErrors || allErrors === 0) return null;
                            return (
                                <div className="absolute left-4 top-3.5 text-destructive text-sm flex items-center gap-2 px-2 border rounded-xl bg-[rgba(231,0,11,0.2)]">
                                    <TriangleAlert width={16} />
                                    <p className="">{`${allErrors} errors`}</p>
                                </div>
                            );
                        }}
                    </form.Subscribe>


                </DialogHeader>
                <form onSubmit={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    form.handleSubmit()
                }}
                className="flex flex-col justify-between  gap-5"
                >
                    {step === 0 && <>
                        <form.Field name="name"
                            validators={{
                                onChange: projectsSchema.shape.name,
                                onBlur: projectsSchema.shape.name
                            }}
                            >
                            {(field)=>(
                                <div>
                                    <p>Название</p>
                                    <Input required className="mt-2" value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                                    placeholder="Введите Название" 
                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                                    {/* {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)} */}
                                </div>
                                 
                            )}
                        </form.Field>

                        <form.Field name="description"
                            validators={{
                                onChange: projectsSchema.shape.description,
                                onBlur: projectsSchema.shape.description
                            }}
                            >
                            {(field)=>(
                                <div>
                                    <p>Описание</p>
                                    <Textarea required className="mt-2 h-25 resize-none " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}
                                        placeholder="Введите описание стартапа" 
                                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))} />
                                        {/* {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)} */}
                                </div>
                            )}
                        </form.Field>
                    </>}
        

                    {step === 1 && <>
                        <form.Field name="industriesId"
                            validators={{
                                onChange: projectsSchema.shape.industriesId,
                            }}
                        >
                            {(field)=>(
                                <div>
                                    <p>Отрасли стартапа</p>
                                    <Select required onValueChange={(value)=>{field.handleChange(value)}}
                                             value={field.state.value}
                                        >
                                        <SelectTrigger className="w-full mt-2">
                                            <SelectValue placeholder="Выбирите отрасль" />
                                        </SelectTrigger>

                                        <SelectContent >
                                            <SelectGroup >
                                                <SelectLabel>Отрасли</SelectLabel>
                                                
                                                {industries?.map((item)=>(
                                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                ))}
                            
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.map((err,index)=><p className="text-red-500" key={index}>{err?.message}</p>)}
                                </div>
                            )}
                        </form.Field>
                

                        <form.Field name="stage"
                            validators={{
                                    onChange: projectsSchema.shape.stage,
                                    
                                }}>
                            {(field)=>(
                                <div>
                                    <p>Стадии стартапа</p>
                                    <Select required onValueChange={(value)=>{field.handleChange(value as "Idea" | "Realization" | "Completed")}}
                                             value={field.state.value}
                                            >
                                        <SelectTrigger className="w-full mt-2">
                                            <SelectValue placeholder="Выбирите стадию стартапа" />
                                        </SelectTrigger>

                                        <SelectContent >
                                            <SelectGroup >
                                                <SelectLabel>Стадии</SelectLabel>
                                                
                                                {stageEnumProjects?.map((item)=>(
                                                <SelectItem key={item} value={item}>{item}</SelectItem>
                                                ))}
                            
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.map((err,index)=><p className="text-red-500" key={index}>{err?.message}</p>)}
                                </div>
                            )}
                        </form.Field>



                        <form.Field name="startDate"
                            validators={{
                                    onChange: projectsSchema.shape.startDate,
                                   
                                }}>
                            {(field)=>(
                               <div>
                                    <p>Введите дату создания стартапа</p>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!field.state.value}
                                                className="mt-2 w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                                suppressHydrationWarning
                                            >
                                            <CalendarIcon />
                                                {field.state.value ? format(field.state.value, "PPP",{locale: ru}) : <span>Выбирите дату</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar required locale={ru} mode="single" selected={field.state.value} onSelect={(date)=>{
                                                    field.handleChange(date!)}}
                                                    />
                                        </PopoverContent>
                                    </Popover>
                                    {field.state.meta.errors.map((err,index)=><p className="text-red-500" key={index}>{err?.message}</p>)}
                               </div>
                            )}
                        </form.Field>
                    </>}
            

                        

                    {step === 2 &&<>
                        <form.Field name="linkProject"
                        validators={{
                                onChange: projectsSchema.shape.linkProject,
                                onBlur: projectsSchema.shape.linkProject
                            }}>
                            {(field)=>(
                                <div>
                                    <p>Сылка</p>
                                    <Input required className="mt-2" value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}   onBlur={() => field.handleBlur()}
                                    placeholder="Введите сылку на стартап" 
                                    errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>

                                </div>
                            )}
                        </form.Field>
                        
                        <form.Field name="image">
                            {(field)=>(
                                <div>
                                    <p>Загрузите фото</p>
                                    <div className = "flex justify-between gap-5">
                                        <Input className="mt-2" value={field.state.value ?? ""} onChange={(e)=> field.handleChange(e.target.value ?? "")} 
                                            placeholder="Введите id изображения" 
                                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>

                                        <ImageInput onChange={(e)=>field.handleChange(e)}/>
                                    </div>
                                    
                                    
                                    {field.state.meta.errors.map((err,index)=><p className="text-red-500" key={index}>{err?.message}</p>)}
                                </div>
                            )}
                        </form.Field>
                    </>}

                    <div className="flex gap-5 justify-between">
                        <Button type="button" onClick={()=>setStep(step-1)} disabled = {step===0} variant={"outline"}>Назад</Button>
                        <Button className = {`${step === 2 ? "hidden" : "block"}`} type="button" onClick={()=>setStep(step+1)} disabled = {step===2}>Далее</Button>
                    </div>

                    <form.Subscribe>
                        {(state)=>{
                                console.log('canSubmit:', state.canSubmit, 'isDirty:', state.isDirty);
                            return(
                                
                                <>
                                    
                                {step == 2 && <Button className="absolute bottom-4 right-4"  disabled = { !state.canSubmit || createMutation.isPending || updateMutation.isPending || !state.isDirty}>
                                    {projects ? "Обновить" : "Создать"}
                                </Button>}
                                </>
                                
                           
                        )
                        }}
                    </form.Subscribe>

                   
                </form>
            </DialogContent>
        </Dialog>
    )
}