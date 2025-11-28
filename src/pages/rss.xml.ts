import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();


export const GET: APIRoute = async (context) => {
    const posts = await getCollection('posts');
    
    return rss({
        // `<title>` field in output xml
        title: 'MyBlog | Anloc',
        // `<description>` field in output xml
        description: 'A simple blog built with Astro.',
        // Base URL for RSS links
        // IMPORTANT: Update this with your own domain
        site: context.site?.toString() || 'http://localhost:4321',
        // List of `<item>`s in output xml
        items: posts.map((post) => ({
            link: `/posts/${post.slug}/`,
            title: post.data.title,
            pubDate: post.data.publishedAt,
            description: post.data.excerpt,
            content: sanitizeHtml(parser.render(post.body)),
        })),
        // (optional) inject custom xml
        customData: `<language>en-us</language>`,
    });
}
