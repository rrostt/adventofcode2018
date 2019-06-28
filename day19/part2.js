const fs = require('fs')

const ops = {
  addr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] + rs[ps[1]], rs),
  addi: (rs, ps) => (rs[ps[2]] = rs[ps[0]] + ps[1], rs),

  mulr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] * rs[ps[1]], rs),
  muli: (rs, ps) => (rs[ps[2]] = rs[ps[0]] * ps[1], rs),

  banr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] & rs[ps[1]], rs),
  bani: (rs, ps) => (rs[ps[2]] = rs[ps[0]] & ps[1], rs),

  borr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] | rs[ps[1]], rs),
  bori: (rs, ps) => (rs[ps[2]] = rs[ps[0]] | ps[1], rs),

  setr: (rs, ps) => (rs[ps[2]] = rs[ps[0]], rs),
  seti: (rs, ps) => (rs[ps[2]] = ps[0], rs),

  gtir: (rs, ps) => (rs[ps[2]] = ps[0] > rs[ps[1]] ? 1 : 0, rs),
  gtri: (rs, ps) => (rs[ps[2]] = rs[ps[0]] > ps[1] ? 1 : 0, rs),
  gtrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] > rs[ps[1]] ? 1 : 0, rs),

  eqir: (rs, ps) => (rs[ps[2]] = ps[0] === rs[ps[1]] ? 1 : 0, rs),
  eqri: (rs, ps) => (rs[ps[2]] = ps[1] === rs[ps[0]] ? 1 : 0, rs),
  eqrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] === rs[ps[1]] ? 1 : 0, rs),
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const program = content.trim().split('\n')

  const ipr = +program[0].split(' ')[1]
  program.splice(0, 1)
  let regs = [1, 0, 0, 0, 0, 0]
  let count = 0
  while (regs[ipr] >= 0 && regs[ipr] < program.length) {
    const [op, ...ps] = program[regs[ipr]].split(' ')
    regs = ops[op](regs, ps.map(x => +x))
    regs[ipr]++

    if (count++ > 40) break
  }

  const target = regs[3]
  console.log([...new Array(target)].map((_, i) => i + 1).filter(x => target % x === 0).reduce((sum, x) => sum + x, 0))
})
