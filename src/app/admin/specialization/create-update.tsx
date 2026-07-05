"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/client/api"
import { queryClient } from "@/lib/client/query-client"
import { specializationSchema } from "@/lib/schemas/specialization"
import { Specialization } from "@/lib/types/specialization"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod/v4"

export function CreateUpdateSpecialization({specialization}: {specialization?: Specialization}){

    const [isOpen, setIsOpen] = useState(false)

    const createMutation = useMutation({
        mutationKey: ["createSpecialization"],
        mutationFn: async (data: z.infer<typeof specializationSchema>)=>{
            const response = await api.specialization.post(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["specialization"]
            })
            toast.success("Специальность успешно создана")
            form.reset()
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка создания специальности:
                 ${err.message || err.name}`)
        }
    })


    const updateMutation = useMutation({
        mutationKey: ["updateSpecialization"],
        mutationFn: async (data: z.infer<typeof specializationSchema>)=>{
            const response = await api.specialization({id: specialization!.id}).put(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["specialization"]
            })
            toast.success("Специальность успешно обновлена")
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка обновления специальности:
                 ${err.message || err.name}`)
        }
    })

    const form = useForm({
        defaultValues: {...specialization} as z.infer<typeof specializationSchema>,
        onSubmit: async ({value}) =>{
            if(specialization){
                await updateMutation.mutate(value)
            }else{
                await createMutation.mutate(value)
            }
        },
        validators:{
            onSubmit: specializationSchema,
            onChange: specializationSchema,
            onBlur: specializationSchema
        }
    })

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>{specialization ? "Редактировать" : "Создать"}</Button>
            </DialogTrigger>
            <DialogContent className="min-h-52">
                <DialogHeader className="text-center">
                    {specialization ? "Обновление специальности" : "Создание специальности"}
                </DialogHeader>
                <form onSubmit={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    form.handleSubmit()
                }}
                    className="flex flex-col gap-5 justify-between"
                >
                    <form.Field name="name">
                        {(field)=>(
                            <div className="flex flex-col gap-2 ">
                                <p>Название</p>
                                <Input className = "" value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)} 
                                placeholder="Введите Название" 
                                errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                            </div>
                            
                        )}
                    </form.Field>
                    <form.Subscribe>
                        {(state)=>(
                            <Button disabled = {!state.canSubmit || createMutation.isPending || updateMutation.isPending}>
                                {specialization ? "Обновить" : "Создать"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    )
}