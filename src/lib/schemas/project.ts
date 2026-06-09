import z from "zod/v4"

export const stageEnum = z.enum(['Idea', 'Realization', 'Completed']);                 


export const projectsSchema = z.object({
    name: z.string({message: "Введите название проекта"}),
    description: z.string({message: "Введите описание проекта"}),
    industriesId: z.string({message: "Выберите отрасль проекта"}),
    stage:  stageEnum,
    // startDate: z.coerce.date({message: "Введите дату начала проекта"}),
    startDate: z.date({message: "Введите дату начала проекта"}),
    // // startDate: z.string({ message: "Введите дату начала проекта" }),
    // startDate: z
    // .string({ message: "Введите дату начала проекта" }).date({ message: "Дата должна быть в формате ГГГГ-ММ-ДД" }),


    // startDate: z
    // .string({ message: "Введите дату начала проекта" })
    // // 1. Проверяем формат YYYY-MM-DD
    // .regex(/^\d{4}-\d{2}-\d{2}$/, {
    //   message: "Дата должна быть в формате ГГГГ-ММ-ДД",
    // })
    // // 2. Убеждаемся, что строка действительно валидная дата
    // .refine(
    //   (val) => {
    //     const date = new Date(val);
    //     return !isNaN(date.getTime()) && val === date.toISOString().slice(0, 10);
    //   },
    //   { message: "Некорректная дата" }
    // )
    // // 3. Трансформация в Date – сервер получит готовый объект
    // .transform((str) => new Date(str)),
    
    linkProject: z.string({message: "Введите ссылку на проект"}),
})


export const projectsSchemaForServer = z.preprocess(
  (body: any) => ({
    ...body,
    startDate: typeof body?.startDate === "string" ? new Date(body.startDate) : body?.startDate,
  }),
  projectsSchema
);