import Elysia from "elysia";
import { projectsRouter } from "./routers/project";
import { industriesRouter } from "./routers/industries";
import { personnelRouter } from "./routers/personnel";
import { specializationRouter } from "./routers/specialization";
import { categoriesRouter } from "./routers/categories";
import { treaty } from "@elysiajs/eden";
import { auth } from "../auth/auth";
import { filesRouter } from "./routers/files";

export const app = new Elysia({
    prefix: "/api",
})

.mount(auth.handler)

.use(projectsRouter)
.use(industriesRouter)
.use(personnelRouter)
.use(specializationRouter)
.use(categoriesRouter)
.use(filesRouter)

.get("/", ()=>{
    return "hello"
})
.get("/test", ()=>{
    return "hello test"
})

export const api = treaty(app).api

export type App = typeof app;