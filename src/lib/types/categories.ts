import { api } from "@/server/api";

export type Categories = NonNullable<Awaited<ReturnType<typeof api.categories.get>>["data"]>[number]