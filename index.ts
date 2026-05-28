import { db } from "@/server/db";
import { industries, projects } from "@/server/db/schema";
import { asc, desc, eq } from "drizzle-orm";

let foundProjects = await db.query.projects.findMany();
// console.log(foundProjects)
// await db.insert(projects).values({
//     name: "Проект 4",
//     description: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut du",
//     industriesId: "019e6f1b-1547-7000-a8b2-518c4cb8d9c9",
//     stage: "Идея",
//     startDate: new Date("2026-05-28"), 
//     linkProject: "https://link",

// })
// await db.insert(industries).values({
//     name: "Маркетинг",
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