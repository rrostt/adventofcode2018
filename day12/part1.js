const fs = require('fs')
const inputState = '##.#...#.#.#....###.#.#....##.#...##.##.###..#.##.###..####.#..##..#.##..#.......####.#.#..#....##.#'

const nextState = (state, rules) => {
  const states = ('...' + state + '...').split('')
  return states
    .slice(0, state.length + 2)
    .map((_, i) => rules[states.slice(i, i + 5).join('')])
    .join('')
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n').slice(2)

  const rules = lines
    .map(line => line.split(' => '))
    .reduce((rules, rule) => (rules[rule[0]] = rule[1], rules), {})

  console.log(inputState)
  let state = inputState
  for (let i=0;i<20;i++) {
    state = nextState(state, rules)
    console.log(state)
  }

  const sum = state.split('').reduce((sum, state, i) => {
    const number = i - 20
    return sum + (state === '#' ? number : 0)
  }, 0)

  console.log(sum)
})
