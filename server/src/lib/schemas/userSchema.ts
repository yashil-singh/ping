import z from "zod";
import { USERNAME_PATTERN } from "../contants";

export const editProfileSchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  username: z
    .string({ required_error: "Username is required." })
    .min(2, "Username must be at least 2 characters.")
    .regex(
      USERNAME_PATTERN,
      "Username can only contain letters, numbers, and @, _, . characters.",
    ),
  bio: z.string().nullable().optional(),
});

export const toggleConnectionSchema = z.object({
  userId: z.string({ required_error: "User ID to follow is required." }),
});

export const followRequestActionSchema = z.object({
  userId: z.string({ required_error: "User ID is required." }),
  action: z.string({ required_error: "Action is required." }),
});
