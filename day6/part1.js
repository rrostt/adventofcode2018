const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n')

  const coords = lines.map(line => line.split(', ').map(x => +x))

  const area = []
  const WIDTH = 1000
  const HEIGHT = 1000

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let distances = coords.map(([xp, yp], i) => ({
        i,
        d: Math.abs((x - xp)) + Math.abs(y - yp)
      }))
      distances.sort((a, b) => a.d - b.d)
      if (distances[0].d === distances[1].d) {
        area.push(-1)
      } else {
        area.push(distances[0].i)
      }
    }
  }

  const sizes = coords.map((_, ci) => ({
    area: area.filter(i => i === ci).length,
    i: ci
  }))

  sizes.sort((a, b) => b.area - a.area)

  sizes.forEach(({area, i}) => {
    if (isCandidate(i)) {
      console.log(area, coords[i])
      process.exit(0)
    }
  })

  function isCandidate (ci) {
    return !area.some((coord, i) => coord === ci && (Math.floor(i/WIDTH) === 0 || Math.ceil(i/WIDTH) === HEIGHT || i%WIDTH === 0 || i%WIDTH === (WIDTH - 1)))
  }
})
