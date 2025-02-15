import z from "zod";

export const commentSchema = z.object({
  content: z
    .string({ required_error: "Comment is required." })
    .min(1, "Message cannot be empty."),
});

export const replySchema = z.object({
  content: z
    .string({ required_error: "Comment is required." })
    .min(1, "Message cannot be empty."),
  replyToId: z.string({ required_error: "User ID to reply is required." }),
});
