import z from "zod/v4"

export const stageEnum = z.enum(['Idea', 'Realization', 'Completed']);                 
export type Stage = z.infer<typeof stageEnum>


export const projectsSchema = z.object({
    name: z.string({message: "Введите название проекта"}).min(3,{message: "минимум три символа"}),
    description: z.string({message: "Введите описание проекта"}).min(10,{message: "слишком коротко"}),
    industriesId: z.string({message: "Выберите отрасль проекта"}),
    stage:  stageEnum,
    // startDate: z.coerce.date({message: "Введите дату начала проекта"}),
    startDate: z.date({message: "Введите дату начала проекта"}),
    linkProject: z.string({message: "Введите ссылку на проект"}).min(5,{message: "минимум пять символов"}),
    image: z.string().optional().nullable(),
})

export const stageLabels: Record<Stage, string> = {
  Idea: "Идея",
  Realization: "Реализация",
  Completed: "Завершено"
}

export const projectsSchemaForServer = z.preprocess(
  (body: any) => ({
    ...body,
    startDate: typeof body?.startDate === "string" ? new Date(body.startDate) : body?.startDate,
  }),
  projectsSchema
);