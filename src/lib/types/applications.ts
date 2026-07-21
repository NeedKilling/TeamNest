import { api } from "@/server/api";
import { applications } from "@/server/db/applications";
import { industries, projects, user } from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Personnel } from "./personnel";
import { Vacancy } from "./vacancy";


export type MyApplications = NonNullable<Awaited<ReturnType<typeof api.applications.my.get>>["data"]>[number];



export type ProjectApplicationsData = NonNullable<Awaited<ReturnType<typeof api.applications.invite.get>>['data']>[number];

// export type Members = NonNullable<Awaited<ReturnType<typeof api.applications.members.get>>['data']>[number];
