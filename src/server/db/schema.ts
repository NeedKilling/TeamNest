import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

export const commonFields = {
  id: pg
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  isDeleted: pg.boolean("is_deleted").default(false),
  createdAt: pg.timestamp("created_at").notNull().defaultNow(),
};

export const personnel = pg.pgTable("personnel",{
    ...commonFields,
    fullName: pg.varchar("full_name",{length: 255}).notNull(),
    age: pg.integer("age").notNull(),
    city:pg.varchar("city",{length: 255}).notNull(),
    shortResume: pg.text("short_Resume").notNull(),
    education: pg.text("education").notNull(),
    contacts: pg.jsonb("contacts").notNull().default([]),


    skills: pg.varchar("skills", {length: 255}).array().notNull().default([]),

    specializationId: pg.varchar("specialization_id",{length: 255}).notNull().references(()=>specialization.id),
    categoriesId:pg.varchar("categories_id", {length: 255}).notNull().references(()=>categories.id)

});

export const specialization = pg.pgTable("specialization",{
    ...commonFields,
    name: pg.varchar("name", {length: 255}).notNull(),
})
export const categories = pg.pgTable("categories",{
    ...commonFields,
    name: pg.varchar("name", {length: 255}).notNull(),
})

export const personnelRealations = relations(personnel, ({one}) => ({
    specialization: one(specialization,{
        references: [specialization.id],
        fields: [personnel.specializationId]
    }),
    categories: one(categories,{
        references: [categories.id],
        fields: [personnel.categoriesId]
    })
}))

export const specializationRealations = relations(specialization, ({many})=>({
    personnel: many(personnel)
}))
export const categoriesRealations = relations(categories, ({many})=>({
    personnel: many(personnel)
}))





export const stageEnum = pg.pgEnum('stage', ['Idea', 'Realization', 'Completed']);                 


export const projects  = pg.pgTable("projects",{
    ...commonFields,
    name: pg.varchar("name", {length: 255}).notNull(),
    description: pg.text("description").notNull(),
    

    industriesId: pg.varchar("industries_id",{length: 255}).notNull().references(()=>industries.id),
    stage: stageEnum("stage").default('Idea'), //'Idea'
    startDate: pg.timestamp("start_date").notNull(),
    linkProject: pg.text("link_project").notNull()
    
}) 

export const industries = pg.pgTable("industries",{
    ...commonFields,
    name: pg.varchar("name", {length: 255}).notNull()
})

export const projectsRealations = relations(projects, ({one}) => ({
    industries: one(industries,{
        references: [industries.id],
        fields: [projects.industriesId]
    }),
}))
export const industriesRealations = relations(industries, ({many})=>({
    projects: many(projects)
}))