const fs = require('fs')

const distance = (a, b) => a.reduce((sum, char, index) => {
  sum += char !== b[index] ? 1 : 0
  return sum
}, 0)

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const lineChars = lines.map(line => line.split(''))

  lineChars.forEach(chars1 => {
    lineChars.forEach(chars2 => {
      if (distance(chars1, chars2) === 1) {
        console.log(chars1.filter((char, i) => char === chars2[i]).join(''))
      }
    })
  })
})
