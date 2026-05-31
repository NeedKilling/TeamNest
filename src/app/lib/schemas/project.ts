import z from "zod/v4"

export const stageEnum = z.enum(['Idea', 'Realization', 'Completed']);                 


export const projectsSchema = z.object({
    name: z.string({message: "Введите название проекта"}),
    description: z.string({message: "Введите описание проекта"}),
    industriesId: z.string({message: "Выберите отрасль проекта"}),
    stage:  stageEnum,
    startDate: z.coerce.date({message: "Введите дату начала проекта"}),
    linkProject: z.string({message: "Введите ссылку на проект"}),
})