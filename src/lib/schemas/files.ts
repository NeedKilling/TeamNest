import z from "zod/v4"


export const filesSchema = z.object({
    file: z.instanceof(File)
})