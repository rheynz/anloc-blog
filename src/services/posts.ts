import { getCollection } from 'astro:content';

export interface Post {
	id: string;
	slug: string;
	title: string;
	publishedAt: Date;
	tags: string[];
	excerpt?: string;
	content: string;
}

const mapEntryToPost = (entry: any): Post => ({
	id: entry.slug,
	slug: entry.slug,
	title: entry.data.title,
	publishedAt: entry.data.publishedAt,
	tags: entry.data.tags || [],
	excerpt: entry.data.excerpt,
	content: entry.body ?? '',
});

export const getPosts = async (): Promise<Post[]> => {
	const entries = await getCollection('posts');
	const posts = entries.map(mapEntryToPost);
	return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

export const getRecentPosts = async (count: number): Promise<Post[]> => {
	const posts = await getPosts();
	return posts.slice(0, count);
};

export const getPost = async (id: string): Promise<Post | null> => {
	const entries = await getCollection('posts');
	const entry = entries.find((e) => e.slug === id);
	if (!entry) return null;
	return mapEntryToPost(entry);
};

export const getPostBySlug = getPost;

export const getAllTags = async (): Promise<string[]> => {
	const posts = await getPosts();
	const allTags = posts.flatMap((p) => p.tags || []);
	return Array.from(new Set(allTags));
};

export const getPostsByTag = async (tag: string): Promise<Post[]> => {
	const posts = await getPosts();
	return posts.filter((p) => p.tags.includes(tag));
};

// Writes NOT supported in Cloudflare Pages/Workers (no filesystem access).
export const createPost = async (_postData: {
	title: string;
	content: string;
	tags: string[];
	excerpt?: string;
}) => {
	throw new Error('createPost not supported in this environment. Use git-based workflow or external write API (R2/S3).');
};

export const updatePost = async (
	_id: string,
	_postData: { title: string; content: string; tags: string[]; excerpt?: string }
) => {
	throw new Error('updatePost not supported in this environment. Use git-based workflow or external write API (R2/S3).');
};

export const deletePost = async (_id: string) => {
	throw new Error('deletePost not supported in this environment. Use git-based workflow or external write API (R2/S3).');
};
