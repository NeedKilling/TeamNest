import { personnelSchema } from "@/lib/schemas/personnel";
import { db } from "@/server/db";
import { personnel } from "@/server/db/schema";
import { redis } from "bun";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const personnelRouter = new Elysia({
    prefix: "/personnel"
})


.get("/", async ()=>{
    const query = db.query.personnel.findMany({
        where: eq(personnel.isDeleted, false),
    })

    type pers = Awaited<ReturnType<typeof query.execute>>

    const cashPersonnel = await redis.get("personnel")
    if(cashPersonnel){
        return JSON.parse(cashPersonnel) as pers
    }

    const dbPersonnel = await query.execute()
    await redis.set("personnel", JSON.stringify(dbPersonnel), "EX", 60*60*24)


})



.get("/:id", async ({params})=>{
    return await db.query.personnel.findFirst({
        where: and(
            eq(personnel.id, params.id),
            eq(personnel.isDeleted, false),
        )
    }) ?? null
}, {
    params: z.object({
        id: z.string()
    })
})
.post("/", async ({body})=>{
    await db.insert(personnel).values(body)

    await redis.del("personnel")
},{
    body: personnelSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(personnel).set(body).where(eq(personnel.id, params.id))

    await redis.del("personnel")
},{
    body: personnelSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.id, params.id))

    await redis.del("personnel")
},{
    params: z.object({
        id: z.string()
    })
})