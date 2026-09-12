import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteBlogPost,
  deleteProject,
  getAdminContent,
  saveBlogPost,
  saveProject,
  upsertSiteContent,
} from "@/lib/admin.functions";
import type { BlogPost, Education, Project, Skill } from "@/lib/content";
import { FALLBACK_CONTENT } from "@/lib/content";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Iconic Classy" },
      { name: "description", content: "Edit portfolio content." },
      { property: "og:title", content: "Admin — Iconic Classy" },
      { property: "og:description", content: "Edit portfolio content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const inputCls =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "block font-mono text-[11px] tracking-widest text-muted-foreground uppercase";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAdmin = useServerFn(getAdminContent);
  const { data } = useQuery({ queryKey: ["admin-content"], queryFn: () => fetchAdmin() });
  const [tab, setTab] = useState<"site" | "projects" | "blog">("site");
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-content"] });
  const onError = (e: unknown) => setNotice(e instanceof Error ? e.message : "Something failed");

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Iconic Classy
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold">Content admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">
            View site
          </a>
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-primary"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        {(["site", "projects", "blog"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 font-mono text-xs tracking-widest uppercase ${
              tab === t ? "bg-gradient-accent text-primary-foreground" : "border border-border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {notice ? <p className="mt-4 text-sm text-amber">{notice}</p> : null}

      <div className="mt-8">
        {tab === "site" && data ? (
          <SiteTab site={data.site} refresh={refresh} onError={onError} setNotice={setNotice} />
        ) : null}
        {tab === "projects" && data ? (
          <ProjectsTab projects={data.projects} refresh={refresh} onError={onError} setNotice={setNotice} />
        ) : null}
        {tab === "blog" && data ? (
          <BlogTab posts={data.posts} refresh={refresh} onError={onError} setNotice={setNotice} />
        ) : null}
      </div>
    </div>
  );
}

type TabProps = {
  refresh: () => void;
  onError: (e: unknown) => void;
  setNotice: (m: string | null) => void;
};

function SiteTab({
  site,
  refresh,
  onError,
  setNotice,
}: TabProps & { site: Partial<import("@/lib/content").SiteContent> }) {
  const save = useServerFn(upsertSiteContent);
  const [tagline, setTagline] = useState(site.hero_tagline ?? FALLBACK_CONTENT.hero_tagline);
  const [about, setAbout] = useState(
    (site.about_paragraphs ?? FALLBACK_CONTENT.about_paragraphs).join("\n\n"),
  );
  const [email, setEmail] = useState(site.contact_email ?? FALLBACK_CONTENT.contact_email);
  const edu = site.education ?? FALLBACK_CONTENT.education;
  const [education, setEducation] = useState<Education>(edu);
  const [skills, setSkills] = useState<Skill[]>(site.skills ?? FALLBACK_CONTENT.skills);

  const mutation = useMutation({
    mutationFn: async (entries: [string, unknown][]) => {
      for (const [key, value] of entries) await save({ data: { key, value } });
    },
    onSuccess: () => {
      setNotice("Saved.");
      refresh();
    },
    onError,
  });

  return (
    <div className="space-y-6">
      <div className="glass gradient-border space-y-5 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Text</h2>
        <Field label="Hero tagline">
          <textarea value={tagline} onChange={(e) => setTagline(e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="About paragraphs (blank line between paragraphs)">
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={6} className={inputCls} />
        </Field>
        <Field label="Contact email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
      </div>

      <div className="glass gradient-border space-y-5 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Education</h2>
        {(["program", "university", "period", "note"] as const).map((k) => (
          <Field key={k} label={k}>
            <input
              value={education[k]}
              onChange={(e) => setEducation({ ...education, [k]: e.target.value })}
              className={inputCls}
            />
          </Field>
        ))}
      </div>

      <div className="glass gradient-border space-y-5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Skills</h2>
          <button
            onClick={() => setSkills([...skills, { name: "", status: "", value: 0 }])}
            className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-primary"
          >
            Add skill
          </button>
        </div>
        {skills.map((skill, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <Field label="Name">
              <input
                value={skill.name}
                onChange={(e) => setSkills(skills.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)))}
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <input
                value={skill.status}
                onChange={(e) => setSkills(skills.map((s, j) => (j === i ? { ...s, status: e.target.value } : s)))}
                className={inputCls}
              />
            </Field>
            <Field label="Percent">
              <input
                type="number"
                min={0}
                max={100}
                value={skill.value}
                onChange={(e) =>
                  setSkills(skills.map((s, j) => (j === i ? { ...s, value: Number(e.target.value) } : s)))
                }
                className={inputCls}
              />
            </Field>
            <button
              onClick={() => setSkills(skills.filter((_, j) => j !== i))}
              className="rounded-md border border-border px-3 py-2 font-mono text-xs text-destructive hover:border-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setNotice(null);
          mutation.mutate([
            ["hero_tagline", tagline],
            ["about_paragraphs", about.split(/\n\s*\n/).filter(Boolean)],
            ["contact_email", email],
            ["education", education],
            ["skills", skills.filter((s) => s.name.trim())],
          ]);
        }}
        disabled={mutation.isPending}
        className="bg-gradient-accent rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save site content"}
      </button>
    </div>
  );
}

const emptyProject = { title: "", year: "", summary: "", tags: "", href: "", published: true };

function ProjectsTab({ projects, refresh, onError, setNotice }: TabProps & { projects: Project[] }) {
  const save = useServerFn(saveProject);
  const remove = useServerFn(deleteProject);
  const [draft, setDraft] = useState(emptyProject);
  const [editing, setEditing] = useState<Project | null>(null);

  const toPayload = (p: typeof emptyProject, id?: string) => ({
    ...(id ? { id } : {}),
    title: p.title,
    year: p.year,
    summary: p.summary,
    tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
    href: p.href,
    published: p.published,
    sort_order: 0,
  });

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof save>[0]["data"]) => save({ data: payload }),
    onSuccess: () => {
      setNotice("Saved.");
      setDraft(emptyProject);
      setEditing(null);
      refresh();
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setNotice("Deleted.");
      refresh();
    },
    onError,
  });

  const form = (p: typeof emptyProject, setP: (v: typeof emptyProject) => void, id?: string) => (
    <div className="glass gradient-border space-y-4 rounded-2xl p-6">
      <Field label="Title">
        <input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Year">
        <input value={p.year} onChange={(e) => setP({ ...p, year: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Summary">
        <textarea value={p.summary} onChange={(e) => setP({ ...p, summary: e.target.value })} rows={4} className={inputCls} />
      </Field>
      <Field label="Tags (comma separated)">
        <input value={p.tags} onChange={(e) => setP({ ...p, tags: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Link">
        <input value={p.href} onChange={(e) => setP({ ...p, href: e.target.value })} className={inputCls} />
      </Field>
      <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={p.published}
          onChange={(e) => setP({ ...p, published: e.target.checked })}
        />
        Published (visible on site)
      </label>
      <button
        onClick={() => {
          setNotice(null);
          mutation.mutate(toPayload(p, id));
        }}
        disabled={mutation.isPending || !p.title.trim()}
        className="bg-gradient-accent rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {id ? "Save changes" : "Add project"}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {projects.map((p) =>
        editing?.id === p.id ? (
          <div key={p.id}>
            {form(
              { title: p.title, year: p.year, summary: p.summary, tags: p.tags.join(", "), href: p.href, published: p.published },
              (v) => setEditing({ ...p, ...v, tags: v.tags.split(",").map((t) => t.trim()).filter(Boolean) } as Project),
              p.id,
            )}
            <button onClick={() => setEditing(null)} className="mt-2 font-mono text-xs text-muted-foreground">
              Cancel
            </button>
          </div>
        ) : (
          <div key={p.id} className="glass flex items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="font-display font-semibold">{p.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {p.published ? "Published" : "Hidden"} · {p.href || "no link"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-primary">
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(p.id)}
                className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-destructive hover:border-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        ),
      )}
      <h3 className="font-display text-lg font-semibold">Add a project</h3>
      {form(draft, setDraft)}
    </div>
  );
}

const emptyPost = { title: "", slug: "", body: "", published: false };

function BlogTab({ posts, refresh, onError, setNotice }: TabProps & { posts: BlogPost[] }) {
  const save = useServerFn(saveBlogPost);
  const remove = useServerFn(deleteBlogPost);
  const [draft, setDraft] = useState(emptyPost);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyPost);

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof save>[0]["data"]) => save({ data: payload }),
    onSuccess: () => {
      setNotice("Saved.");
      setDraft(emptyPost);
      setEditingId(null);
      refresh();
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setNotice("Deleted.");
      refresh();
    },
    onError,
  });

  const postForm = (
    p: typeof emptyPost,
    setP: (v: typeof emptyPost) => void,
    id?: string,
  ) => (
    <div className="glass gradient-border space-y-4 rounded-2xl p-6">
      <Field label="Title">
        <input
          value={p.title}
          onChange={(e) => {
            const title = e.target.value;
            setP({
              ...p,
              title,
              slug: p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            });
          }}
          className={inputCls}
        />
      </Field>
      <Field label="Slug">
        <input value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Body">
        <textarea value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} rows={8} className={inputCls} />
      </Field>
      <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <input type="checkbox" checked={p.published} onChange={(e) => setP({ ...p, published: e.target.checked })} />
        Published (visible on site)
      </label>
      <button
        onClick={() => {
          setNotice(null);
          mutation.mutate({ ...(id ? { id } : {}), ...p });
        }}
        disabled={mutation.isPending || !p.title.trim() || !p.slug.trim()}
        className="bg-gradient-accent rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {id ? "Save changes" : "Add post"}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {posts.map((post) =>
        editingId === post.id ? (
          <div key={post.id}>
            {postForm(editDraft, setEditDraft, post.id)}
            <button onClick={() => setEditingId(null)} className="mt-2 font-mono text-xs text-muted-foreground">
              Cancel
            </button>
          </div>
        ) : (
          <div key={post.id} className="glass flex items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="font-display font-semibold">{post.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {post.published ? "Published" : "Draft"} · /{post.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(post.id);
                  setEditDraft({ title: post.title, slug: post.slug, body: post.body, published: post.published });
                }}
                className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-primary"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(post.id)}
                className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-destructive hover:border-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        ),
      )}
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet — add your first below.</p>
      ) : null}
      <h3 className="font-display text-lg font-semibold">Add a post</h3>
      {postForm(draft, setDraft)}
    </div>
  );
}

// Silence unused-import lint for useEffect if tree-shaken differently
void useEffect;
