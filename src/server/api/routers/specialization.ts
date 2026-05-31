import { specializationSchema } from "@/app/lib/schemas/specialization";
import { db } from "@/server/db";
import { personnel, specialization } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const specializationRouter = new Elysia({
    prefix: "/specialization"
})
.get("/", async ()=>{
    return await db.query.specialization.findMany({
        where: eq(specialization.isDeleted, false),
    })
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
},{
    body: specializationSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(specialization).set(body).where(eq(specialization.id, params.id))
},{
    body: specializationSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(specialization).set({isDeleted: true}).where(eq(specialization.id, params.id))

    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.specializationId, params.id))
},{
    params: z.object({
        id: z.string()
    })
})