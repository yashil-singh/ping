import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string({ required_error: "Comment can't be empty." })
    .min(1, "Comment can't be empty."),
  postId: z.string({ required_error: "Post ID is required." }),
});

export const editCommentSchema = z.object({
  content: z
    .string({ required_error: "Comment can't be empty." })
    .min(1, "Comment can't be empty."),
  commentId: z.string({ required_error: "Comment ID is required." }),
});

export const createReplySchema = z.object({
  content: z
    .string({ required_error: "Comment can't be empty." })
    .min(1, "Comment can't be empty."),
  commentId: z.string({ required_error: "Comment ID is required." }),
  replyToId: z.string({ required_error: "User ID to reply is required." }),
});

export const editReplySchema = z.object({
  content: z
    .string({ required_error: "Comment can't be empty." })
    .min(1, "Comment can't be empty."),
  replyId: z.string({ required_error: "Reply ID is required." }),
});
