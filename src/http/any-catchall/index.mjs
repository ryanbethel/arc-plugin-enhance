import path from 'path'
import url from 'url'
import arc from '@architect/functions'
import router from './router.mjs'

export function createRouter (base) {
  if (!base) {
    let here = path.dirname(url.fileURLToPath(import.meta.url))
    base = path.join(here, 'node_modules', '@architect', 'views')
  }
  // return arc.http.async(router.bind({}, { basePath: base }))
  return arc.http.async(router.bind({}, { basePath: 'http://localhost:3333/_public/app/' }))
}

export const handler = createRouter()
