import { globSync } from 'glob'
import { join } from 'path'
// import  joinUrlParts  from './_join-url.mjs'

let cache = {}


/** helper to return files from basePath */
export default async function getFiles ({ basePath, folder, projectMap }) {
  if (projectMap) return projectMap[folder]

  if (!cache[basePath]) cache[basePath] = {}
  // if (!cache[basePath][folder]) {
  //   if (basePath.startsWith('http')) {
  //     const path = joinUrlParts(basePath, folder)
  //     const { manifest } = await import(joinUrlParts(basePath, 'project-manifest.mjs'))
  //     cache[basePath][folder] = manifest.filter(f => f.startsWith(path))
  //   }
  //   else {
  let root = join(basePath, folder)
  let raw = globSync('/**', { dot: true, root, nodir: true })
  let files = raw.filter(f => f.includes('.'))
  // Glob fixed path normalization, but in order to match in Windows we need to re-normalize back to backslashes (lol)
  let isWin = process.platform.startsWith('win')
  if (isWin) files = files.map(p => p.replace(/\//g, '\\'))
  cache[basePath][folder] = files
  //   }
  // }
  return cache[basePath][folder]
}
