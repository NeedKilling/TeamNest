import { personnelSchema } from "@/app/lib/schemas/personnel";
import { db } from "@/server/db";
import { personnel } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const personnelRouter = new Elysia({
    prefix: "/personnel"
})
.get("/", async ()=>{
    return await db.query.personnel.findMany({
        where: eq(personnel.isDeleted, false),
    })
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
},{
    body: personnelSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(personnel).set(body).where(eq(personnel.id, params.id))
},{
    body: personnelSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.id, params.id))
},{
    params: z.object({
        id: z.string()
    })
})