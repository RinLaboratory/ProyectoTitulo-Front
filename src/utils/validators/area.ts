import z from "zod";

export const AreaSchema = z.object({
  _id: z.string().uuid(),
  value: z.string(),
  label: z.string(),
  nextId: z.string(),
  isClass: z.boolean(),
});

export type TArea = z.infer<typeof AreaSchema>;

export const InsertAreaSchema = AreaSchema.pick({
  label: true,
  value: true,
  isClass: true,
  nextId: true,
});

export type TInsertArea = z.infer<typeof InsertAreaSchema>;
