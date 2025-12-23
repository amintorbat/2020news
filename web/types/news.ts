export type NewsDetail = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  imageUrl: string | null;
  lead?: string;
  bodyHtml: string;
  sourceUrl: string;
  tags: string[];
  teams: string[];
};
