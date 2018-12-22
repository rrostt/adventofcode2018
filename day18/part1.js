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

  for (let i = 0; i < 10; i++) {
    canvas = next(canvas)
    console.log(canvas.map(row => row.join('')).join('\n'))
    console.log('\n')
  }
  console.log(canvas.map(row => row.join('')).join('\n'))

  const squares = canvas.reduce((flat, arr) => [...flat, ...arr])
  console.log('value', squares.filter(c => c === '|').length * squares.filter(c => c === '#').length)
})
