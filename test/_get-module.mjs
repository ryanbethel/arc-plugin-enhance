import path from 'path'
import test from 'tape'
import url from 'url'
import getModule from '../src/http/any-catchall/_get-module.mjs'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('getModules', async t => {
  t.plan(1)
  let base = path.join(__dirname, '..', 'app')
  let folder = 'pages'
  let expected = path.join(base, folder, 'index.html')
  let result = await getModule({ basePath: base, folder, route: '/' })
  t.equal(expected, result.ref, 'Got back index')
})

test('getModules multiple params', async t => {
  t.plan(1)
  let base = path.join(__dirname, 'mock-folders', 'app')
  let folder = 'api/foo/$first/bar/$second/baz'
  let file = '$third.mjs'
  let expected = path.join(base, folder, file)
  let result = await getModule({ basePath: base,  folder: 'api', route: '/foo/7/bar/8/baz/9' })
  t.equal(expected, result.ref, 'Got the api with multiple params')
})

test('getModules catchall', async t => {
  t.plan(1)
  let base = path.join(process.cwd(), 'test', 'mock-folders', 'app')
  let folder = 'api/place/$id'
  let file = '$$.mjs'
  let expected = path.join(base, folder, file)
  let result = await getModule({ basePath: base, folder, route: '/place/anything/anywhere' })
  t.equal(expected, result.ref, 'Got the catchall')
})

test('getModules no api', async t => {
  t.plan(1)
  let base = path.join(process.cwd(), 'test', 'mock-apps', 'app')
  let folder = 'api'
  let expected = false
  let result = await getModule({ basePath: base, folder, route: '/' })
  t.equal(expected, result.ref, 'No api')
})
