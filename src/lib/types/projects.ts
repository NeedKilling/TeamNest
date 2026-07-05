import { api } from "@/server/api";

export type Projects = NonNullable<Awaited<ReturnType<typeof api.projects.get>>["data"]>[number]