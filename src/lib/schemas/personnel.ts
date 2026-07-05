import z from "zod/v4";

const ContactSchema = z.array(z.object({
  type: z.string(),  
  value: z.string(),
}))
.default([]);

export const personnelSchema = z.object({
    firstName: z.string({message: "Введите имя"}).min(2,"Имя должно иметь миниммум 2 буквы"),
    lastName: z.string({message: "Введите Фамилию"}),
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