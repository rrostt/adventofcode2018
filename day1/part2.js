const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const numbers = lines.map(x => +x)
//  const sum = numbers.reduce((sum, x) => sum + x)

//  console.log(sum)
  const freqs = []
  let freq = 0
  let i = 0
  do {
    freq += numbers[(i++) % (numbers.length - 1)]
    freqs.push(freq)
  } while (freqs.indexOf(freq) === freqs.length - 1)

  console.log(freq)
})
