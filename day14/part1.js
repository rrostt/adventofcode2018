const input = 286051

let recipes = [3, 7]

let elves = [0, 1]

const nextRecipes = () => {
  const next = recipes[elves[0]] + recipes[elves[1]]
  return `${next}`.split('').map(x => +x)
}

while (recipes.length < input + 10) {
  recipes.push(...nextRecipes())
  elves[0] = (elves[0] + recipes[elves[0]] + 1) % recipes.length
  elves[1] = (elves[1] + recipes[elves[1]] + 1) % recipes.length
}

console.log(recipes.slice(input, input + 10).join(''))
