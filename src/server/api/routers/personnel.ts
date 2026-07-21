    import { personnelSchema } from "@/lib/schemas/personnel";
    import { db } from "@/server/db";
    import { personnel } from "@/server/db/schema";
    import { redis } from "bun";
    import { and, eq, isNotNull, ne } from "drizzle-orm";
    import Elysia from "elysia";
    import z from "zod/v4"
    import { userService } from "./user";
    import { AppError } from "..";




    export const personnelRouter = new Elysia({
        prefix: "/personnel"
    })

    .use(userService)
    .get("/", async ({session})=>{
        const response = await db.query.personnel.findFirst({
            where: eq(personnel.id, session?.user.personnelId!),
            with: {
                categories: true,
                specialization: true,
                user: true
            }
        })
        if(!response){
            throw new AppError("Пользователь не найден", 404, "NOT_FOUND")
        }
        return response ?? null
    
    })

    .get("/all", async (session)=>{
        const query = db.query.personnel.findMany({
            orderBy: (personnel, {asc}) => asc(personnel.createdAt),
            where: and(
                eq(personnel.isDeleted, false),
                ne(personnel.shortResume,""),
                isNotNull(personnel.shortResume),

                ne(personnel.education,""),
                isNotNull(personnel.education)
            ),
             with: {
                categories: true,
                specialization: true,
                user: true
            }
        })



        const dbPersonnel = await query.execute()


        return dbPersonnel
    })



    .get("/:id", async ({params,session})=>{
        const response = await db.query.personnel.findFirst({
            where: and(
                eq(personnel.id, params.id),
            ),
            with: {
                categories: true,
                specialization: true,
                user: true
            }
        })
        if(!response){
            throw new AppError("Пользователь не найден", 404, "NOT_FOUND")
        }

        return response ?? null
    }, {
        params: z.object({
            id: z.string()
        })
    })



    // .post("/", async ({body,session})=>{
    //     await db.insert(personnel).values(body)

    //     await redis.del("personnel")
    // },{
    //     body: personnelSchema,
    // })

    .put("/:id", async ({params, body, session})=>{
        // const response = await db.query.personnel.findFirst({
        //     where: and(
        //         eq(personnel.id, params.id),
        //         ne(personnel.id, params.id) // !!!! 
        //     )
        // })
        // if(!response){
        //     throw new AppError("Пользователь не найден", 404, "NOT_FOUND")
        // }

        const {userId, ...notUserId} = body
        await db.update(personnel).set({
            ...notUserId,
            specializationId: notUserId.specializationId || null,
            categoriesId: notUserId.categoriesId || null
        })
            .where(and(
                eq(personnel.id, params.id),
                eq(personnel.id, session?.user?.personnelId!)
            ))

        await redis.del("personnel")
    },{
        body: personnelSchema,
        params: z.object({
            id: z.string()
        }),
        isSignedId: true
    }) 


    // .delete("/:id", async ({params})=>{

    //     const response = await db.query.personnel.findFirst({
    //         where: and(
    //             eq(personnel.id, params.id),
    //             eq(personnel.isDeleted, false),
    //         )
    //     })
    //     if(!response){
    //         throw new AppError("Пользователь не найден", 404, "NOT_FOUND")
    //     }

    //     await db.update(personnel).set({isDeleted: true}).where(eq(personnel.id, params.id))

    //     await redis.del("personnel")
    // },{
    //     params: z.object({
    //         id: z.string()
    //     })
    // })