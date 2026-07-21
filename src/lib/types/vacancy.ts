import { api } from "@/server/api";

export type Vacancy = NonNullable<Awaited<ReturnType<ReturnType<typeof api.vacancies>["get"]>>["data"]>;