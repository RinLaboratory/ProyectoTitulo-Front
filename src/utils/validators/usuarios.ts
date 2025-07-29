import z from "zod";

export const UserSchema = z.object({
  _id: z.string().uuid(),
  username: z.string(),
  usernameE: z.string(),
  email: z.string(),
  password_id: z.string(),
  rol: z.string(),
});

export type TSafeUser = z.infer<typeof UserSchema>;
