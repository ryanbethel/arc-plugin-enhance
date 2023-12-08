export async function get (/* req */) {
  console.log('about api from public')
  return {
    json: { people: [ 'fred', 'joe', 'mary' ] }
  }
}
