const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const tiles = lines.filter(x => x.length > 3).map(line => {
    const [, , pos, size] = line.split(' ')
    const coords = {
      x1: +pos.split(',')[0],
      y1: parseInt(pos.split(',')[1])
    }
    coords.x2 = coords.x1 + +size.split('x')[0]
    coords.y2 = coords.y1 + +size.split('x')[1]
    return coords
  })

  const fabric = [...new Array(1000)].map(x => [...new Array(1000)].map(x => 0))

  tiles.forEach(coords => {
    for (let i = coords.x1; i < coords.x2; i++) {
      for (let j = coords.y1; j < coords.y2; j++) {
        fabric[i][j] ++
      }
    }
  })

  const overCoveredArea = fabric.reduce(
    (sum, row) => sum + row.reduce((sum, x) => sum + (x > 1 ? 1 : 0), 0), 0)

  console.log(overCoveredArea)
})
