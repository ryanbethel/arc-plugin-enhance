import { pathToFileURL } from 'url'
export default async function ({ loader, type, ref }){
  if (type !== 'javascript') return false
  if (loader === 'local') {
    return import(pathToFileURL(ref))
  }
  else if (loader === 'string'){
    const dataURL = `data:text/javascript;base64, ${Buffer.from(ref).toString('base64')}`
    return import(dataURL)
  }
  else {
    return import(ref)
  }
}
