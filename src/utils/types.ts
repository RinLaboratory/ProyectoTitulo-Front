import z from "zod";

export const idSchema = z.object({
  _id: z.string().uuid(),
});

export type TId = z.infer<typeof idSchema>;

export const PersonSchema = z.object({
  ...idSchema.shape,
  rut: z.string(),
  name: z.string(),
  nameE: z.string(),
  lastname: z.string(),
  lastnameE: z.string(),
  phone: z.string(),
  insurance: z.string(),
  address: z.string(),
  bloodType: z.string(),
  areaId: z.string(),
  Rname: z.string(),
  Rlastname: z.string(),
  Rphone: z.string(),
  EmergencyContact: z.string(),
});

export type TPerson = z.infer<typeof PersonSchema>;

export const AreaSchema = z.object({
  ...idSchema.shape,
  value: z.string(),
  label: z.string(),
  nextId: z.string(),
  isClass: z.boolean(),
});

export type TArea = z.infer<typeof AreaSchema>;

export const UserSchema = z.object({
  ...idSchema.shape,
  username: z.string(),
  usernameE: z.string(),
  email: z.string(),
  password_id: z.string(),
  rol: z.string(),
});

export type TSafeUser = z.infer<typeof UserSchema>;

export const HistorySchema = z.object({
  ...idSchema.shape,
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

export type TPersonState = "reposo" | "retirado" | "atendido";

export interface TIndexData {
  atendido: TPerson[];
  reposo: TPerson[];
  retirado: TPerson[];
  areas: TArea[];
}
