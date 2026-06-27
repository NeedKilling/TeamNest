import z from "zod/v4";

const ContactSchema = z.array(z.object({
  type: z.string(),  
  value: z.string(),
}))
.default([]);

export const personnelSchema = z.object({
    fullName: z.string({message: "Введите ФИО"})
    .min(5,"Сликом коротко"),
    age: z.number({message: "Введите возраст"}),
    city: z.string({message: "Введите город"}),
    shortResume: z.string({message: "Введите резюме"}),
    education: z.string({message: "Введите образование"}),
    contacts: ContactSchema,
    
    skills: z.array(z.string()).default([]),
    specializationId: z.string({message: "Выберите специальность"}),
    categoriesId: z.string({message: "Выберите категорию"}),
    image: z.string().optional()
})