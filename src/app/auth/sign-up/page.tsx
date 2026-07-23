"use client"

import z , {email} from "zod"
import {password} from "bun"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/client/auth-client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { redirect,useRouter } from "next/navigation"
import { toast } from "sonner"
export const dynamic = 'force-dynamic'


export default function SignUp(){
    const router = useRouter()
    const schema = z.object({
        name: z.string(),
        lastName: z.string(),
        email: z.email(),
        password: z.string(),
        
    })


    const signUpMutation = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: async(data: z.infer<typeof schema>)=>{
            const response = await authClient.signUp.email(data)
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.code || response.error.message } `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: ()=>{
            toast.success("Регистрация успешна")
            router.push("/profile")
        },
        onError: (err: Error)=>{
            toast.error(`Ошибка регистрации: 
                ${err.message || err.name}`)
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
                
                <h2 className="text-center text-3xl font-medium">Регистрация</h2>

                <form.Field name="name">
                    {(field)=>(
                        <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                        placeholder="Имя"
                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                    )}
                </form.Field>
                <form.Field name="lastName">
                    {(field)=>(
                        <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                        placeholder="Фамилия"
                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                    )}
                </form.Field>

                <form.Field name="email">
                    {(field)=>(
                        <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                        placeholder="Почта" type="email"
                        errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                    )}
                </form.Field>
                <form.Field name="password">
                    {(field)=>(
                        <div className="relative">
                            <Input required className="relative pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                            placeholder="Пароль" type={visiblePassword ? "text" : "password"}
                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>

                            <button onClick={() => setVisiblePassword(!visiblePassword)} className="absolute right-3 top-1/2 -translate-y-1/2" type="button">
                                {visiblePassword ? <Eye className="text-tGray-sub" width={20} height={20}/> 
                                : <EyeOff className="text-tGray-sub" width={20} height={20}/>}</button>
                        </div>
                    )}
                </form.Field>

                <div className="flex gap-2 items-center">
                    <Checkbox required className="w-6 h-6 rounded-[8px] "/>
                    <p className="text-[12px] text-tGray-sub">Я принимаю условия <Link className="text-[#0066cc] underline" href="#">публичной оферты</Link> и подтверждаю своё согласие с ними.</p>
                </div>

                <form.Subscribe>
                    {(state)=>(
                        <Button className= "text-tWhite-main text-base font-medium bg-black-component py-3 px-4 h-[45px]" disabled = { !state.canSubmit || !state.isDirty}>Зарегистрироваться</Button>
                    )}
                </form.Subscribe>

                <p className="text-center text-[12px] text-tGray-sub">Уже есть аккаунт? <Link className="font-semibold underline" href="/auth/sign-in">Войти</Link></p>
            </form>
        </div>
        // <form 
        //     onSubmit={(e)=>{
        //         e.preventDefault()
        //         e.stopPropagation()
        //         form.handleSubmit(e)
        //     }}
        //     className="w-[300px] mx-auto bg-blue-100 border p-4 rounded-xl flex flex-col gap-4 ">


        //     <form.Field name="email">
        //         {(field)=>(
        //             <div>
        //                 <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите email" type="text"
        //                     value={field.state.value}
        //                     onChange={(e)=> field.handleChange(e.target.value)}
        //                     />
        //                 {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
        //             </div>  
        //         )}
        //     </form.Field>
        //     <form.Field name="password">
        //         {(field)=>(
        //             <div>
        //                 <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите пароль" type="password"
        //                     value={field.state.value}
        //                     onChange={(e)=> field.handleChange(e.target.value)}
        //                     />
        //                 {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
        //             </div>  
        //         )}
        //     </form.Field>
        //     <form.Field name="name">
        //         {(field)=>(
        //             <div>
        //                 <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите имя" type="text"
        //                     value={field.state.value}
        //                     onChange={(e)=> field.handleChange(e.target.value)}
        //                     />
        //                 {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
        //             </div>  
        //         )}
        //     </form.Field>

        //     <form.Subscribe>
        //         {(state)=>(
        //             <button type="submit" className="p-4 bg-blue-500  rounded-xl">{state.canSubmit ? "Зарегистрироваться": "ошибка"}</button>
        //         )}
        //     </form.Subscribe>

        // </form>
    )
}