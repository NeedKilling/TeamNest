import { industriesSchema } from "@/lib/schemas/industries";
import { db } from "@/server/db";
import { industries, projects } from "@/server/db/schema";
import { redis } from "bun";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"
import { userService } from "./user";
import { AppError } from "..";



export const industriesRouter = new Elysia({
    prefix: "/industries"
})
.use(userService)
.get("/", async ()=>{
    const query = db.query.industries.findMany({
            orderBy: (industries, {asc}) => asc(industries.createdAt),
            where: eq(industries.isDeleted, false),
        })
    
        type ind = Awaited<ReturnType<typeof query.execute>>
    
        const cashIndustries = await redis.get("industries")


        if(cashIndustries){
            return JSON.parse(cashIndustries) as ind
            
        }
    
        const dbIndustries = await query.execute()
        await redis.set("industries", JSON.stringify(dbIndustries), "EX", 60*60*24)
    
    
        return dbIndustries

})




.get("/:id", async ({params})=>{
    const response = await db.query.industries.findFirst({
        where: and(
            eq(industries.id, params.id),
            eq(industries.isDeleted, false),
        ),
    }) 

    if(!response){
        throw new AppError("Отрасль не найдена", 404, "NOT_FOUND")
    }

    return response ?? null
}, {
    params: z.object({
        id: z.string()
    })
})


.post("/", async ({body, session})=>{

    const responce = await db.query.industries.findFirst({
        where: and(
            eq(industries.isDeleted,false),
            eq(industries.name, body.name)
        )
    })
    if(responce){
        throw new AppError("Отрасль с таким именем уже существует",409,"CONFLICT")
    }

    await db.insert(industries).values(body)

    await redis.del("industries"); 
},{
    body: industriesSchema,
    isAdmin: true
})
.put("/:id", async ({params, body, session})=>{

     const response = await db.query.industries.findFirst({
        where: and(
            eq(industries.id, params.id),
            eq(industries.isDeleted, false),
        ),
    }) 

    if(!response){
        throw new AppError("Отрасль не найдена", 404, "NOT_FOUND")
    }

    const duplicat = await db.query.industries.findFirst({
        where: and(
            eq(industries.isDeleted,false),
            eq(industries.name, body.name)
        )
    })
    if(duplicat){
        throw new AppError("Отрасль с таким именем уже существует",409,"CONFLICT")
    }

    await db.update(industries).set(body).where(eq(industries.id, params.id))

    await redis.del("industries"); 
    await redis.del("projects");
},{
    body: industriesSchema,
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
}) 
.delete("/:id", async ({params, session})=>{
    const response = await db.query.industries.findFirst({
        where: and(
            eq(industries.id, params.id),
            eq(industries.isDeleted, false),
        ),
    }) 

    if(!response){
        throw new AppError("Отрасль не найдена", 404, "NOT_FOUND")
    }

    await db.update(industries).set({isDeleted: true}).where(eq(industries.id, params.id))

    await db.update(projects).set({isDeleted: true}).where(eq(projects.industriesId, params.id))

    await redis.del("industries"); 
    await redis.del("projects");
},{
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
})