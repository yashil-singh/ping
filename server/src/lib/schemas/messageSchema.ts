import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string({ required_error: "Receiver ID is required." }),
  content: z.string().optional(),
});

export const editMessageSchema = z.object({
  messageId: z.string({ required_error: "Message ID is required." }),
  content: z
    .string({ required_error: "Message can't be empty." })
    .min(1, "Message can't be empty."),
});
