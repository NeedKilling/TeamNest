import { api } from "@/server/api";

export type Industries = NonNullable<Awaited<ReturnType<typeof api.industries.get>>["data"]>[number]