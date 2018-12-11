const input = 3613

const width = 300
const height = 300

const hundredDigit = s => +(s.substring(s.length - 3, s.length - 2))

const power = (x, y) => hundredDigit(`${((x + 10) * y + input) * (x + 10)}`) - 5

const cells = []
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    let cellPower = 0
    for (let k = i; k < i + 3; k++) {
      for (let l = j; l < j + 3; l++) {
        cellPower += power(l + 1, k + 1)
      }
    }
    cells.push({
      x: j + 1,
      y: i + 1,
      power: cellPower
    })
  }
}

cells.sort((a, b) => a.power - b.power)

console.log(cells[cells.length - 1])
