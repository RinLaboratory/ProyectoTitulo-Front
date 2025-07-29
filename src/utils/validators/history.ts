import z from "zod";

export const HistorySchema = z.object({
  _id: z.string().uuid(),
  personId: z.string(),
  timestamp: z.date(),
  sintomas: z.string(),
  tratamiento: z.string(),
  enviado: z.string(),
});

export type THistory = z.infer<typeof HistorySchema>;

export const InsertHistorySchema = HistorySchema.pick({
  enviado: true,
  sintomas: true,
  tratamiento: true,
});

export type TInsertHistory = z.infer<typeof InsertHistorySchema>;
