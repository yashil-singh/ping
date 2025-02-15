import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string({ required_error: "Comment is required." })
    .min(1, "Message cannot be empty."),
});
