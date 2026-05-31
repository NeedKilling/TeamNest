import { categoriesSchema } from "@/app/lib/schemas/catefories";
import { db } from "@/server/db";
import { categories , personnel} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"



export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.get("/", async ()=>{
    return await db.query.categories.findMany({
        where: eq(categories.isDeleted, false),
    })
})
.get("/:id", async ({params})=>{
    return await db.query.categories.findFirst({
        where: and(
            eq(categories.id, params.id),
            eq(categories.isDeleted, false),
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
    await db.insert(categories).values(body)
},{
    body: categoriesSchema,
})
.put("/:id", async ({params, body})=>{
    await db.update(categories).set(body).where(eq(categories.id, params.id))
},{
    body: categoriesSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(categories).set({isDeleted: true}).where(eq(categories.id, params.id))
},{
    params: z.object({
        id: z.string()
    })
})