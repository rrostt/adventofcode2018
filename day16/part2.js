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
  gtrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] > rs[ps[1]] ? 1 : 0, rs),

  eqir: (rs, ps) => (rs[ps[2]] = ps[0] === rs[ps[1]] ? 1 : 0, rs),
  eqri: (rs, ps) => (rs[ps[2]] = ps[1] === rs[ps[0]] ? 1 : 0, rs),
  eqrr: (rs, ps) => (rs[ps[2]] = rs[ps[0]] === rs[ps[1]] ? 1 : 0, rs),
}

const parseTest = txt =>
  txt.trim().split('\n')
    .map(line => line.split(' ').map(x => parseInt(x)))

const withoutOption = (options, option) =>
  options.map(opts => opts.filter(opt => opt !== option))

const getInstructionSet = options => {
  if (options.length === 0) return [[]]

  return options[0]
    .map(op =>
      getInstructionSet(withoutOption(options, op).slice(1))
        .map(instr => [op, ...instr])
    )
    .reduce((flat, sub) => [...flat, ...sub], [])
}

fs.readFile('./input1.txt', 'utf8', (err, content1) => {
  fs.readFile('./input2.txt', 'utf8', (err, content2) => {
    const samples = parseSamples(content1)
    const testData = parseTest(content2)

    const allOps = Object.values(ops)
    const opPossibilities = [...new Array(allOps.length)].map(() => [...allOps])
    samples
      .forEach(sample => {
        const opi = sample.instruction[0]
        opPossibilities[opi] = opPossibilities[opi].filter(op => {
          const result = op([...sample.before], sample.instruction.slice(1))
          return JSON.stringify(result) === JSON.stringify(sample.after)
        })
      })
    const optsArray = opPossibilities.map(ops => ops.map(op => allOps.indexOf(op)))
    const instructionSet = getInstructionSet(optsArray)[0]
    console.log(instructionSet)

    const regs = testData.reduce((rs, instruction) => {
      result = allOps[instructionSet[instruction[0]]](rs, instruction.slice(1))
      return result
    }, [0, 0, 0, 0])
    console.log(regs)
  })
})
