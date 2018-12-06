const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n')

  const coords = lines.map(line => line.split(', ').map(x => +x))

  const WIDTH = 1000
  const HEIGHT = 1000
  const MAX_DISTANCE = 1e4

  let soughtAreaSize = 0

  for (let y = -HEIGHT; y < HEIGHT; y++) {
    for (let x = -WIDTH; x < WIDTH; x++) {
      let distances = coords.map(([xp, yp], i) => ({
        i,
        d: Math.abs((x - xp)) + Math.abs(y - yp)
      }))
      const total = distances.reduce((sum, {d}) => sum + d, 0)
      if (total < MAX_DISTANCE) {
        soughtAreaSize++
      }
    }
  }

  console.log(soughtAreaSize)
})
