import type { AstroIntegration } from 'astro'
import { getAllPosts, downloadFile } from '../lib/notion/client'
import { NOTION_API_SECRET, DATABASE_ID } from '../server-constants'

export default (): AstroIntegration => ({
  name: 'featured-image-downloader',
  hooks: {
    'astro:build:start': async () => {
      // Skip if credentials are not provided or are mock values
      if (!NOTION_API_SECRET || !DATABASE_ID || 
          NOTION_API_SECRET === 'mock_secret_for_build' || 
          DATABASE_ID === 'mock_database_id') {
        console.log('Skipping featured-image-downloader: Notion credentials not provided')
        return Promise.resolve()
      }

      const posts = await getAllPosts()

      await Promise.all(
        posts.map((post) => {
          if (!post.FeaturedImage || !post.FeaturedImage.Url) {
            return Promise.resolve()
          }

          let url!: URL
          try {
            url = new URL(post.FeaturedImage.Url)
          } catch {
            console.log('Invalid FeaturedImage URL: ', post.FeaturedImage?.Url)
            return Promise.resolve()
          }

          return downloadFile(url)
        })
      )
    },
  },
})
