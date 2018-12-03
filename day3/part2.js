const fs = require('fs')

const overlap = (t1, t2) => {
  return t1.x1 < t2.x2 && t1.x2 > t2.x1 && t1.y1 < t2.y2 && t1.y2 > t2.y1
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')
  const tiles = lines.filter(x => x.length > 3).map(line => {
    const [id, , pos, size] = line.split(' ')
    const coords = {
      x1: +pos.split(',')[0],
      y1: parseInt(pos.split(',')[1])
    }
    coords.x2 = coords.x1 + +size.split('x')[0]
    coords.y2 = coords.y1 + +size.split('x')[1]
    coords.id = id
    return coords
  })

  tiles.forEach(tile => {
    const overlaps = tiles.filter(tile2 => overlap(tile, tile2))
    if (overlaps.length === 1) console.log(tile)
  })
})
