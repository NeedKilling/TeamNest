import z from "zod/v4";


export const personnelSchema = z.object({

    age: z.number({message: "Введите возраст"}).optional(),
    city: z.string({message: "Введите город"}).optional(),
    shortResume: z.string({message: "Введите резюме"}).min(10,{message:"Слишком коротко"}).max(300,{message:"Слишком много"}).optional(),
    education: z.string({message: "Введите образование"}).min(10,{message:"Слишком коротко"}).max(130,{message:"Слишком много"}).optional(),
    
    skills: z.array(z.string().min(2,{message: "коротко"}).max(20,{message: "много"})).default([]).optional(),
    specializationId: z.string({message: "Выберите специальность"}).optional(),
    categoriesId: z.string({message: "Выберите категорию"}).optional(),
    image: z.string().optional(),

    telegram: z.string({message: "Введите имя телеграмм"}).optional(),
    vk: z.string({message: "Введите имя телеграмм"}).optional(),
    userId: z.string()
})