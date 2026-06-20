import { industriesSchema } from "@/lib/schemas/industries";
import { db } from "@/server/db";
import { industries, projects } from "@/server/db/schema";
import { redis } from "bun";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const industriesRouter = new Elysia({
    prefix: "/industries"
})
.get("/", async ()=>{
    const query = db.query.industries.findMany({
            where: eq(industries.isDeleted, false),
        })
    
        type ind = Awaited<ReturnType<typeof query.execute>>
    
        const cashIndustries = await redis.get("industries")

        const nothing = await redis.keys("*")  // просто проверка всех ключей в redis
        console.log(nothing)


        if(cashIndustries){
            // return{
            //     industries: JSON.parse(cashIndustries) as ind
            // }
            return JSON.parse(cashIndustries) as ind
            
        }
    
        const dbIndustries = await query.execute()
        await redis.set("industries", JSON.stringify(dbIndustries), "EX", 60*60*24)
    
    
        return dbIndustries

    // await redis.del("industries"); 
})




.get("/:id", async ({params})=>{
    return await db.query.industries.findFirst({
        where: and(
            eq(industries.id, params.id),
            eq(industries.isDeleted, false),
        ),
    }) ?? null
}, {
    params: z.object({
        id: z.string()
    })
})
.post("/", async ({body})=>{
    await db.insert(industries).values(body)

    await redis.del("industries"); 
},{
    body: industriesSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(industries).set(body).where(eq(industries.id, params.id))

    await redis.del("industries"); 
},{
    body: industriesSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(industries).set({isDeleted: true}).where(eq(industries.id, params.id))

    await db.update(projects).set({isDeleted: true}).where(eq(projects.industriesId, params.id))

    await redis.del("industries"); 
},{
    params: z.object({
        id: z.string()
    })
})