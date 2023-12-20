import { readFileSync } from 'fs'

export default async function ({ loader, type, ref }){
  if (type !== 'html') return false
  if (loader === 'local') {
    return readFileSync(ref, 'utf8').toString()
  }
  else if (loader === 'network'){
    const result = await fetch(ref)
    return  result.text()
  }
  else if (loader === 'string') {
    return ref
  }
}
