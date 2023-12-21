export const projectMap = {
  api: {
    // 'app/api/about.mjs': {
    //   loader: 'local',
    //   type: 'javascript',
    //   filepath: '/User/path/app/api/about.mjs',
    // },
    'app/api/index.mjs': {
      loader: 'network',
      type: 'javascript',
      ref: 'http://localhost:3333/_public/repl-store/xyz/app/api/index.mjs',
      // path: 'app/api/index.mjs'
    },
    'app/api/contact.mjs': {
      loader: 'string',
      type: 'javascript',
      ref: `export async function get() { return { json:{ message:'contact api'} } } `
    },
  },
  head: {
    loader: 'network',
    type: 'javascript',
    ref: 'http://localhost:3333/_public/repl-store/xyz/app/head.mjs',
  },
  pages: {
    // 'app/pages/about.html': { type: 'local', path: '/User/path/app/pages/about.html' },
    'app/pages/about.mjs': {
      loader: 'network',
      type: 'javascript',
      ref: 'http://localhost:3333/_public/repl-store/xyz/app/pages/about.mjs' },
    // 'app/pages/contact.html': {
    //   load: 'string',
    //   type: 'html',
    //   ref: '<div>Contacts</div>' },
    // // 'app/pages/about.mjs': { type: 'local', path: '/User/path/app/pages/about.mjs' },
    // 'app/pages/one.mjs': {
    //   loader: 'network',
    //   type: 'javascript',
    //   ref: 'http://localhost:3333/_public/repl-store/123/app/api/one.mjs' },
    'app/pages/two.mjs': {
      loader: 'string',
      type: 'javascript',
      ref: 'export default function two({html}) { return html`<div>two</div>` } ' },
  },
  //   elements: {
  //     'app/elements/my-header.mjs': {
  //       loader: 'data-uri',
  //       type: 'javascript',
  //       ref: `data:text/javascript, export default function MyHeader({html,state = {}}) {
  // const {message="hello"} = state.store
  // return  html\`  <h1><slot></slot></h1> <p>\${message}</p> \`
  // }`
  //     },
  //   },
  elements: {
    'app/elements/my-header.mjs': {
      loader: 'data-uri',
      type: 'javascript',
      ref: `data:text/javascript;base64, ${Buffer.from(`
export default function MyHeader({html,state = {}}) {
  const {message="hello"} = state.store 
  return  html\`
<h1><slot></slot></h1>
<p>\${message}</p> 
\`
}`).toString('base64')}`
    },
  },
  // elements: {
  //   'app/elements/my-header.mjs': {
  //     loader: 'data-uri',
  //     type: 'javascript',
  //     ref: 'data:text/javascript, export default function MyHeader({html,state = {}}) { \n const {message="hello"} = state.store \n return  html`  \n <h1><slot></slot></h1> \n <p>${message}</p> \n ` }'
  //   },
  // },
}
