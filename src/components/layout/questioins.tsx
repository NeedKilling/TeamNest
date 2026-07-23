"use client"
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/client/api";
import z from "zod/v4";
import { feedbackSchema } from "@/lib/schemas/feedback";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { authClient } from "@/lib/client/auth-client";

export function Questions(){
    const {data: session, isPending, error} = authClient.useSession()

    const path = usePathname()
    const isActive = (href: string) => path.startsWith(href) ? "hidden" : ""
    return(
        <div className={`${isActive("/admin")} ${isActive("/auth")} py-12 container w-[400px] sm:w-full xl:w-[1312px] mx-auto `}>
          <div className="overflow-hidden relative p-4 h-[400px] xl:h-[300px] bg-gray-component border border-gray-border rounded-[16px] flex flex-col items-start justify-between">
            <div className="w-fit">
              <h2 className="text-[28px] xl:text-[56px] font-medium text-tBlack-main">Остались вопросы?</h2>
              <p className="text-base font-normal text-tGray-sub">Хотите стать нашим автором или задать любой другой вопрос?<br /> Напишите нам!</p>
            </div>
            <QuestionsButton user={session?.user}/>
            <img className = "absolute right-4 top-4 xl:h-[420px] h-[368px] xl:w-[420px] w-[368px] overflow-hidden pointer-events-none" src = "/img/Vector.png" alt="vector" />
            {/* <img className = "" src = "/img/Vector.png" alt="vector" /> */}
          </div>
        </div>  
    )
}


export function QuestionsButton({user}: {user?: typeof authClient.$Infer.Session.user}){

    const [isOpen, setIsOpen] = useState(false)
    

    const feedbackMutation = useMutation({
        mutationKey: ["createFeedback"],
        mutationFn: async (data: z.infer<typeof feedbackSchema>) => {
            const response = await api.feedback.post(data)

            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: ()=> {
            toast.success("Письмо отправлено"),
            form.reset(),
            setIsOpen(false)
        },
        onError: () => {
            toast.error("Не удалость отправить письмо")
        }
    })

    const form = useForm({
        defaultValues: {
          name: user?.name || "",
          email: user?.email || ""
        } as z.infer<typeof feedbackSchema>,
        onSubmit: async ({value})=>{
            feedbackMutation.mutate(value)
        },
        validators: {
            onSubmit: feedbackSchema
        }
    })

    return(
        <Dialog open = {isOpen} onOpenChange={(open)=>{
            setIsOpen(open)
            if(!open) form.reset() 
        }} >
            <DialogTrigger asChild>
                <Button className="xl:w-fit w-full h-[50px] text-xl font-medium text-tWhite-main rounded-[12px] px-3 py-4 touch-manipulation ">Задать вопрос</Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[620px] lg:min-h-[345px] max-w-[400px] max-h-[700px] lg:max-w-fit lg:max-h-fit">
                <DialogHeader className="gap-0 justify-center text-base text-tBlack-main font-medium">
                    Обратная связь
                </DialogHeader>
                <form  onSubmit={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit(e)
                }}   
                    className="flex flex-col justify-between gap-5"
                >
                    <form.Field name="name">
                        {(field)=>(
                            <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border " value={field.state.value} onChange={(e)=> field.handleChange(e.target.value)}  
                            placeholder="Имя" 
                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                        )}
                    </form.Field>

                    <form.Field name="email">
                        {(field)=>(
                            <Input required className="pl-4 px-3 h-[45px] bg-gray-component border border-gray-border" value={field.state.value} onChange={(e)=>field.handleChange(e.target.value)}
                            placeholder="Почта" 
                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                        )}
                    </form.Field>
                    
                    <form.Field name="message">
                        {(field)=>(
                            <Textarea required className="resize-none pl-4 px-3 h-[90px] bg-gray-component border border-gray-border" value={field.state.value} onChange={(e)=>field.handleChange(e.target.value)}
                            placeholder="Ваш запрос" 
                            errors = {Array.from(new Set(field.state.meta.errors.flatMap((e)=>e?.message ?? "")))}/>
                        )}
                    </form.Field>

                    <div className="flex gap-2 items-center">
                        <Checkbox required className="w-6 h-6 rounded-[8px] "/>
                        <p className="text-[12px] text-tGray-sub">Я принимаю условия <Link className="text-[#0066cc] underline" href="#">публичной оферты</Link> и подтверждаю своё согласие с ними.</p>
                    </div>
                    
                    <form.Subscribe >
                        {(state)=>(
                            <div className="flex justify-end">
                                <Button className= "text-tWhite-main text-base font-medium bg-black-component py-3 px-4 h-[45px]" disabled = { !state.canSubmit || feedbackMutation.isPending || !state.isDirty}>Задать вопрос</Button>
                            </div>
                        )}
                    </form.Subscribe>



                </form>
            </DialogContent>
        </Dialog>
    )
}