"use client"

import { api } from "@/lib/client/api"
import { industriesSchema } from "@/lib/schemas/industries"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import z from "zod/v4"

export function IndustriesForm(){

    const createIndustriesMutation = useMutation({
        mutationKey: ["create-industries"],
        mutationFn: async(data: z.infer<typeof industriesSchema>) => {
            await api.industries.post(data)
        },
        onSuccess: ()=>{
            alert("Отрасль создана");
        }//,
        // onError: ()=>{

        // }
    })

    const industriesForm = useForm({
        defaultValues: {} as z.infer<typeof industriesSchema>,
        onSubmit: ({value})=>{
            createIndustriesMutation.mutate(value)
        },
        validators: {
            onSubmit: industriesSchema,
        }
    })
    return(
        <form onSubmit={(e)=>{
            e.preventDefault()
            e.stopPropagation()

            industriesForm.handleSubmit(e)
        }}

         className="bg-blue-100 border p-4 rounded-xl flex flex-col gap-4 ">
            <industriesForm.Field name ="name">
                {(field)=>(
                    <div>
                        <input className = "bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите отрасль" type="text"value={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.value) }/>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </industriesForm.Field>

            <industriesForm.Subscribe>
                {(state)=>(
                    <button type="submit" className="p-4 bg-blue-300  rounded-xl">Отправить форму</button>
                )}
            </industriesForm.Subscribe>
        </form>
    )
}