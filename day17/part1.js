const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.trim().split('\n')

  const coords = lines.map(line => {
    const [x, ys] = line.split(', ')
    const [y0, y1] = ys.split('=')[1].split('..').map(x => +x)

    if (x.split('=')[0] === 'x') {
      return [...new Array(y1 - y0 + 1)].map((_, i) => ({
        x: +x.split('=')[1],
        y: y0 + i
      }))
    } else {
      return [...new Array(y1 - y0 + 1)].map((_, i) => ({
        y: +x.split('=')[1],
        x: y0 + i
      }))
    }
  }).reduce((flat, a) => [...flat, ...a], [])

  const minX = Math.min(...coords.map(c => c.x)) - 1
  const maxX = Math.max(...coords.map(c => c.x)) + 1
  const maxY = Math.max(...coords.map(c => c.y))
  const minY = Math.min(...coords.map(c => c.y))
  // const minX = 494
  // const maxX = 507
  // const maxY = 13

  console.log(maxY, minX, maxX)

  const squares = [...new Array(maxY + 1)].map(() => [...new Array(maxX - minX + 1)].map(_ => '.'))
//   const squares = `......+.......
// ............#.
// .#..#.......#.
// .#..#..#......
// .#..#..#......
// .#.....#......
// .#.....#......
// .#######......
// ..............
// ..............
// ....#.....#...
// ....#.....#...
// ....#.....#...
// ....#######...`.split('\n').map(line => line.split(''))

  const setSquare = (x, y, c) => squares[y][x - minX] = c
  const getSquare = (x, y) => squares[y][x - minX]
  setSquare(500, 0, '+')

  coords.forEach(({x, y}) => setSquare(x, y, '#'))

  // setSquare(500, 4, '#')

  const findBottom = (x, y) => {
    while (y < maxY && getSquare(x, y + 1) === '.') y++
    return y
  }

  const findLeftEnd = (x, y) => {
    while (x > minX && getSquare(x - 1, y) !== '#' && getSquare(x - 1, y + 1) !== '.' && getSquare(x - 1, y + 1) !== '|') x--
    return x
  }

  const findRightEnd = (x, y) => {
    while (x < maxX && getSquare(x + 1, y) !== '#' && getSquare(x + 1, y + 1) !== '.' && getSquare(x + 1, y + 1) !== '|') x++
    return x
  }

  const drip = (x, y) => {
    // goto bottom
    // goto left most
    // goto right most
    // place drop
    if (getSquare(x, y) !== '.') { console.log('done'); return }

    let yb = findBottom(x, y)
    if (yb === maxY || getSquare(x, yb + 1) === '|') {
      while (yb >= y) {
        setSquare(x, yb, '|')
        yb--
      }
      return
    }
    let xl = findLeftEnd(x, yb)
    let xr = findRightEnd(x, yb)
    const containedRest = xl > minX && getSquare(xl - 1, yb) === '#' && xr < maxX && getSquare(xr + 1, yb) === '#'
    const contained = (xl === minX || getSquare(xl - 1, yb) !== '.') && (xr === maxX || getSquare(xr + 1, yb) !== '.')
    if (containedRest) {
      for (let xx = xl; xx <= xr; xx++) setSquare(xx, yb, '~')
    } else if (contained) {
      for (let xx = xl; xx <= xr; xx++) setSquare(xx, yb, '|')
    } else {
      if (xl > minX && getSquare(xl - 1, yb) === '.') {
        drip(xl - 1, yb)
      } else if (xr < maxX && getSquare(xr + 1, yb) === '.') {
        drip(xr + 1, yb)
      } else if (xl !== x && getSquare(xl - 1, yb) !== '.') {
        for (let xx = xl; xx < x; xx++) setSquare(xx, yb, '|')
      } else if (getSquare(xr + 1, yb) !== '.') {
        for (let xx = x + 1; xx <= xr; xx++) setSquare(xx, yb, '|')
      }
    }
    if (xl === x && xr === x) {
      setSquare(x, yb, getSquare(x - 1, yb) !== '|' && getSquare(x + 1, yb) !== '|' ? '~' : '|')
    }
  }

  console.log('starting')
  let prevWater = 0
  let count = 0
  const y1 = +(process.argv[3] || 0)
  const y2 = +(process.argv[4] || 10000)
  while (count++ < +(process.argv[2] || 1)) {
    // console.log(squares.slice(y1, y2).map(row => row.join('')).join('\n'))
    drip(500, 1)

    const waterMass = squares.slice(minY)
      .reduce((sum, row) => row.filter(c => ['|', '~'].indexOf(c) !== -1).length + sum, 0)
    console.log('water', waterMass, prevWater)
    if (waterMass === prevWater) {
      console.log(squares.slice(y1, y2).map(row => row.join('')).join('\n'))
      console.log('we are done at water mass', waterMass)
      const waterMassRest = squares.slice(minY)
        .reduce((sum, row) => row.filter(c => ['~'].indexOf(c) !== -1).length + sum, 0)
      console.log('at rest', waterMassRest)
      return
    }
    prevWater = waterMass
  }
})
