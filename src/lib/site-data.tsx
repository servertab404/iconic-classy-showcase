import { createContext, useContext } from "react";
import {
  FALLBACK_CONTENT,
  FALLBACK_PROJECTS,
  type BlogPost,
  type Project,
  type SiteContent,
} from "./content";

export type SiteData = {
  content: SiteContent;
  projects: Project[];
  posts: BlogPost[];
};

export const DEFAULT_SITE_DATA: SiteData = {
  content: FALLBACK_CONTENT,
  projects: FALLBACK_PROJECTS,
  posts: [],
};

const SiteDataContext = createContext<SiteData>(DEFAULT_SITE_DATA);

export function SiteDataProvider({
  value,
  children,
}: {
  value: SiteData | undefined;
  children: React.ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={value ?? DEFAULT_SITE_DATA}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteData {
  return useContext(SiteDataContext) ?? DEFAULT_SITE_DATA;
}

export function buildSiteData(
  site: Partial<SiteContent> | null,
  projects: Project[] | null,
  posts: BlogPost[] | null,
): SiteData {
  const content: SiteContent = {
    hero_tagline: site?.hero_tagline || FALLBACK_CONTENT.hero_tagline,
    about_paragraphs:
      site?.about_paragraphs && site.about_paragraphs.length
        ? site.about_paragraphs
        : FALLBACK_CONTENT.about_paragraphs,
    contact_email: site?.contact_email || FALLBACK_CONTENT.contact_email,
    skills: site?.skills && site.skills.length ? site.skills : FALLBACK_CONTENT.skills,
    education: site?.education || FALLBACK_CONTENT.education,
  };
  return {
    content,
    projects: projects && projects.length ? projects : FALLBACK_PROJECTS,
    posts: posts ?? [],
  };
}
