import path from 'path'
import test from 'tape'
import getFiles from '../src/http/any-catchall/_get-files.mjs'
import url from 'url'
import sandbox from '@architect/sandbox'

const baseUrl = 'http://localhost:3333'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd: path.join(__dirname, '..') })
  t.pass('local server started')
  t.end()
})

test('getFiles from network', async t => {
  t.plan(1)
  let base = 'http://localhost:3333/_public/app'
  let folder = 'pages'
  let expected = 'http://localhost:3333/_public/app/pages'
  let result = await getFiles(base, folder)
  console.log({ result })
  let results = result.map(f => f.startsWith(expected))
  let truthy = results.filter(Boolean)
  t.ok(truthy.length === results.length, 'got files from network')
})

test('Shut down local server', async t => {
  await sandbox.end()
  t.pass('Shut down Sandbox')
  t.end()
})
