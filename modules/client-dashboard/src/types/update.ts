export type Update = {
  id?: number;
  slug?: string;
  title: string;
  description?: string;
  date?: string; // ISO string e.g. YYYY-MM-DD
  author?: string;
  link?: string; // href to detail page
  preview?: string; // URL to live preview (e.g. Vercel)
};
