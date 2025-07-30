import z from "zod";
import type { TArea, TPerson } from "./";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLogin = z.infer<typeof LoginSchema>;

export const UpdatePasswordSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

export type TUpdatePassword = z.infer<typeof UpdatePasswordSchema>;

export const SearchPersonSchema = z.object({
  name: z.string(),
  area: z.string(),
});

export type TSearchPerson = z.infer<typeof SearchPersonSchema>;

export type TPersonState = "reposo" | "retirado" | "atendido";

export interface TIndexData {
  atendido: TPerson[];
  reposo: TPerson[];
  retirado: TPerson[];
  areas: TArea[];
}
