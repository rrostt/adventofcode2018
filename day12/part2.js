const fs = require('fs')
const inputState = '##.#...#.#.#....###.#.#....##.#...##.##.###..#.##.###..####.#..##..#.##..#.......####.#.#..#....##.#'

const sumPotState = (state, firstPotNumber) =>
  state.split('').reduce((sum, state, i) => {
    const number = i + firstPotNumber
    return sum + (state === '#' ? number : 0)
  }, 0)

const nextState = (firstPotNumber, state, rules) => {
  const firstPlant = state.indexOf('#')
  const states = ('...' + state.substring(firstPlant) + '...').split('')
  return {
    state: states
      .slice(0, states.length - 4)
      .map((_, i) => rules[states.slice(i, i + 5).join('')])
      .join(''),
    firstPotNumber: firstPotNumber + firstPlant - 1
  }
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n').slice(2)

  const rules = lines
    .map(line => line.split(' => '))
    .reduce((rules, rule) => (rules[rule[0]] = rule[1], rules), {})

  let state = inputState
  let firstPotNumber = 0
  for (let i = 0; i < 5e10; i++) {
    let { state: next, firstPotNumber: nextFirst } = nextState(firstPotNumber, state, rules)

    if (state === next) {
      console.log('answer', sumPotState(state, firstPotNumber + (nextFirst - firstPotNumber) * (5e10 - i)))
      break
    }

    state = next
    firstPotNumber = nextFirst

    const sum = sumPotState(state, firstPotNumber)
    console.log(i, sum, nextFirst, next)
  }

  const sum = sumPotState(state, firstPotNumber)

  console.log(sum)
})
