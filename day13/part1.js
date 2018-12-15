const fs = require('fs')

const getOrig = c =>
  c === '>' || c === '<' ? '-'
  : '|'

const findCarts = canvas =>
  canvas.map((row, y) => row.map((c, x) => '<>^v'.indexOf(c) !== -1 ? { x, y, c, intersectionCount: 0, orig: getOrig(c) } : null))
    .reduce((arr, sub) => [...arr, ...sub])
    .filter(x => !!x)

const nextPos = ({ x, y, c }) =>
  c === '<' ? { x: x - 1, y }
  : c === '>' ? { x: x + 1, y }
  : c === '^' ? { x, y: y - 1 }
  : { x, y: y + 1 }

const dirs = '^<v>'.split('')

const move = (canvas, carts) => {
  let firstCrash
  carts.forEach(cart => {
    const { x, y } = nextPos(cart)
    let c = cart.c
    switch (canvas[y][x]) {
      case '<':
      case '>':
      case '^':
      case 'v':
        firstCrash = firstCrash || { x, y }
        break
      case '+':
        c = dirs[(dirs.indexOf(c) + dirs.length + 1 - cart.intersectionCount) % dirs.length]
        cart.intersectionCount = (cart.intersectionCount + 1) % 3
        break
      case '/':
        c = c === '^' ? '>'
          : c === 'v' ? '<'
          : c === '>' ? '^'
          : 'v'
        break
      case '\\':
        c = c === 'v' ? '>'
          : c === '^' ? '<'
          : c === '<' ? '^'
          : 'v'
        break
    }
    canvas[cart.y][cart.x] = cart.orig
    cart.orig = canvas[y][x]
    canvas[y][x] = c
    cart.x = x
    cart.y = y
    cart.c = c
  })
  return firstCrash
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.split('\n')

  const canvas = lines.map(line => line.split(''))
  const carts = findCarts(canvas)

  let i = 1000
  while (i--) {
    // console.log(canvas.map(row => row.join('')).join('\n'))
    // console.log(carts)
    console.log('\n/////////////////////////////////////////////////\n')
    const crash = move(canvas, carts)

    carts.sort((a, b) => (a.y - b.y) === 0 ? a.x - b.x : a.y - b.y)

    if (crash) {
      console.log(crash)
      return
    }
  }
})
