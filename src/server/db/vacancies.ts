import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { projects } from "./schema";
import { relations } from "drizzle-orm";

export const vacancies = pg.pgTable("vacancies",{
    ...commonFields,
    name: pg.varchar("name", { length: 255 }).notNull(),
    city: pg.varchar("city", { length: 255 }).notNull(),
    description: pg.text("description").notNull(),
    projectId: pg.varchar("project_id").notNull().references(()=>projects.id)

})

export const vacanciesRelations = relations(vacancies, ({ one }) => ({
  project: one(projects, {
    references: [projects.id],
    fields: [vacancies.projectId],
  }),
}));