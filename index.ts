import { db } from "@/server/db";
import { categories, industries, personnel, projects, specialization } from "@/server/db/schema";
import { asc, desc, eq } from "drizzle-orm";

let foundProjects = await db.query.projects.findMany();

// await db.insert(personnel).values({
//     fullName: "Александр Соколов",
//     age: 30,
//     city: "Химки",
//     shortResume: "1C разработчик с опытом создания стартапов. Ищу интересный проект.",
//     education: "2005 - 2020 год МГУ им. М.В. Ломоносова Юридический факультет",
//     contacts: [
//         { "type": "phone", "value": "+79991234567" },
//         ],
//     skills: ["1C"],
//     specializationId: "019e7e8a-1c24-7000-92cd-bc70675bbba5",
//     categoriesId: "019e7e87-677a-7000-84bf-0f1edad2102b"
// })
// console.log(foundProjects)
// await db.insert(projects).values({
//     name: "Проект 2",
//     description: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut du",
//     industriesId: "019e7e81-7a4b-7000-ba58-b123c6060245",
//     stage: "Realization",
//     startDate: new Date("2023-05-28"), 
//     linkProject: "https://link",

// })
// await db.insert(industries).values({
//     name: "Телекоммуникации",
// })

// await db.update(projects).set({
//     name: "Онлайн-курс по Python",
// })
// .where(eq(projects.id, "019e6f1c-1081-7000-a20c-7fa95e1a24d3"));
// await db.update(projects).set({
//     isDeleted: true,
// })
// .where(eq(projects.id, "019e6f1d-2693-7000-a81b-ca98f84f12d9"));

const foundProjectsWitchIndustries = await db.query.projects.findMany({
    where: eq(projects.isDeleted, false),
    orderBy: asc(projects.createdAt),
    with:{
        industries: true,
    }
});
console.log(foundProjectsWitchIndustries)

const foundIndustriesWitchProjects = await db.query.industries.findMany({
    where: eq(industries.isDeleted, false),
    with:{
        projects: {
            where: eq(projects.isDeleted, false)
        },
    }
});
console.log(foundIndustriesWitchProjects)


const foundIndustries = await db.query.industries.findFirst({
    where: eq(industries.id, "019e6f1a-9449-7000-81c4-c21ba562346c"),
    with: {
        projects:{
            where: eq(projects.isDeleted, false)
        }
    }
})

console.log(foundIndustries)