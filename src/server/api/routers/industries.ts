import { industriesSchema } from "@/app/lib/schemas/industries";
import { db } from "@/server/db";
import { industries } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const industriesRouter = new Elysia({
    prefix: "/industries"
})
.get("/", async ()=>{
    return await db.query.industries.findMany({
        where: eq(industries.isDeleted, false),
    })
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
},{
    body: industriesSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(industries).set(body).where(eq(industries.id, params.id))
},{
    body: industriesSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(industries).set({isDeleted: true}).where(eq(industries.id, params.id))
},{
    params: z.object({
        id: z.string()
    })
})