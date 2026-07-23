"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/client/auth-client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import z from "zod/v4";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { redirect,useRouter } from "next/navigation";
export const dynamic = 'force-dynamic'

export default function SignIn(){
    const router = useRouter();
    const schema = z.object({
        email: z.email(),
        password: z.string(),
    })

    const signInMutation = useMutation({
        mutationKey: ["sign-in"],
        mutationFn: async (data: z.infer<typeof schema>)=>{
            const response = await authClient.signIn.email(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.code || response.error.message } `;
                throw new Error(errorMessage);
            }
            console.log(response.error)
        },
        onSuccess: ()=>{
            toast.success("Авторизация успешна")
            // redirect("/")
            router.push("/profile")
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка авторизации: 
                ${err.message || err.name}`)
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

    const [visiblePassword, setVisiblePassword] = useState(false)

// py-[230px]

    return(
        <div className = "pt-30 pb-10 md:pb-0 md:pt-0 mx-auto flex items-center flex-auto">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault(),
                    e.stopPropagation(),
                    form.handleSubmit(e)
                }}

                className="container w-[398px] sm:w-120 p-5  rounded-[16px] flex flex-col gap-5  ">
                
                <h2 className="text-center text-3xl font-medium">Вход</h2>

                <form.Field name="email">
                    {(field)=>(
                        <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                        placeholder="почта" type="email"
                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                    )}
                </form.Field>
                <form.Field name="password">
                    {(field)=>(
                        <div className="relative">
                            <Input required className="relative pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                            placeholder="пароль" type={visiblePassword ? "text" : "password"}
                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                            <button onClick={() => setVisiblePassword(!visiblePassword)} className="absolute right-3 top-1/2 -translate-y-1/2" type="button">
                                {visiblePassword ? <Eye className="text-tGray-sub" width={20} height={20}/> 
                                : <EyeOff className="text-tGray-sub" width={20} height={20}/>}</button>
                        </div>
                    )}
                </form.Field>

                <form.Subscribe>
                    {(state)=>(
                        <Button className= "text-tWhite-main text-base font-medium bg-black-component py-3 px-4 h-[45px]" disabled = { !state.canSubmit || !state.isDirty}>Войти</Button>
                    )}
                </form.Subscribe>

                <p className="text-center text-[12px] text-tGray-sub">Нет аккаунта? <Link className="font-semibold underline" href="/auth/sign-up">Зарегистрироваться</Link></p>
            </form>
        </div>
    )
}