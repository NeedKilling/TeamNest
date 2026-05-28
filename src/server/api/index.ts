import Elysia from "elysia";
import { projectsRouter } from "./routers/project";

export const app = new Elysia({
    prefix: "/api",
})
.use(projectsRouter)
.get("/", ()=>{
    return "hello"
})
.get("/test", ()=>{
    return "hello test"
})