import * as pg from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { commonFields } from "./utils";
import { projects, vacancies} from "./schema";
import { user } from "./auth-schema";

export const applicationsEnum = pg.pgEnum("app_status", ["pending", "accepted", "rejected"]); 
export const applicationTypeEnum = pg.pgEnum("application_type", ["application", "invitation"]);

export const applications = pg.pgTable("applications",{
    ...commonFields,
    userId: pg.varchar("user_id").references(()=>user.id),
    projectId: pg.varchar("project_id").notNull().references(()=>projects.id),
    status: applicationsEnum("app_status").notNull().default("pending"),
    vacancyId: pg.varchar("vacancy_id", { length: 255 }).references(() => vacancies.id),
    type: applicationTypeEnum("type").notNull().default("application"),
})

export const applicationsRelations = relations(applications, ({one}) => ({
  project: one(projects, {
    references: [projects.id],
    fields: [applications.projectId],
   
  }),
  user: one(user, {
    references: [user.id],
    fields:[applications.userId],
  }),
  vacancy: one(vacancies, { 
    references: [vacancies.id] ,
    fields: [applications.vacancyId]})
}));