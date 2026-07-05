import { specializationSchema } from "@/lib/schemas/specialization";
import { db } from "@/server/db";
import { personnel, specialization } from "@/server/db/schema";
import { redis } from "bun";
import { and, eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4"
import { userService } from "./user";
import { AppError } from "..";



export const specializationRouter = new Elysia({
    prefix: "/specialization"
})
.use(userService)
.get("/", async ()=>{
   const query = db.query.specialization.findMany({
           orderBy: (specialization, {asc}) => asc(specialization.createdAt),
           where: eq(specialization.isDeleted, false),
       })
   
       type spec = Awaited<ReturnType<typeof query.execute>>
   
       const cashSpecialization = await redis.get("specialization")
       if(cashSpecialization){
           return JSON.parse(cashSpecialization) as spec
       }
   
       const dbSpecialization = await query.execute()
       await redis.set("specialization", JSON.stringify(dbSpecialization), "EX", 60*60*24)

       return dbSpecialization
})
.get("/:id", async ({params})=>{
    const response =  await db.query.specialization.findFirst({
        where: and(
            eq(specialization.id, params.id),
            eq(specialization.isDeleted, false),
        ),
        with: {
            personnel: {
                where: eq(personnel.isDeleted, false)
            }
        }
    }) 

    if(!response){
        throw new AppError("Специальность не найдена", 404, "NOT_FOUND")
    }
    
    return response ?? null
}, {
    params: z.object({
        id: z.string()
    })
})


.post("/", async ({body,session})=>{
    const responce = await db.query.specialization.findFirst({
        where: and(
            eq(specialization.isDeleted,false),
            eq(specialization.name, body.name),
        )
    })
    if(responce){
        throw new AppError("Специальность с таким именем уже существует",409,"CONFLICT")
    }

    await db.insert(specialization).values(body)

    await redis.del("specialization")
},{
    body: specializationSchema,
})



.put("/:id", async ({params, body,session})=>{

     const response =  await db.query.specialization.findFirst({
        where: and(
            eq(specialization.id, params.id),
            eq(specialization.isDeleted, false),
        )
    }) 

    if(!response){
        throw new AppError("Специальность не найдена", 404, "NOT_FOUND")
    }


    const duplicat = await db.query.specialization.findFirst({
        where: and(
            eq(specialization.isDeleted,false),
            eq(specialization.name, body.name),
        )
    })
    if(duplicat){
        throw new AppError("Специальность с таким именем уже существует",409,"CONFLICT")
    }


    await db.update(specialization).set(body).where(eq(specialization.id, params.id))

    await redis.del("specialization")
},{
    body: specializationSchema,
    params: z.object({
        id: z.string()
    })
}) 
.delete("/:id", async ({params,session})=>{

    const response =  await db.query.specialization.findFirst({
        where: and(
            eq(specialization.id, params.id),
            eq(specialization.isDeleted, false),
        )
    }) 

    if(!response){
        throw new AppError("Специальность не найдена", 404, "NOT_FOUND")
    }

    await db.update(specialization).set({isDeleted: true}).where(eq(specialization.id, params.id))

    await db.update(personnel).set({isDeleted: true}).where(eq(personnel.specializationId, params.id))

    await redis.del("specialization")
},{
    params: z.object({
        id: z.string()
    })
})