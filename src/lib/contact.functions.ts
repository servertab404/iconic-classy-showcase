import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email").max(255, "Email is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim(),
    });

    if (error) {
      console.error("Contact submission failed:", error);
      throw new Error("Unable to send message right now. Please try again later.");
    }

    return { success: true };
  });
