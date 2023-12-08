export default function (part1, part2) {
  const trimmedPart1 = part1.replace(/\/+$/, '')
  const trimmedPart2 = part2.replace(/^\/+/, '')
  return trimmedPart1 + '/' + trimmedPart2
}
