import { categoriesSchema } from "@/lib/schemas/categories";
import { db } from "@/server/db";
import { categories , personnel} from "@/server/db/schema";
import { and, eq, ne } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"
import { userService } from "./user";
import { redis } from "bun";
import { AppError } from "..";



export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.use(userService)


.get("/", async ()=>{

    const query = db.query.categories.findMany({
        orderBy: (categories, {asc}) => asc(categories.createdAt),
        where: eq(categories.isDeleted, false),
    })

    type cat = Awaited<ReturnType<typeof query.execute>>

    const cashCategories = await redis.get("categories")
    if(cashCategories){
        return JSON.parse(cashCategories) as cat
    }

    const dbCategories = await query.execute()
    await redis.set("categories", JSON.stringify(dbCategories), "EX", 60*60*24)


    return dbCategories
})



.get("/:id", async ({params})=>{
     const response = await db.query.categories.findFirst({
        where: and(
            eq(categories.id, params.id),
            eq(categories.isDeleted, false),
        ),
        with: {
            personnel: {
                where: eq(personnel.isDeleted, false)
            }
        }
    }) 

    if(!response){
            throw new AppError("Категория не найдена", 404, "NOT_FOUND")
    }

    return response ?? null
}, {
    params: z.object({
        id: z.string()
    })
})



.post("/", async ({body,session})=>{

    const responce = await db.query.categories.findFirst({
        where: and(
            eq(categories.isDeleted,false),
            eq(categories.name, body.name)
        )
    })
    if(responce){
        throw new AppError("Категория с таким именем уже существует",409,"CONFLICT")
    }

    await db.insert(categories).values(body)


    await redis.del("categories"); 

},{
    body: categoriesSchema,
    isAdmin: true,
})

.put("/:id", async ({params, body, session})=>{
    const response = await db.query.categories.findFirst({
        where: and(
            eq(categories.id, params.id ),
            eq(categories.isDeleted, false ),
        ) 
    })

    if(!response){
        throw new AppError("Категория не найдена", 404, "NOT_FOUND")
    }


    const duplicat = await db.query.categories.findFirst({
        where: and(
            eq(categories.isDeleted,false),
            eq(categories.name, body.name),
            
        )
    })
    console.log(duplicat)
    if(duplicat){
        throw new AppError("Категория с таким именем уже существует",409,"CONFLICT")
    }
    
    await db.update(categories).set(body).where(eq(categories.id, params.id))

    await redis.del("categories"); 
},{
    body: categoriesSchema,
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
}) 
.delete("/:id", async ({params, session})=>{
    const response = await db.query.categories.findFirst({
        where: and(
            eq(categories.id, params.id ),
            eq(categories.isDeleted, false ),
        ) 
    })

    if(!response){
        throw new AppError("Категория не найдена", 404, "NOT_FOUND")
    }

    await db.update(categories).set({isDeleted: true}).where(eq(categories.id, params.id))
    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.categoriesId, params.id))

    await redis.del("categories"); 
},{
    params: z.object({
        id: z.string()
    }),
    isAdmin: true
})