import path from 'path'
import { pathToFileURL } from 'url'

import { pathToRegexp } from 'path-to-regexp'

import getFiles from './_get-files.mjs'
import sort from './_sort-routes.mjs'
import clean from './_clean.mjs'

// cheap memoize for warm lambda
const cache = {}

/** helper to get module for given folder/route */
export default async function getModule (basePath, folder, route) {
  if (!cache[basePath])
    cache[basePath] = {}

  if (!cache[basePath][folder])
    cache[basePath][folder] = {}

  if (!cache[basePath][folder][route]) {

    let raw = (await getFiles(basePath, folder)).sort(sort)
    let copy

    if (basePath.startsWith('http')) {
      let base = joinUrlParts(basePath, folder)
      let basePathname = base
      copy = raw.slice(0)
        .map(p => clean({ pathTmpl: p, base: basePathname, fileNameRegEx: /index\.html|index\.mjs|\.mjs|\.html/ }))
        .map(p => pathToRegexp(p))
    }
    else {
      let base = path.join(basePath, folder)
      let basePathname = pathToFileURL(base).pathname
      copy = raw.slice(0).map(p => pathToFileURL(p).pathname).map(p => clean({ pathTmpl: p, base: basePathname, fileNameRegEx: /index\.html|index\.mjs|\.mjs|\.html/ })).map(p => pathToRegexp(p))
    }

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
      cache[basePath][folder][route] = found
    }

  }

  return cache[basePath][folder][route] || false
}

function joinUrlParts (part1, part2) {
  const trimmedPart1 = part1.replace(/\/+$/, '')
  const trimmedPart2 = part2.replace(/^\/+/, '')
  return trimmedPart1 + '/' + trimmedPart2
}
