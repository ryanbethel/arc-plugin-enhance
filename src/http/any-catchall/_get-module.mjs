import path from 'path'

import { pathToRegexp } from 'path-to-regexp'

import getFiles from './_get-files.mjs'
import sort from './_sort-routes.mjs'

// cheap memoize for warm lambda
const cache = {} 

/** helper to get module for given folder/route */
export default function getModule (basePath, folder, route) {
  // console.time('getModule')

  if (!cache[folder])
    cache[folder] = {}

  if (!cache[folder][route]) {
  
    let raw = getFiles(basePath, folder).sort(sort)

    let base = path.join(basePath, folder)
    let clean = f => f.replace(base, '').replace(/index\.html|index\.mjs|\.mjs|\.html/, '').replace('$', ':').replace(/\/+$/, '')
    let copy = raw.slice(0).map(clean).map(p => pathToRegexp(p))

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
      cache[folder][route] = found
    }
  }

  // console.timeEnd('getModule')
  return cache[folder][route] || false
}
