import Elysia from "elysia";
import { userService } from "./user";
import { AppError } from "..";
import z from "zod/v4"
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { favoriteProjects } from "@/server/db/favorite";


export const favoritesProjectsRouter = new Elysia({
  prefix: "/favoriteProjects",
})
.use(userService)

.get("/",async ({session}) => {
    const response = await db.query.favoriteProjects.findMany({
        orderBy: (favoriteProjects, {asc}) => asc(favoriteProjects.createdAt),
        where: and(
            eq(favoriteProjects.userId, session?.user?.id!),
            eq(favoriteProjects.isDeleted, false)
        ),
        with: {
            project: {
                with:{
                    industries: true
                }
            },
            
        }  
    })

    
    return response ?? null
},{
    isSignedId: true
})

.post("/", async ({body,session})=>{

    const response = await db.insert(favoriteProjects).values({
        userId: session?.user.id!,
        projectId: body.id
    })
},{
    body: z.object({
        id: z.string()
    }),
    isSignedId: true
})



.delete("/:id", async ({params,session})=>{

    const response = await db.query.favoriteProjects.findFirst({
        where: and(
            eq(favoriteProjects.projectId, params.id),
            eq(favoriteProjects.isDeleted, false),
        )
    }) 

    if(!response){
        throw new AppError("Избранный проект не найден", 404, "NOT_FOUND")
    }

    await db.update(favoriteProjects).set({isDeleted: true}).where(eq(favoriteProjects.projectId, params.id))
},{
    isSignedId: true,
    params: z.object({
        id: z.string()
    }),
})