import z from "zod";

export const UserSchema = z.object({
  _id: z.string().uuid(),
  username: z.string(),
  usernameE: z.string(),
  email: z.string().email(),
  password_id: z.string(),
  rol: z.string(),
});

export type TSafeUser = z.infer<typeof UserSchema>;

export const InsertUserSchema = UserSchema.pick({
  email: true,
  username: true,
}).extend({
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export type TInsertUser = z.infer<typeof InsertUserSchema>;
