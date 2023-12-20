import path from 'path'
import { pathToFileURL } from 'url'

import { pathToRegexp } from 'path-to-regexp'

import getFiles from './_get-files.mjs'
import sort from './_sort-routes.mjs'
import clean from './_clean.mjs'
import joinUrlParts from './_join-url.mjs'

// cheap memoize for warm lambda
const cache = {}

/** helper to get module for given folder/route */
export default async function getModule ({ basePath, folder, route, projectMap }) {
  if (projectMap) {
    let keys = Object.keys(projectMap[folder]).sort(sort)
    let copy = keys.slice(0).map(p => clean({ pathTmpl: p, base: `app/${folder}`, fileNameRegEx: /index\.html|index\.mjs|\.mjs|\.html/ })).map(p => pathToRegexp(p))

    let index = 0
    let found = false

    for (let r of copy) {
      if (r.test(route)) {
        found = keys[index]
        break
      }
      index += 1
    }

    return found ? { ...projectMap[folder]?.[found], path: found }  : false
  }



  if (!cache[basePath])
    cache[basePath] = {}

  if (!cache[basePath][folder])
    cache[basePath][folder] = {}

  if (!cache[basePath][folder][route]) {

    let raw = (await getFiles({ basePath, folder, projectMap })).sort(sort)
    let copy

    let base = path.join(basePath, folder)
    let basePathname = pathToFileURL(base).pathname
    copy = raw.slice(0).map(p => pathToFileURL(p).pathname).map(p => clean({ pathTmpl: p, base: basePathname, fileNameRegEx: /index\.html|index\.mjs|\.mjs|\.html/ })).map(p => pathToRegexp(p))

    let index = 0
    let found = false

    for (let r of copy) {
      if (r.test(route)) {
        found = raw[index]
        break
      }
      index += 1
    }

    if (found) {
      const isJS = found.endsWith('.mjs')
      const isHTML = found.endsWith('.html')
      const type = isJS ? 'javascript' : isHTML ? 'html' : 'unknown'
      cache[basePath][folder][route] = { path: found.replace(basePath, 'app'), loader: 'local', type, ref: found }
    }

  }

  return cache[basePath][folder][route] || false
}
