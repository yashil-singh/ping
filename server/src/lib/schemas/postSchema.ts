import { z } from "zod";

export const createPostSchema = z.object({
  caption: z.string().optional(),
  images: z.array(z.instanceof(File), {
    required_error: "Atleast one image is required.",
  }),
});

export const editPostSchema = z.object({
  postId: z.string({ required_error: "Post ID is required." }),
  caption: z.string().optional(),
});
