import z from "zod/v4";

export const specializationSchema = z.object({
    name: z.string({message: "Введите название специальности"}).min(3,{message: "минимум три символа"})
})