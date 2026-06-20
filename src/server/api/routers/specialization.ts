import { specializationSchema } from "@/lib/schemas/specialization";
import { db } from "@/server/db";
import { personnel, specialization } from "@/server/db/schema";
import { redis } from "bun";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const specializationRouter = new Elysia({
    prefix: "/specialization"
})
.get("/", async ()=>{
   const query = db.query.specialization.findMany({
           where: eq(specialization.isDeleted, false),
       })
   
       type spec = Awaited<ReturnType<typeof query.execute>>
   
       const cashSpecialization = await redis.get("specialization")
       if(cashSpecialization){
           return JSON.parse(cashSpecialization) as spec
       }
   
       const dbSpecialization = await query.execute()
       await redis.set("specialization", JSON.stringify(dbSpecialization), "EX", 60*60*24)
})
.get("/:id", async ({params})=>{
    return await db.query.specialization.findFirst({
        where: and(
            eq(specialization.id, params.id),
            eq(specialization.isDeleted, false),
        ),
        with: {
            personnel: {
                where: eq(personnel.isDeleted, false)
            }
        }
    }) ?? null
}, {
    params: z.object({
        id: z.string()
    })
})
.post("/", async ({body})=>{
    await db.insert(specialization).values(body)

    await redis.del("specialization")
},{
    body: specializationSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(specialization).set(body).where(eq(specialization.id, params.id))

    await redis.del("specialization")
},{
    body: specializationSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(specialization).set({isDeleted: true}).where(eq(specialization.id, params.id))

    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.specializationId, params.id))

    await redis.del("specialization")
},{
    params: z.object({
        id: z.string()
    })
})