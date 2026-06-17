import { projectsSchema, projectsSchemaForServer } from "@/lib/schemas/project";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4";
import { userService } from "./user";

export const projectsRouter = new Elysia({
    prefix: "/projects"
})
.use(userService)
.get("/", async ({session})=>{
    const foundProjects = await db.query.projects.findMany({
        where: eq(projects.isDeleted, false),
        
    })
    return foundProjects
},{
    isSignedId: true,
    isAdmin: true,
})

// .get("/", async ()=>{
//     const foundProjects = await db.query.projects.findMany({
//         where: eq(projects.isDeleted, false),
        
//     })
//     return foundProjects
// })
.get("/:id",async ({params})=>{
    const foundedProduct = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, params.id ),
            eq(projects.isDeleted, false ),
        ) 
    })

    return foundedProduct ?? null

},{
    params: z.object({
        id: z.string()
    })
})
.post("/", async ({body})=>{
    await db.insert(projects).values({
        name: body.name,
        description: body.description,
        industriesId: body.industriesId,
        stage: body.stage,
        startDate: body.startDate,
        linkProject: body.linkProject,
    })
},{
    body: projectsSchemaForServer,
})
.put("/:id", async ({params, body})=>{
    await db.update(projects).set(body).where(eq(projects.id, params.id))
},{
    body: projectsSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(projects).set({isDeleted: true}).where(eq(projects.id, params.id))
},{
    params: z.object({
        id: z.string()
    })
})