import z from "zod/v4"

export const feedbackSchema = z.object({
    name: z.string({message:"Введите имя"}).min(2,{message: "минимум 2 символа"}),
    email: z.email({message: "Введите свою почту"}),
    message: z.string({message: "Введите сообщение"}).min(5,{message: "Слишком коротко"})
})