import rss from '@astrojs/rss'
import { getAllPosts, getDatabase } from '../lib/notion/client'
import { getPostLink } from '../lib/blog-helpers'
import { NOTION_API_SECRET, DATABASE_ID } from '../server-constants'

export async function GET() {
  // Return empty RSS feed if credentials are not provided or are mock values
  if (!NOTION_API_SECRET || !DATABASE_ID || 
      NOTION_API_SECRET === 'mock_secret_for_build' || 
      DATABASE_ID === 'mock_database_id') {
    return rss({
      title: 'Blog',
      description: 'Blog RSS Feed',
      site: import.meta.env.SITE || 'http://localhost:4321',
      items: [],
    })
  }

  const [posts, database] = await Promise.all([getAllPosts(), getDatabase()])

  return rss({
    title: database.Title,
    description: database.Description,
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: new URL(getPostLink(post.Slug), import.meta.env.SITE).toString(),
      title: post.Title,
      description: post.Excerpt,
      pubDate: new Date(post.Date),
    })),
  })
}
