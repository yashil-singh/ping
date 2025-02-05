import { z } from "zod";
import { USERNAME_PATTERN } from "../contants";

export const editProfileSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(3, "Name must be atleast 3 characters.")
    .max(30, "Name must be atmost 30 characters"),
  username: z
    .string({ required_error: "Username is required." })
    .min(5, "Username must be atleast 5 characters.")
    .max(30, "Username must be atmost 30 characters")
    .regex(
      USERNAME_PATTERN,
      "Username can only contain letters, numbers, and @, _, . characters."
    ),
  bio: z.string().optional(),
  oldAvatar: z.string().optional(),
  newAvatar: z.instanceof(File, { message: "Invalid file." }).optional(),
});
