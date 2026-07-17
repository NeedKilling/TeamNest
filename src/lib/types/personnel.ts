import { api } from "@/server/api";
import { personnel } from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

// export type Personnel = InferSelectModel<typeof personnel>;
export type Personnel = NonNullable<Awaited<ReturnType<typeof api.personnel.all.get>>["data"]>[number]
// export type Personnel = Awaited<ReturnType<typeof api.personnel.get>>["data"]