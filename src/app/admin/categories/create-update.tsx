"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/client/api"
import { queryClient } from "@/lib/client/query-client"
import { categoriesSchema } from "@/lib/schemas/categories"
import { Categories } from "@/lib/types/categories"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod/v4"

export function CreateUpdateCategories({categories}: {categories?: Categories}){

    const [isOpen, setIsOpen] = useState(false)

    const createMutation = useMutation({
        mutationKey: ["createCategories"],
        mutationFn: async (data: z.infer<typeof categoriesSchema>)=>{
            const response = await api.categories.post(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
            toast.success("Категория успешно создана")
            form.reset()
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка создания категории:
                    ${err.message || err.name}`)
            }
    })
    


    const updateMutation = useMutation({
        mutationKey: ["updateCategories"],
        mutationFn: async (data: z.infer<typeof categoriesSchema>)=>{
            const response = await api.categories({id: categories!.id}).put(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
            toast.success("Категория успешно обновлена")
            setIsOpen(false)
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка обновления категории:
                 ${err.message || err.name}`)
        }
    })

    const form = useForm({
        defaultValues: {...categories} as z.infer<typeof categoriesSchema>,
        onSubmit: async ({value}) =>{
            if(categories){
                await updateMutation.mutate(value)
            }else{
                await createMutation.mutate(value)
            }
        },
        validators:{
            onSubmit: categoriesSchema,
            onChange: categoriesSchema,
            onBlur: categoriesSchema
        }
    })

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild >
                <Button variant={"outline"}>{categories ? "Редактировать" : "Создать"}</Button>
            </DialogTrigger>
            <DialogContent className="min-h-52">
                <DialogHeader className="text-center">
                    {categories ? "Обновление категории" : "Создание категории"}
                </DialogHeader>
                <form onSubmit={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    form.handleSubmit()
                }}
                    className="flex flex-col  gap-5 justify-between"
                    >
                    <form.Field name="name" >
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
                            <Button className="" disabled = {!state.canSubmit || createMutation.isPending || updateMutation.isPending || !state.isDirty}>
                                {categories ? "Обновить" : "Создать"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    )
}