const fs = require('fs')

const adjacent = (canvas, x, y) => {
  const square = canvas
    .slice(
      Math.max(0, y - 1),
      Math.min(canvas.length, y + 2)
    )
    .map(row =>
      row.slice(
        Math.max(0, x - 1),
        Math.min(row.length, x + 2)
      )
    )
    .reduce((flat, arr) => [...flat, ...arr])
  square.splice(square.indexOf(canvas[y][x]), 1)
  return square
}

const next = canvas =>
  canvas.map((row, y) =>
    row.map((c, x) => {
      const adj = adjacent(canvas, x, y)
      if (c === '.' && adj.filter(c => c === '|').length >= 3) return '|'
      if (c === '|' && adj.filter(c => c=== '#').length >= 3) return '#'
      if (c === '#' && (adj.filter(c => c=== '#').length == 0 || adj.filter(c => c === '|').length === 0)) return '.'
      return c
    })
  )

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.trim().split('\n')

  let canvas = lines.map(line => line.split(''))
  const startRounds = 199

  for (let i = 0; i < startRounds; i++) {
    canvas = next(canvas)
  }
  const sequence = [canvas.map(row => row.join('')).join('\n')]
  for (let i = 0; i < 1000; i++) {
    canvas = next(canvas)
    const str = canvas.map(row => row.join('')).join('\n')
    if (str === sequence[sequence.length - 1]) break
    sequence.push(str)
  }
  const sequenceIndex = (1e9 - startRounds) % sequence.length
  console.log('after a gazillion minutes the value is ', sequence[sequenceIndex].split('').filter(c => c === '|').length * sequence[sequenceIndex].split('').filter(c => c === '#').length)
})
