import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { BlogPost, Project, SiteContent } from "./content";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<Partial<SiteContent> | null> => {
    const supabase = publicClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return null;
    const out: Record<string, unknown> = {};
    for (const row of data) out[row.key] = row.value;
    return out as Partial<SiteContent>;
  },
);

export const getPublicProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[] | null> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, year, summary, tags, href, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return null;
    return data as Project[];
  },
);

export const getPublicBlogPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[] | null> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, body, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data) return null;
    return data as BlogPost[];
  },
);
