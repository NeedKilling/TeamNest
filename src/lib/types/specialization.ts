import { api } from "@/server/api";

export type Specialization = NonNullable<Awaited<ReturnType<typeof api.specialization.get>>["data"]>[number]
