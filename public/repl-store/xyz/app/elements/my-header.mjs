
export default function MyHeader ({ html, state = {} }) {
  return  html`
    <h1><slot></slot></h1>
    `
}
