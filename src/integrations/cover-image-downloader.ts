import type { AstroIntegration } from 'astro'
import { getDatabase, downloadFile } from '../lib/notion/client'
import { NOTION_API_SECRET, DATABASE_ID } from '../server-constants'

export default (): AstroIntegration => ({
  name: 'cover-image-downloader',
  hooks: {
    'astro:build:start': async () => {
      // Skip if credentials are not provided or are mock values
      if (!NOTION_API_SECRET || !DATABASE_ID || 
          NOTION_API_SECRET === 'mock_secret_for_build' || 
          DATABASE_ID === 'mock_database_id') {
        console.log('Skipping cover-image-downloader: Notion credentials not provided')
        return Promise.resolve()
      }

      const database = await getDatabase()

      if (!database.Cover || database.Cover.Type !== 'file') {
        return Promise.resolve()
      }

      let url!: URL
      try {
        url = new URL(database.Cover.Url)
      } catch {
        console.log('Invalid Cover image URL: ', database.Cover?.Url)
        return Promise.resolve()
      }

      return downloadFile(url)
    },
  },
})
