import Elysia from "elysia";
import { projectsRouter } from "./routers/project";
import { industriesRouter } from "./routers/industries";
import { personnelRouter } from "./routers/personnel";
import { specializationRouter } from "./routers/specialization";
import { categoriesRouter } from "./routers/categories";
import { treaty } from "@elysiajs/eden";
import { auth } from "../auth/auth";
import { filesRouter } from "./routers/files";


export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const app = new Elysia({
    prefix: "/api",
})
.onError(({ code, error, set }) => {
      if (error instanceof AppError) {
      set.status = error.status;
      return {
          message: error.message,
          code: error.code,
          status: error.status,
    };
  }

    if (code === 'VALIDATION') {
      set.status = 422;
        return {
            message: error.message || 'Validation error',
            code: 'validation',
            status: 422,
      };
    }

     set.status = 500;
      console.error('Unhandled error:', error);
      return {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500,
      };


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