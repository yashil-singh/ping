import z from "zod";

export const sendMessageSchema = z.object({
  content: z
    .string({ required_error: "Message is required." })
    .min(1, "Message cannot be empty."),
});
