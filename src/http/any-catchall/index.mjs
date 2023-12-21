import path from 'path'
import url from 'url'
import arc from '@architect/functions'
import router from './router.mjs'

import { projectMap } from './project-map.mjs'


export function createRouter (base) {
  if (!base) {
    let here = path.dirname(url.fileURLToPath(import.meta.url))
    base = path.join(here, 'node_modules', '@architect', 'views')
  }
  // return arc.http.async(router.bind({}, { basePath: base }))
  // return arc.http.async(router.bind({}, { basePath: 'http://localhost:3333/_public/repl-store/xyz/app' }))
  return arc.http.async(router.bind({}, { resourceMap: projectMap }))
}

export const handler = createRouter()
