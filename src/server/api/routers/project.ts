import { db } from "@/server/db";
import { projects ,industries} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4";

export const projectsRouter = new Elysia({
    prefix: "/projects"
})
.get("/", async ()=>{
    const foundProjects = await db.query.projects.findMany({
        where: eq(projects.isDeleted, false),
        
    })
    return foundProjects
})
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