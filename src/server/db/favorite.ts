import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth-schema";
import { personnel, projects } from "./schema";
import { relations } from "drizzle-orm";

export const favoriteProjects = pg.pgTable("favorite-projects",{
    ...commonFields,
    userId: pg.varchar("user_id").notNull().references(()=>user.id, { onDelete: 'cascade' }),
    projectId: pg.varchar("project_id").notNull().references(()=>projects.id, { onDelete: 'cascade' })
})

export const favoriteProjectsRelations = relations(favoriteProjects, ({one}) => ({
    user: one(user,{
        references: [user.id],
        fields: [favoriteProjects.userId]
    }),
    project: one(projects,{
        references: [projects.id],
        fields: [favoriteProjects.projectId]
    })
}))


export const favoritePersonnel = pg.pgTable("favorite-personnel",{
    ...commonFields,
    userId: pg.varchar("user_id").notNull().references(()=>user.id, { onDelete: 'cascade' }),
    personnelId: pg.varchar("personnel_id").notNull().references(()=>personnel.id, { onDelete: 'cascade' })
})

export const favoritePersonnelRelations = relations(favoritePersonnel, ({one}) => ({
    user: one(user,{
        references: [user.id],
        fields: [favoritePersonnel.userId]
    }),
    personnel: one(personnel,{
        references: [personnel.id],
        fields: [favoritePersonnel.personnelId]
    })
}))