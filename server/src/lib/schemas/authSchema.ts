import z from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be minimun 2 characters.")
    .max(30, "Name must be maximum 30 characters."),
  username: z.string({ required_error: "Username is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
  password: z.string({ required_error: "Password is required." }),
});
