import z from "zod/v4";

export const vacancySchema = z.object({
  name: z.string({message:"Введите название"}),
  city: z.string({message:"Введите город"}).min(2, "Слишком коротко"),
  description: z.string({message:"Введите описание"}).min(5, "Слишком коротко"),
  projectId: z.string()
})

export const vacancyFormSchema = z.object({
  name: z.string({message:"Введите название"}),
  city: z.string({message:"Введите город"}).min(2, "Слишком коротко"),
  description: z.string({message:"Введите описание"}).min(5, "Слишком коротко"),
})