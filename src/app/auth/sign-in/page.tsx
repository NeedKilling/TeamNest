"use client"
import { authClient } from "@/lib/client/auth-client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import z from "zod/v4";

export default function SignIn(){
    const schema = z.object({
        email: z.email(),
        password: z.string(),
    })

    const signInMutation = useMutation({
        mutationKey: ["sign-in"],
        mutationFn: async (data: z.infer<typeof schema>)=>{
            await authClient.signIn.email(data)
        },
        onSuccess: ()=>{
            alert("вход успешен")
        }
    })

    const form = useForm({
        defaultValues: {} as z.infer<typeof schema>,
        onSubmit: ({value})=>{
            signInMutation.mutate(value)
        },
        validators: {
            onSubmit: schema,
        }

    })




    return(
        <form 
            onSubmit={(e)=>{
                e.preventDefault(),
                e.stopPropagation(),
                form.handleSubmit(e)
            }}

            className="w-[300px] mx-auto bg-blue-100 border p-4 rounded-xl flex flex-col gap-4 ">

            <form.Field name="email">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите email" type="text"
                            value={field.state.value}
                            onChange={(e)=>field.handleChange(e.target.value)}
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
                            onChange={(e)=>field.handleChange(e.target.value)}
                            />
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </form.Field>

            <form.Subscribe>
                {(state)=>(
                    <button type="submit" className="p-4 bg-blue-500  rounded-xl">{state.canSubmit ? "Войти": "ошибка"}</button>
                )}
            </form.Subscribe>
        </form>
    )
}