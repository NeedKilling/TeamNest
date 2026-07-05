"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/client/api"
import { queryClient } from "@/lib/client/query-client"
import { industriesSchema } from "@/lib/schemas/industries"
import { Industries } from "@/lib/types/industries"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod/v4"

export function CreateUpdateIndustries({industries}: {industries?: Industries}){

    const [isOpen, setIsOpen] = useState(false)

    const createMutation = useMutation({
        mutationKey: ["createIndustries"],
        mutationFn: async (data: z.infer<typeof industriesSchema>)=>{
            const response = await api.industries.post(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["industries"]
            })
            toast.success("Отрасль успешно создана")
            form.reset()
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка создания отрасли:  
                ${err.message || err.name}`)

        }
    })


    const updateMutation = useMutation({
        mutationKey: ["updateIndustries"],
        mutationFn: async (data: z.infer<typeof industriesSchema>)=>{
            const response = await api.industries({id: industries!.id}).put(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["industries"]
            })
            toast.success("Отрасль успешно обновлена")
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка обновления отрасли: 
                ${err.message || err.name}`)

        }
    })

    const form = useForm({
        defaultValues: {...industries} as z.infer<typeof industriesSchema>,
        onSubmit: async ({value}) =>{
            if(industries){
                await updateMutation.mutate(value)
            }else{
                await createMutation.mutate(value)
            }
        },
        validators:{
            onSubmit: industriesSchema,
            onChange: industriesSchema,
            onBlur: industriesSchema
        }
    })

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>{industries ? "Редактировать" : "Создать"}</Button>
            </DialogTrigger>
            <DialogContent className="min-h-52">
                <DialogHeader className="text-center">
                    {industries ? "Обновление отрасли" : "Создание отрасли"}
                </DialogHeader>
                <form onSubmit={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    form.handleSubmit()
                }}
                className = "flex flex-col  gap-5 justify-between"
                >
                    <form.Field name="name">
                        {(field)=>(
                            <div>
                                <p>Название</p>
                                <Input className="mt-2" value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                                placeholder="Введите Название" 
                                errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                            </div>
                            
                        )}
                    </form.Field>
                    <form.Subscribe>
                        {(state)=>(
                            <Button disabled = {!state.canSubmit || createMutation.isPending || updateMutation.isPending}>
                                {industries ? "Обновить" : "Создать"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    )
}