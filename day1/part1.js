const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const numbers = lines.map(x => +x)
  const sum = numbers.reduce((sum, x) => sum + x)

  console.log(sum)
})
