"use client"

import { api } from "@/lib/client/api"
import { queryClient } from "@/lib/client/query-client"
import { projectsSchema, stageEnum } from "@/lib/schemas/project"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import z from "zod/v4"

export function ProjectsForm(){

    const stageEnumProjects = stageEnum.options;

    const createProjectsMutation = useMutation({
        mutationKey: ["create-projects"],
        mutationFn: async (data: z.infer<typeof projectsSchema>)=>{
            await api.projects.post(data)
        },
        onSuccess: ()=>{
            alert("Проект создан")
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })
        },

    })


    const projectsForm = useForm({
        defaultValues: {} as z.infer<typeof projectsSchema>,
        onSubmit: ({value})=>{
             createProjectsMutation.mutate(value)
        },
        validators: {
            onSubmit: projectsSchema,
        }

    })

    const {data: industries, isLoading} = useQuery({
        queryKey: ["industries"],
        queryFn: async ()=>{
            return (await api.industries.get()).data
        }
    })

    return(     
        <form onSubmit={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            projectsForm.handleSubmit()
        }}
             className="w-[300px] bg-blue-100 border p-4 rounded-xl flex flex-col gap-4 ">
            
            <projectsForm.Field name="name">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите название проекта" type="text"
                            value={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.value) }/>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>
            
            <projectsForm.Field name="description">
                {(field)=>(
                    <div>
                        <textarea className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите описание проекта"
                            value={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.value) }/>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>
        

            <projectsForm.Field name="industriesId">
                {(field)=>(
                    <div>
                        <select onChange={(e)=>{field.handleChange(e.target.value)}}>
                            {
                                industries?.map((item)=>(
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))
                            }
                        </select>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>
            

            <projectsForm.Field name="stage">
                {(field)=>(
                    <div>
                        <select onChange={(e)=>{field.handleChange(e.target.value as "Idea" | "Realization" | "Completed")}}>
                            {
                                stageEnumProjects?.map((item)=>(
                                    <option key={item} value={item}>{item}</option>
                                ))
                            }
                        </select>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>
            

            <projectsForm.Field name="startDate">
                {(field)=>(
                    
                    <div>
                        
                        <input type="date" className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите дату начала проекта"
                            // value={field.state.value} 
                            // onChange={(e) => {
                            //     field.handleChange(e.target.value)
                            // } }
                            
                             value={field.state.value ? field.state.value.toISOString().split("T")[0]: ""} 
                             onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                if (!isNaN(newDate.getTime())) {
                                field.handleChange(newDate);
                                }
                             }}
                            />
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>

            <projectsForm.Field name="linkProject">
                {(field)=>(
                    <div>
                        <input className = "w-[100%] bg-blue-300 p-2 rounded-xl placeholder:bg-white-100"  placeholder ="Введите ссылку на проект" type="text"
                            value={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.value) }/>
                        {field.state.meta.errors.map((err)=><p className="text-red-500" key={err?.message}>{err?.message}</p>)}
                    </div>
                )}
            </projectsForm.Field>
            
            

            <projectsForm.Subscribe>
                {(state)=>(
                    <button type="submit" className="p-4 bg-blue-500  rounded-xl">{state.canSubmit ? "Создать проект": "ошибка"}</button>
                )}
            </projectsForm.Subscribe>

        </form>
    )
}