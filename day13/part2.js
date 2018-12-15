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
    if (cart.crashed) return

    const { x, y } = nextPos(cart)
    let c = cart.c
    switch (canvas[y][x]) {
      case '<':
      case '>':
      case '^':
      case 'v':
        firstCrash = firstCrash || { x, y }
        cart.crashed = true
        carts.filter(({ x: nx, y: ny }) => nx === x && ny === y)
          .forEach(cart => {
            cart.crashed = true
            canvas[cart.y][cart.x] = cart.orig
          })
        canvas[cart.y][cart.x] = cart.orig
        return
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

  let i = 100000
  while (i--) {
    console.log(canvas.map(row => row.join('')).join('\n'))
    // console.log(carts)
    console.log('\n/////////////////////////////////////////////////\n')
    const crash = move(canvas, carts)

    carts.sort((a, b) => (a.y - b.y) === 0 ? a.x - b.x : a.y - b.y)

    console.log(carts.filter(({ crashed }) => !crashed).length)
    if (carts.filter(({ crashed }) => !crashed).length === 1) {
      console.log('non crashed', carts.filter(({ crashed }) => !crashed)[0])
      return
    }
  }
})
