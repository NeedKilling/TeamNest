import { categoriesSchema } from "@/lib/schemas/catefories";
import { db } from "@/server/db";
import { categories , personnel} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"
import { userService } from "./user";
import { redis } from "bun";



export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.use(userService)


.get("/", async ()=>{

    const query = db.query.categories.findMany({
        where: eq(categories.isDeleted, false),
    })

    type cat = Awaited<ReturnType<typeof query.execute>>

    const cashCategories = await redis.get("categories")
    if(cashCategories){
        // return{
        //     categories: JSON.parse(cashCategories) as cat
        // }
        return JSON.parse(cashCategories) as cat
    }

    const dbCategories = await query.execute()
    await redis.set("categories", JSON.stringify(dbCategories), "EX", 60*60*24)


    return dbCategories
    // return await db.query.categories.findMany({
    //     where: eq(categories.isDeleted, false),
    // })
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



.post("/", async ({body,session})=>{

    await db.insert(categories).values(body)


    await redis.del("categories"); 

},{
    body: categoriesSchema,
    // isAdmin: true,
})






.put("/:id", async ({params, body})=>{
    await db.update(categories).set(body).where(eq(categories.id, params.id))

    await redis.del("categories"); 
},{
    body: categoriesSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params})=>{
    await db.update(categories).set({isDeleted: true}).where(eq(categories.id, params.id))
    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.categoriesId, params.id))

    await redis.del("categories"); 
},{
    params: z.object({
        id: z.string()
    })
})