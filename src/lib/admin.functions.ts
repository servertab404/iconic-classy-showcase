import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { BlogPost, Project, SiteContent } from "./content";

const projectInput = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  year: z.string().default(""),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([]),
  href: z.string().default(""),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const postInput = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().default(""),
  published: z.boolean().default(false),
});

export const getAdminContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({ context }): Promise<{
      site: Partial<SiteContent>;
      projects: Project[];
      posts: BlogPost[];
    }> => {
    const [content, projects, posts] = await Promise.all([
      context.supabase.from("site_content").select("key, value"),
      context.supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      context.supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);
    if (content.error) throw new Error(content.error.message);
    if (projects.error) throw new Error(projects.error.message);
    if (posts.error) throw new Error(posts.error.message);
      const site: Record<string, unknown> = {};
      for (const row of content.data) site[row.key] = row.value;
      return {
        site: site as Partial<SiteContent>,
        projects: projects.data as Project[],
        posts: posts.data as BlogPost[],
      };
    },
  );

export const upsertSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ key: z.string().min(1), value: z.unknown() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectInput.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    const query = id
      ? context.supabase.from("projects").update(fields).eq("id", id)
      : context.supabase.from("projects").insert(fields);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => postInput.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    const query = id
      ? context.supabase.from("blog_posts").update(fields).eq("id", id)
      : context.supabase.from("blog_posts").insert(fields);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
