const input = 3613

const width = 300
const height = 300

const hundredDigit = s => +(s.substring(s.length - 3, s.length - 2))

const power = (x, y) => hundredDigit(`${((x + 10) * y + input) * (x + 10)}`) - 5
const powers = [...new Array(height)].map((_, i) => [...new Array(width)].map((_, j) => power(j + 1, i + 1)))

const maxPowerCell = size => {
  const squares = [...new Array(height)].map(x => [])
  for (let i = height - 1; i >= 0; i--) {
    for (let j = 0; j < width - size; j++) {
      const cellPower = (i + 1 < height ? squares[i + 1][j].power : 0) -
        ((i + size) < height ? powers[i + size].slice(j, j + size).reduce((sum, x) => sum + x) : 0) +
        powers[i].slice(j, j + size).reduce((sum, x) => sum + x)

      squares[i][j] = {
        x: j + 1,
        y: i + 1,
        power: cellPower
      }
    }
  }

  const cells = squares.reduce((cells, row) => [...cells, ...row], [])

  cells.sort((a, b) => a.power - b.power)

  console.log(cells[cells.length - 1])
  return cells[cells.length - 1]
}

const candidates = []
for (let i = 1; i < 300; i++) {
  const cell = maxPowerCell(i)
  candidates.push({ ...cell, size: i })
}

candidates.sort((a, b) => b.power - a.power)

console.log(candidates[0])
