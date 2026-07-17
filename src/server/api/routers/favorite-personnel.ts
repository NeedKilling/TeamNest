import Elysia from "elysia";
import { userService } from "./user";
import { AppError } from "..";
import z from "zod/v4"
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { favoritePersonnel } from "@/server/db/favorite";
import { categories, specialization } from "@/server/db/schema";

export const favoritesPersonnelRouter = new Elysia({
  prefix: "/favoritePersonnel",
})
.use(userService)


.get("/",async ({session}) => {
    const response = await db.query.favoritePersonnel.findMany({
        orderBy: (favoritePersonnel, {asc}) => asc(favoritePersonnel.createdAt),
        where: and(
            eq(favoritePersonnel.userId, session?.user?.id!),
            eq(favoritePersonnel.isDeleted, false)
        ),
        with: {
            personnel:{
                with:{
                    user:true,
                    categories: true,
                    specialization: true
                }
            }
            
            
        }  
    })

    return response ?? null
},{
    isSignedId: true
})



.post("/", async ({body,session})=>{

    const response = await db.insert(favoritePersonnel).values({
        userId: session?.user.id!,
        personnelId: body.id
    })
},{
    body: z.object({
        id: z.string()
    }),
    isSignedId: true
})



.delete("/:id", async ({params,session})=>{

    const response = await db.query.favoritePersonnel.findFirst({
        where: and(
            eq(favoritePersonnel.personnelId, params.id),
            eq(favoritePersonnel.isDeleted, false),
        )
    }) 

    if(!response){
        throw new AppError("Избранный кадр не найден", 404, "NOT_FOUND")
    }

    await db.update(favoritePersonnel).set({isDeleted: true}).where(eq(favoritePersonnel.personnelId, params.id))
},{
    isSignedId: true,
    params: z.object({
        id: z.string()
    }),
})