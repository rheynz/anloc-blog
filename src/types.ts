export interface Post {
    id: string;
    slug: string;
    title: string;
    publishedAt: Date;
    tags: string[];
    excerpt?: string;
    content: string; // This will hold the raw markdown body
}
