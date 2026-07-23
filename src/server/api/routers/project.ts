import { projectsSchema, projectsSchemaForServer } from "@/lib/schemas/project";
import { db } from "@/server/db";
import { applications, favoriteProjects, industries, projects, vacancies } from "@/server/db/schema";
import { and, eq, ne } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4";
import { userService } from "./user";
import { redis } from "bun";
import { AppError } from "..";

const patchProjectSchema = projectsSchema.partial()



export const projectsRouter = new Elysia({
    prefix: "/projects"
})
.use(userService)

.get("/", async ()=>{
    const query = db.query.projects.findMany({
            orderBy: (projects, {asc}) => asc(projects.createdAt),
            where: eq(projects.isDeleted, false),
            with: {
                industries: true,
                
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


.get("/my-projects", async ({session})=>{
    const response = db.query.projects.findMany({
        orderBy: (projects, {asc}) => asc(projects.createdAt),
        where: and(
            eq(projects.userId, session?.user.id!),
            eq(projects.isDeleted, false)
        ),
        with: {
            industries: true,
            
        },
        
    })

    if((await response).length == 0){
        throw new AppError("Проекты не найдены или вы их еще не создали", 404, "NOT_FOUND")
    }
    return response
})

.get("/favorite",async ({session}) => {
    const response = await db.query.favoriteProjects.findMany({
        orderBy: (favoriteProjects, {asc}) => asc(favoriteProjects.createdAt),
        where: and(
            eq(favoriteProjects.userId, session?.user?.id!),
            eq(favoriteProjects.isDeleted, false)
        ),
        with: {
            project: {
                with:{
                    industries: true
                }
            },
            
        }  
    })

    
    return response ?? null
},{
    isSignedId: true
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

    const [returning] = await db.insert(projects).values({
        name: body.name,
        description: body.description,
        industriesId: body.industriesId,
        stage: body.stage,
        startDate: body.startDate,
        linkProject: body.linkProject,
        image: body.image || null,
        userId: session?.user.id!,
    }).returning({id: projects.id})

    await redis.del("projects")

    return returning
},{
    body: projectsSchemaForServer,
    isSignedId: true
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

    if(response.userId !== session?.user.id){
        throw new AppError("Нет прав на редактирование этого проекта", 403, "FORBIDDEN");
    }



    await db.update(projects).set({
        name: body.name,
        description: body.description,
        industriesId: body.industriesId,
        stage: body.stage,
        startDate: body.startDate,
        linkProject: body.linkProject,
        image: body.image || null,
    }).where(eq(projects.id, params.id))

    await redis.del("projects")
},{
    body: projectsSchemaForServer,
    params: z.object({
        id: z.string()
    }),
    isSignedId: true
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
    if(response.userId !== session?.user.id){
        throw new AppError("Нет прав на редактирование этого проекта", 403, "FORBIDDEN");
    }

    await db.update(projects).set({isDeleted: true}).where(eq(projects.id, params.id))
    await db.update(vacancies).set({ isDeleted: true }).where(eq(vacancies.projectId, params.id))
    await db.update(favoriteProjects).set({isDeleted: true}).where(eq(favoriteProjects.projectId, params.id))
    await db.update(applications).set({isDeleted: true}).where(eq(applications.projectId, params.id))

    await redis.del("projects")
},{
    params: z.object({
        id: z.string()
    }),
    isSignedId: true
})