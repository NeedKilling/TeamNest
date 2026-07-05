import z from "zod/v4";

export const categoriesSchema = z.object({
    name: z.string({message: "Введите название категории"}).min(3,{message: "минимум три символа"})
})