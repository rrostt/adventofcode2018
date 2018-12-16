const fs = require('fs')

const parseSamples = txt =>
  txt.split('\n')
    .reduce((samples, line) => {
      const sample = samples[samples.length - 1]
      if (sample.length === 0) {
        sample.push(line.substring(9).split(', ').map(x => parseInt(x)))
      } else if (sample.length === 1) {
        sample.push(line.split(' ').map(x => parseInt(x)))
      } else if (sample.length === 2) {
        sample.push(line.substring(9).split(', ').map(x => parseInt(x)))
      } else {
        samples.push([])
      }
      return samples
    }, [[]])
    .filter(s => s.length === 3)
    .map(([before, instruction, after]) => ({
      before,
      instruction,
      after
    }))

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
  gtrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] > rs[ps[1]], rs),

  eqir: (rs, ps) => (rs[ps[2]] = ps[0] === rs[ps[1]] ? 1 : 0, rs),
  eqri: (rs, ps) => (rs[ps[2]] = ps[1] === rs[ps[0]] ? 1 : 0, rs),
  eqrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] === rs[ps[1]] ? 1 : 0, rs),
}

fs.readFile('./input1.txt', 'utf8', (err, content1) => {
  fs.readFile('./input2.txt', 'utf8', (err, content2) => {
    const samples = parseSamples(content1)

    const allOps = Object.values(ops)
    console.log(
      samples
        .map(sample =>
          allOps.filter((op, opi) => {
            const result = op([...sample.before], sample.instruction.slice(1))
            return JSON.stringify(result) === JSON.stringify(sample.after)
          })
        )
        .filter(opsResults => opsResults.length >= 3)
        .length
    )
  })
})
