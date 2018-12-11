const fs = require('fs')

const getBounding = points =>
  points.reduce((bounds, { pos }) => ({
    x1: Math.min(bounds.x1, pos[0]),
    x2: Math.max(bounds.x2, pos[0]),
    y1: Math.min(bounds.y1, pos[1]),
    y2: Math.max(bounds.y2, pos[1]),
  }), {x1: Number.MAX_VALUE, x2: Number.MIN_VALUE, y1: Number.MAX_VALUE, y2: Number.MIN_VALUE})

const draw = points => {
  const bound = getBounding(points)
  const size = [bound.x2 - bound.x1, bound.y2 - bound.y1]
  const pixels = [...new Array(size[1] + 1)].map(_ => [...new Array(size[0] + 1)].map(_ => '.'))
  console.log(bound, size)
  points.forEach(({ pos: [x, y] }) => {
    pixels[y - bound.y1][x - bound.x1] = '#'
  })

  console.log(pixels.map(row => row.join('')).join('\n'))
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n')

  let vectors = lines.map(line => {
    const matches = /<([^>]*)>[^<]*<([^>]*)>/.exec(line)
    const pos = matches[1].split(', ').map(x => +x)
    const vel = matches[2].split(', ').map(x => +x)
    return {
      pos, vel
    }
  })

  // console.log(vectors)
  let prevSize = [Number.MAX_VALUE, Number.MAX_VALUE]
  for (let i = 0;i<15000;i++) {
    const bound = getBounding(vectors)
    const size = [bound.x2 - bound.x1, bound.y2 - bound.y1]
    console.log('width', size[0], 'height', size[1])

    if (size[0] < prevSize[0]) {
      prevSize = size
    } else {
      console.log('size increasing now', i)
      break
    }

    if (i===10946) {
      draw(vectors)
    }

    vectors = vectors.map(({ pos: [x, y], vel: [vx, vy] }) => ({
      pos: [x + vx, y + vy],
      vel: [vx, vy]
    }))
  }
  console.log('done')
})
