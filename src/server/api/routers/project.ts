import { projectsSchema, projectsSchemaForServer } from "@/lib/schemas/project";
import { db } from "@/server/db";
import { industries, projects } from "@/server/db/schema";
import { and, eq, ne } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4";
import { userService } from "./user";
import { redis } from "bun";
import { AppError } from "..";

const patchProjectSchema = projectsSchema.partial()
// const notFound = async function(paramsId: string){
//     const response = await db.query.projects.findFirst({
//         where: and(
//             eq(projects.id, paramsId ),
//             eq(projects.isDeleted, false ),
//         ) 
//     })

//     if(!response){
//         throw new AppError("Стартап не найден", 404, "NOT_FOUND")
//     }
// }




export const projectsRouter = new Elysia({
    prefix: "/projects"
})
.use(userService)

.get("/", async ()=>{
    const query = db.query.projects.findMany({
            orderBy: (projects, {asc}) => asc(projects.createdAt),
            where: eq(projects.isDeleted, false),
            with: {
                industries: true
            },
            
        })
        
        type proj = Awaited<ReturnType<typeof query.execute>>
    
        const cashProjects = await redis.get("projects")
        if(cashProjects){
            return JSON.parse(cashProjects) as proj
        }
    
        const dbProjects = await query.execute()
        await redis.set("projects", JSON.stringify(dbProjects), "EX", 60*60*24)
        
        return dbProjects
},{
    ////
})

.get("/:id",async ({params})=>{
    const response = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, params.id ),
            eq(projects.isDeleted, false ),
        ) 
    })

    if(!response){
        throw new AppError("Стартап не найден", 404, "NOT_FOUND")
    }

    return response ?? null

},{
    params: z.object({
        id: z.string()
    })
})


.post("/", async ({body, session})=>{

    const responce = await db.query.projects.findFirst({
        where: and(
            eq(projects.isDeleted,false),
            eq(projects.name, body.name)
        )
    })
    if(responce){
        throw new AppError("Стартап с таким именем уже существует",409,"CONFLICT")
    }

    await db.insert(projects).values({
        name: body.name,
        description: body.description,
        industriesId: body.industriesId,
        stage: body.stage,
        startDate: body.startDate,
        linkProject: body.linkProject,
        image: body.image || null
    })

    await redis.del("projects")
},{
    body: projectsSchemaForServer,
    isAdmin: true
})



.put("/:id", async ({params, body, session})=>{
     const response = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, params.id ),
            eq(projects.isDeleted, false ),
        ) 
    })

    if(!response){
        throw new AppError("Стартап не найден", 404, "NOT_FOUND")
    }


    const duplicat = await db.query.projects.findFirst({
        where: and(
            eq(projects.isDeleted,false),
            eq(projects.name, body.name),
            ne(projects.id, params.id) // !!!! 
        )
    })
    if(duplicat){
        throw new AppError("Стартап с таким именем уже существует",409,"CONFLICT")
    }


    await db.update(projects).set({
        name: body.name,
        description: body.description,
        industriesId: body.industriesId,
        stage: body.stage,
        startDate: body.startDate,
        linkProject: body.linkProject,
        image: body.image || null
    }).where(eq(projects.id, params.id))

    await redis.del("projects")
},{
    body: projectsSchemaForServer,
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
}) 


.delete("/:id", async ({params, session})=>{

     const response = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, params.id ),
            eq(projects.isDeleted, false ),
        ) 
    })

    if(!response){
        throw new AppError("Стартап не найден", 404, "NOT_FOUND")
    }


    await db.update(projects).set({isDeleted: true}).where(eq(projects.id, params.id))

    await redis.del("projects")
},{
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
})