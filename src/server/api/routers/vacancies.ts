import Elysia from "elysia";
import { userService } from "./user";
import { db } from "@/server/db";
import { projects, vacancies } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { AppError } from "..";
import { vacancySchema } from "@/lib/schemas/vacancies";
import z from "zod/v4";


export const vacanciesRouter = new Elysia({ 
    prefix: "/vacancies" 
})
.use(userService)


.post("/", async ({ body, session }) => {
   
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, body.projectId),
        eq(vacancies.isDeleted, false)
      ),
    });
    if (!project) {
        throw new AppError("Проект не найден", 404);
    }
    if (project.userId !== session?.user.id) {
      throw new AppError("Только владелец проекта может создавать вакансии", 403);
    }
    await db.insert(vacancies).values(body);

  }, {
    body: vacancySchema,
    isSignedId: true
  })

.get("/projects/:projectId", async ({ params }) => {
    
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, params.projectId),
        eq(vacancies.isDeleted, false)
      ),
    });
    if (!project) {
        throw new AppError("Проект не найден", 404);
    }

    const vacanciesList = await db.query.vacancies.findMany({
        orderBy: (vacancies, { asc }) => asc(vacancies.createdAt),
      where: and(
        eq(vacancies.projectId, params.projectId),
        eq(vacancies.isDeleted, false)
      ),
     
    });

    return vacanciesList;
  }, {
    params: z.object({ 
        projectId: z.string() 
    }),
  })

  
.get("/:id", async ({ params }) => {
    
    const vacancy = await db.query.vacancies.findFirst({
      where: and(
        eq(vacancies.id, params.id),
        eq(vacancies.isDeleted, false)
      ),
    });
    if (!vacancy) {
        throw new AppError("Вакансия не найдена", 404);
    }

    return vacancy;
  }, {
    params: z.object({ 
        id: z.string() 
    }),
  })

.put("/:id", async ({ params, body, session }) => {
    
    const vacancy = await db.query.vacancies.findFirst({
      where: and(
        eq(vacancies.id, params.id),
       eq(vacancies.isDeleted, false),
      ),
      with: {
        project: true
      }
    });
    if (!vacancy) {
        throw new AppError("Вакансия не найдена", 404);
    }
    if (vacancy.project.userId !== session?.user.id) {
      throw new AppError("Только владелец проекта может изменять вакансию", 403);
    }

    await db.update(vacancies).set({
        name: body.name,
        city: body.city,
        description: body.description,
      })
      .where(eq(vacancies.id, params.id));

  }, {
    params: z.object({ 
        id: z.string() 
    }),
    body: vacancySchema,
    isSignedId: true
  })

.delete("/:id", async ({ params, session }) => {

    const vacancy = await db.query.vacancies.findFirst({
      where: and(
        eq(vacancies.id, params.id),
        eq(vacancies.isDeleted, false),
      ),
      with: {
        project: true
      }
    })
    if (!vacancy){
         throw new AppError("Вакансия не найдена", 404);
    }
    if (vacancy.project.userId !== session?.user.id) {
      throw new AppError("Только владелец проекта может удалить вакансию", 403);
    }

    await db.update(vacancies).set({ isDeleted: true })
      .where(eq(vacancies.id, params.id));

    return { success: true };
  }, {
    params: z.object({ 
        id: z.string() 
    }),
    isSignedId: true
  });