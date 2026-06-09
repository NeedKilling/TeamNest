import z from "zod/v4"

export const industriesSchema = z.object({
    name: z.string({message: "Введите назввание отрасли"})
})