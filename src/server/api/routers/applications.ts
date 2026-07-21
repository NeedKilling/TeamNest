import Elysia from "elysia";
import { userService } from "./user";
import { z } from "zod/v4";
import { db } from "@/server/db";
import { AppError } from "..";
import { and, eq, inArray } from "drizzle-orm";
import { applications, personnel, projects, vacancies } from "@/server/db/schema";
import { applicationSchema, statusEnum } from "@/lib/schemas/applications";

export const applicationsRouter = new Elysia({ 
    prefix: "/applications" 
})
.use(userService)



.get("/my", async ({ session }) => {
    const myRequests = await db.query.applications.findMany({
    orderBy: (apps, { desc }) => desc(apps.createdAt),
    where: and(
        eq(applications.userId, session?.user.id!),
        eq(applications.isDeleted, false)),
    with: {
        project: {
          with: { 
            industries: true 
        },
        
      },
      user: { 
            with: { 
                personnel: {
                  with: {
                    specialization: true
                  }
                }
            } 
        },

      vacancy: true,
        
    },
     
    });
    return myRequests ?? null
  },{
    isSignedId: true
  })

.get("/members/:id", async ({ params }) => {
  const members = await db.query.applications.findMany({
    orderBy: (apps, { asc }) => asc(apps.createdAt),
    where: and(
      eq(applications.projectId, params.id),
      eq(applications.status, "accepted"),
      eq(applications.isDeleted, false)
    ),
    with: {
      user: {
        with: {
          personnel: {
            with: { specialization: true }
          }
        }
      },
    },
  });

  return members.map(app => app.user);
}, {
  params: z.object({ 
    id: z.string() 
  }),
  isSignedId: true,
})

 .get("/invite", async ({session }) => {

    
        const userProjects = await db.query.projects.findMany({
            where: eq(projects.userId, session?.user.id!)
        });
        const projectIds = userProjects.map(p => p.id)

        if (projectIds.length === 0) return [];

        const requests = await db.query.applications.findMany({
            orderBy: (apps, { asc }) => asc(apps.createdAt),
              where: (applications, { inArray, eq }) => 
                  and(
                    inArray(applications.projectId, projectIds),
                    eq(applications.isDeleted, false)
                  ),
            
            with: {
                project: { 
                    with: { 
                        industries: true 
                    } 
                },
                user: { 
                    with: { 
                        personnel: {
                            with: {
                              specialization: true
                            }
                          }
                    } 
                },
                vacancy: true,
            },
        
            });
        return requests ?? null
 },{
    isSignedId: true
 })
    

.put("/:id", async ({ params, body, session }) => {

  const application = await db.query.applications.findFirst({
    where: and(eq(applications.id, params.id),
          eq(applications.isDeleted, false) ),
     with: {
        project: { 
            with: { 
                industries: true 
            } 
        },
        user: { 
            with: { 
                personnel: {
                    with: {
                      specialization: true
                    }
                  }
            } 
        },
        vacancy: true,
    },
  });
  if (!application) {
    throw new AppError("Заявка не найдена", 404);
  }

  if (application.status !== "pending") {
    throw new AppError("Заявка уже обработана", 400);
  }
  await db.update(applications).set(body).where(eq(applications.id, params.id));

}, {
  params: z.object({ id: z.string() }),
  body: z.object({ status: statusEnum }),
  isSignedId: true,
})


.delete("/:id", async ({ params, session })=>{
    const application = await db.query.applications.findFirst({
        where: and(eq(applications.id, params.id),
              eq(applications.isDeleted, false)),
        with: {
            project: true,
        },
    });
    if (!application) {
        throw new AppError("Заявка не найдена", 404);
    }

    if (application.status !== "pending") {
        throw new AppError("Нельзя удалить заявку в статусе " + application.status, 400);
    }

    await db.update(applications).set({ isDeleted: true }).where(eq(applications.id, params.id));

}, {
    params: z.object({ 
      id: z.string() 
    }),
    isSignedId: true,
})



.post("/", async ({ body, session }) => {
  const { projectId, userId: targetUserId, vacancyId } = body;

  let finalProjectId = projectId;
  const finalVacancyId = vacancyId || null;

  if (vacancyId) {
    const vacancy = await db.query.vacancies.findFirst({
      where: and(eq(vacancies.id, vacancyId),
            eq(applications.isDeleted, false)),
    });
    if (!vacancy) {
      throw new AppError("Вакансия не найдена", 404)
    }
    finalProjectId = vacancy.projectId;
    if (projectId && projectId !== vacancy.projectId) {
      throw new AppError("Вакансия не принадлежит указанному проекту", 400);
    }
  }

  if (!finalProjectId) {
    throw new AppError("Не указан проект или вакансия", 400);
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, finalProjectId),
  });
  if (!project) {
    throw new AppError("Проект не найден", 404)
  }

  const applicantId = targetUserId || session?.user.id;

  if (project.userId === applicantId) {
    throw new AppError("Вы не можете пригласить себя в свой же проект", 400);
  }
  const existing = await db.query.applications.findFirst({
      where: and(
      eq(applications.projectId, finalProjectId),
      eq(applications.userId, applicantId!), 
      inArray(applications.status, ["pending", "accepted"]),
      eq(applications.isDeleted, false)
    ),
  });

  if (existing) {
    if (existing.status === "pending") {
      throw new AppError("Запрос уже отправлен", 409);
    }
    if (existing.status === "accepted") {
      throw new AppError("Пользователь уже в проекте", 409);
    }
  }
  const type = targetUserId && targetUserId !== session?.user.id ? "invitation" : "application";

  await db.insert(applications).values({
    projectId: finalProjectId,
    userId: applicantId,
    vacancyId: finalVacancyId,
    status: "pending",
    type
  });

}, {
  body: z.object({
    projectId: z.string().optional(),
    userId: z.string().optional(),
    vacancyId: z.string().optional(),
  }),
  isSignedId: true,
});


