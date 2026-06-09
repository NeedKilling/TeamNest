"use client"

import z , {email} from "zod"
import {password} from "bun"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/client/auth-client"
import { useForm } from "@tanstack/react-form"

export default function SignUp(){

    const schema = z.object({
        email: z.email(),
        password: z.string(),
        name: z.string()
    })


    const signUpMutation = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: async(data: z.infer<typeof schema>)=>{
            await authClient.signUp.email(data)
        },
        onSuccess: () => {
            alert("Получилось")
        }
    })

    const form = useForm({
        defaultValues: {} as z.infer<typeof schema>,
        onSubmit: async ({value})=>{
            signUpMutation.mutate(value)
        },
        validators: {
            onSubmit: schema,
        }
    })






    return(
        <form 
            onSubmit={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit(e)
            }}
            className="w-[300px] mx-auto bg-blue-100 border p-4 rounded-xl flex flex-col gap-4 ">


            <form.Field name="email">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите email" type="text"
                            value={field.state.value}
                            onChange={(e)=> field.handleChange(e.target.value)}
                            />
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>  
                )}
            </form.Field>
            <form.Field name="password">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите пароль" type="password"
                            value={field.state.value}
                            onChange={(e)=> field.handleChange(e.target.value)}
                            />
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>  
                )}
            </form.Field>
            <form.Field name="name">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите имя" type="text"
                            value={field.state.value}
                            onChange={(e)=> field.handleChange(e.target.value)}
                            />
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>  
                )}
            </form.Field>

            <form.Subscribe>
                {(state)=>(
                    <button type="submit" className="p-4 bg-blue-500  rounded-xl">{state.canSubmit ? "Зарегистрироваться": "ошибка"}</button>
                )}
            </form.Subscribe>

        </form>
    )
}