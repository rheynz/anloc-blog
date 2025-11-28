import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getCollection } from 'astro:content';

interface Post {
    id: string;
    slug: string;
    title: string;
    content: string;
    publishedAt: Date;
    tags: string[];
    excerpt?: string;
}

const postsDir = path.resolve(process.cwd(), 'src/content/posts');

const slugify = (text: string) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const mapContentEntry = (entry) => ({
    id: entry.slug,
    slug: entry.slug,
    title: entry.data.title,
    publishedAt: entry.data.publishedAt,
    tags: entry.data.tags || [],
    excerpt: entry.data.excerpt,
    content: entry.body,
});

export const getPosts = async () => {
    const entries = await getCollection('posts');
    const posts = entries.map(mapContentEntry);
    return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

export const getRecentPosts = async (count: number) => {
    const posts = await getPosts();
    return posts.slice(0, count);
};

export const getAllTags = async () => {
    const posts = await getPosts();
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
};

export const getPostsByTag = async (tag: string) => {
    const posts = await getPosts();
    return posts.filter(post => post.tags.includes(tag));
};

export const getPost = async (id: string) => {
    const posts = await getPosts();
    // For the editor, we need the raw content string, not the rendered component.
    // The previous getPost logic is better here as it returns the raw markdown. Let's reuse it.
    const filePath = path.join(postsDir, `${id}.md`);
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
            id,
            slug: id,
            title: data.title,
            publishedAt: new Date(data.publishedAt),
            tags: data.tags || [],
            excerpt: data.excerpt,
            content,
        };
    } catch (error) {
        return null;
    }
};

export const createPost = async (postData: { title: string, content: string, tags: string[], excerpt?: string }) => {
    const slug = slugify(postData.title);
    const post = {
        title: postData.title,
        publishedAt: new Date(),
        tags: postData.tags,
        excerpt: postData.excerpt,
    };
    const fileContent = matter.stringify(postData.content, post);
    const filePath = path.join(postsDir, `${slug}.md`);
    await fs.mkdir(postsDir, { recursive: true });
    await fs.writeFile(filePath, fileContent);
    return { slug };
};

export const updatePost = async (id: string, postData: { title: string, content: string, tags: string[], excerpt?: string }) => {
    const originalPost = await getPost(id);
    if (!originalPost) return;

    const post = {
        title: postData.title,
        publishedAt: originalPost.publishedAt, // Keep original date
        tags: postData.tags,
        excerpt: postData.excerpt,
    };
    const fileContent = matter.stringify(postData.content, post);
    const filePath = path.join(postsDir, `${id}.md`); // ALWAYS use the original id/slug

    await fs.writeFile(filePath, fileContent);
};

export const deletePost = async (id: string) => {
    const filePath = path.join(postsDir, `${id}.md`);
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        return false;
    }
};
