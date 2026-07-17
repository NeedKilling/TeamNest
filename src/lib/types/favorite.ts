import { api } from "@/server/api";


export type FavoriteProjects = NonNullable<Awaited<ReturnType<typeof api.favoriteProjects.get>>["data"]>[number]
export type FavoritePersonnel = NonNullable<Awaited<ReturnType<typeof api.favoritePersonnel.get>>["data"]>[number]