import { z } from "zod/v4";

export const statusEnum = z.enum(["pending" , "accepted" , "rejected"]);                 
export type Status = z.infer<typeof statusEnum>
export const typeEnum = z.enum(["application", "invitation"])

export const statusLabels: Record<Status, string> = {
  pending: "На рассмотрении",
  accepted: "Одобрено",
  rejected: "Отказ"
}

export const applicationSchema = z.object({
    userId: z.string(),
    projectId: z.string(),
    status: statusEnum,
    vacancyId: z.string().optional(),
    type:  typeEnum,
})
