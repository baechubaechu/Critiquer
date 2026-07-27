export type SourceEntry = {
  id: string;
  title: string;
  creator?: string;
  year?: number;

  type:
    | "book"
    | "essay"
    | "lecture"
    | "interview"
    | "official-project-page"
    | "archive"
    | "academic-source";

  publisher?: string;
  url?: string;
  notes: string;
};
