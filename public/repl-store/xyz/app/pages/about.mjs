export default function Index ({ html, state = {} }) {
  const { messsage } = state.store
  return  html`
      <my-header>${messsage || 'Hello World'}</my-header>
    `
}
