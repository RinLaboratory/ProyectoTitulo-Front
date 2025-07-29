import z from "zod";
import type { TArea, TPerson } from "./";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLogin = z.infer<typeof LoginSchema>;

export type TPersonState = "reposo" | "retirado" | "atendido";

export interface TIndexData {
  atendido: TPerson[];
  reposo: TPerson[];
  retirado: TPerson[];
  areas: TArea[];
}
