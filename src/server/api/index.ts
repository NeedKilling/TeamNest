import Elysia from "elysia";
import { projectsRouter } from "./routers/project";
import { industriesRouter } from "./routers/industries";
import { personnelRouter } from "./routers/personnel";
import { specializationRouter } from "./routers/specialization";
import { categoriesRouter } from "./routers/categories";
import { treaty } from "@elysiajs/eden";

export const app = new Elysia({
    prefix: "/api",
})
.use(projectsRouter)
.use(industriesRouter)
.use(personnelRouter)
.use(specializationRouter)
.use(categoriesRouter)

.get("/", ()=>{
    return "hello"
})
.get("/test", ()=>{
    return "hello test"
})

export const api = treaty(app).api

export type App = typeof app;