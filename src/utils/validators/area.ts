import z from "zod";

export const AreaSchema = z.object({
  _id: z.string().uuid(),
  value: z.string(),
  label: z.string(),
  nextId: z.string(),
  isClass: z.boolean(),
});

export type TArea = z.infer<typeof AreaSchema>;
