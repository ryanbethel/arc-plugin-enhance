import path from 'path'
import test from 'tape'
import url from 'url'
import getModule from '../src/http/any-catchall/_get-module.mjs'
import sandbox from '@architect/sandbox'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const baseUrl = 'http://localhost:3333'

test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd: path.join(__dirname, '..') })
  t.pass('local server started')
  t.end()
})

test('getModules network index', async t => {
  t.plan(1)
  let base = 'http://localhost:3333/_public/app/'
  let folder = 'pages'
  let expected = 'http://localhost:3333/_public/app/pages/index.mjs'
  let result = await getModule({ basePath: base, folder, route: '/' })
  t.equal(expected, result.ref, 'Got back index')
})

test('getModules network named', async t => {
  t.plan(1)
  let base = 'http://localhost:3333/_public/app/'
  let folder = 'api'
  let expected = 'http://localhost:3333/_public/app/api/about.mjs'
  let result = await getModule({ basePath: base, folder, route: '/about' })
  t.equal(expected, result.ref, 'Got back about')
})


test('Shut down local server', async t => {
  await sandbox.end()
  t.pass('Shut down Sandbox')
  t.end()
})
