import z from "zod";

export const deletePostSchema = z.object({
  postId: z.string({ required_error: "Post ID is required." }),
});
