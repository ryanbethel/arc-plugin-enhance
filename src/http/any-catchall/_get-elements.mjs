import { join } from 'path'
import { pathToFileURL } from 'url'
import { existsSync as exists } from 'fs'
import joinUrl from './_join-url.mjs'
import loadJS from './_load-js.mjs'

import getFiles from './_get-files.mjs'
import getPageName from './_get-page-name.mjs'
import _404 from './templates/404.mjs'
import _500 from './templates/500.mjs'
import _head from './templates/head.mjs'

/**
 * - files in /elements must be lowcase dasherized to match tag name
 * - nested elements will use directory names (eg: /elements/foo/bar.mjs is foo-bar.mjs)
 * - TODO elements.mjs has key for each page
 * - TODO can run a command to generate it based on app/elements
 */
export default async function getElements ({ basePath, projectMap }) {
  let head
  let els = {}
  if (projectMap){
    let pathToModule = joinUrl(basePath, 'elements.mjs')
    let pathToPages = joinUrl(basePath, 'pages')
    let pathToElements = joinUrl(basePath, 'elements')
    let pathToHead = joinUrl(basePath, 'head.mjs')


    // Load head element
    if (!projectMap.head) {
      head = _head
    }
    else {
      try {
        head = (await loadJS(projectMap.head)).default
      }
      catch (error) {
        throw new Error('Issue when trying to import head file.', { cause: error })
      }
    }

    if (projectMap.elements?.['app/elements/elements.mjs']) {
    // read explicit elements manifest
      let mod
      try {
        mod = await loadJS(projectMap.elements?.['app/elements/elements.mjs'])
        els = mod.default
      }
      catch (error) {
        throw new Error('Issue when trying to import elements manifest.', { cause: error })
      }
    }

    // look for JS pages
    if (projectMap.pages){
      // read all the pages
      let pages = (await getFiles({ basePath, folder: 'pages', projectMap }))
      let jsPages = Object.entries(pages).filter(f => f[0].endsWith('.mjs'))
      for (let [ path, resource ] of jsPages) {
        let tag = await getPageName('app', path)
        let mod
        try {
          mod = await loadJS(resource)
          els['page-' + tag] = mod.default
        }
        catch (error) {
          throw new Error(`Issue when trying to import page: ${path}`, { cause: error })
        }
      }
    }

    if (projectMap.elements){
      let elementsURL = 'app/elements/'
      // read all the elements
      let files = (await getFiles({ basePath, folder: 'elements', projectMap }))
      let jsFiles = Object.entries(files).filter(f => f[0].endsWith('.mjs'))
      for (let [ e, details ] of jsFiles) {
        // turn foo/bar.mjs into foo-bar to make sure we have a legit tag name
        const fileURL = e
        let tag = fileURL.replace(elementsURL, '').slice(0).replace(/.mjs$/, '').replace(/\//g, '-')
        if (/^[a-z][a-z0-9-]*$/.test(tag) === false) {
          throw Error(`Illegal element name "${tag}" must be lowercase alphanumeric dash`)
        }
        // import the element and add to the map
        let mod
        try {
          mod = await loadJS(details)
          els[tag] = mod.default
        }
        catch (error) {
          throw new Error(`Issue importing element: ${e}`, { cause: error })
        }
      }
    }

  }
  else {
    let pathToModule = join(basePath, 'elements.mjs')
    let pathToPages = join(basePath, 'pages')
    let pathToElements = join(basePath, 'elements')
    let pathToHead = join(basePath, 'head.mjs')


    // Load head element
    if (exists(pathToHead) === false) {
      head = _head
    }
    else {
      try {
        head = (await import(pathToFileURL(pathToHead).href)).default
      }
      catch (error) {
        throw new Error('Issue when trying to import head file.', { cause: error })
      }
    }

    if (exists(pathToModule)) {
    // read explicit elements manifest
      let mod
      let href = pathToFileURL(pathToModule).href
      try {
        mod = await import(href)
        els = mod.default
      }
      catch (error) {
        throw new Error('Issue when trying to import elements manifest.', { cause: error })
      }
    }

    // look for pages
    if (exists(pathToPages)) {

      // read all the pages
      let pages = (await getFiles({ basePath, folder: 'pages', projectMap })).filter(f => f.endsWith('.mjs'))
      for (let p of pages) {
        let tag = await getPageName(basePath, p)
        let mod
        try {
          mod = await import(pathToFileURL(p).href)
          els['page-' + tag] = mod.default
        }
        catch (error) {
          throw new Error(`Issue when trying to import page: ${p}`, { cause: error })
        }
      }
    }

    if (exists(pathToElements)) {
      let elementsURL = pathToFileURL(join(basePath, 'elements'))
      // read all the elements
      let files = (await getFiles({ basePath, folder: 'elements', projectMap })).filter(f => f.endsWith('.mjs'))
      for (let e of files) {
      // turn foo/bar.mjs into foo-bar to make sure we have a legit tag name
        const fileURL = pathToFileURL(e)
        let tag = fileURL.pathname.replace(elementsURL.pathname, '').slice(1).replace(/.mjs$/, '').replace(/\//g, '-')
        if (/^[a-z][a-z0-9-]*$/.test(tag) === false) {
          throw Error(`Illegal element name "${tag}" must be lowercase alphanumeric dash`)
        }
        // import the element and add to the map
        let mod
        try {
          mod = await import(fileURL.href)
          els[tag] = mod.default
        }
        catch (error) {
          throw new Error(`Issue importing element: ${e}`, { cause: error })
        }
      }
    }

  }

  if (!els['page-404'])
    els['page-404'] = _404

  if (!els['page-500'])
    els['page-500'] = _500

  console.log('els', els)
  console.log('head', head)
  return { head, elements: els }
}
