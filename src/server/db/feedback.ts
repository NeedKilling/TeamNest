import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const feedback = pg.pgTable("feedback",{
    ...commonFields,
    name: pg.varchar("name",{length: 255}).notNull(),
    email: pg.varchar("email",{length: 255}).notNull(),
    message: pg.text("message").notNull()
})