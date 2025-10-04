import type { AstroIntegration } from 'astro'
import type { FileObject } from '../lib/interfaces'
import { getDatabase, downloadFile } from '../lib/notion/client'
import { NOTION_API_SECRET, DATABASE_ID } from '../server-constants'

export default (): AstroIntegration => ({
  name: 'custom-icon-downloader',
  hooks: {
    'astro:build:start': async () => {
      // Skip if credentials are not provided or are mock values
      if (!NOTION_API_SECRET || !DATABASE_ID || 
          NOTION_API_SECRET === 'mock_secret_for_build' || 
          DATABASE_ID === 'mock_database_id') {
        console.log('Skipping custom-icon-downloader: Notion credentials not provided')
        return Promise.resolve()
      }

      const database = await getDatabase()

      if (!database.Icon || database.Icon.Type !== 'file') {
        return Promise.resolve()
      }

      const icon = database.Icon as FileObject

      let url!: URL
      try {
        url = new URL(icon.Url)
      } catch {
        console.log('Invalid Icon image URL: ', icon?.Url)
        return Promise.resolve()
      }

      return downloadFile(url)
    },
  },
})
