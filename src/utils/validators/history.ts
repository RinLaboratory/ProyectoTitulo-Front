import z from "zod";

export const HistorySentSchema = z.enum(["Clase", "Casa", "Urgencias", ""]);

export type THistorySent = z.infer<typeof HistorySentSchema>;

export const HistorySchema = z.object({
  _id: z.string().uuid(),
  personId: z.string(),
  timestamp: z.date(),
  sintomas: z.string(),
  tratamiento: z.string(),
  enviado: HistorySentSchema,
});

export type THistory = z.infer<typeof HistorySchema>;

export const InsertHistorySchema = HistorySchema.pick({
  enviado: true,
  sintomas: true,
  tratamiento: true,
});

export type TInsertHistory = z.infer<typeof InsertHistorySchema>;
