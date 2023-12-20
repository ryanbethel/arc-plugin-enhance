import { pathToFileURL } from 'url'
export default async function ({ loader, type, ref }){
  if (type !== 'javascript') return false
  if (loader === 'local') {
    return import(pathToFileURL(ref))
  }
  else {
    return import(ref)
  }
}
