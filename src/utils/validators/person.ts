import z from "zod";

export const PersonSchema = z.object({
  _id: z.string().uuid(),
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

export const InsertPersonSchema = PersonSchema.pick({
  rut: true,
  name: true,
  lastname: true,
  phone: true,
  insurance: true,
  address: true,
  bloodType: true,
  areaId: true,
  Rname: true,
  Rlastname: true,
  Rphone: true,
  EmergencyContact: true,
});

export type TInsertPerson = z.infer<typeof InsertPersonSchema>;
