export const siteConfig = {
  name: "A2Z",
  description: "A2Z - Your complete drop shipping portal",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
