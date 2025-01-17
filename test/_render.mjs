import test from 'tape'
import url from 'url'
import path from 'path'
import render from '../src/http/any-catchall/_render.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('render', async t => {
  let base = path.join(__dirname, '..', 'app')
  let result = await render(base, '/', {})
  t.ok(result, 'got result')
  console.log(result)
})
