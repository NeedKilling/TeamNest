import Elysia from "elysia";
import { userService } from "./user";
import { db } from "@/server/db";
import { feedback } from "@/server/db/feedback";
import { feedbackSchema } from "@/lib/schemas/feedback";

export const feedbackRouter = new Elysia({
    prefix: "/feedback"
})
.use(userService)

.get("/", async ()=>{
    return await db.query.feedback.findMany({
        orderBy: (feedback, {asc}) => asc(feedback.createdAt),
    })
},
{
    isAdmin: true
})
.post("/", async ({body,session})=>{
    await db.insert(feedback).values({
        name: body.name,
        email: body.email,
        message: body.message
    })
},{
    body: feedbackSchema
}
)
