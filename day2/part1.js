const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const twosAndThrees = lines.map(line => {
    const chars = line.split('')
    const counts = Object.values(chars.reduce((o, char) => { o[char] = (o[char] || 0) + 1; return o }, {}))
    return ({ twos: counts.indexOf(2) !== -1 ? 1 : 0, threes: counts.indexOf(3) !== -1 ? 1 : 0 })
  })

  const twosum = twosAndThrees.reduce((sum, x) => sum + x.twos, 0)
  const threesum = twosAndThrees.reduce((sum, x) => sum + x.threes, 0)

  console.log(twosum * threesum)
})
