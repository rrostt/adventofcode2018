const input = 286051

const first = { v: 3, n: null }
const second = { v: 7, n: first }
first.n = second

const recipes = {
  start: first,
  end: second
}
let recipeString = '37'
let recipeStringStart = 0

const elves = [first, second]

const nextRecipes = () => {
  const next = elves[0].v + elves[1].v
  return `${next}`.split('').map(x => +x)
}

const inputString = '' + input

let i = 0
while (true) {
  const next = nextRecipes()
  next.forEach(v => {
    recipes.end.n = {
      v,
      n: recipes.start
    }
    recipeString += '' + v
    recipes.end = recipes.end.n
  })
  let x
  for (x = elves[0].v + 1;x > 0; x--) { elves[0] = elves[0].n }
  for (x = elves[1].v + 1;x > 0; x--) { elves[1] = elves[1].n }

  const inputIndex = recipeString.indexOf(inputString)
  if (inputIndex !== -1) {
    console.log(inputIndex + recipeStringStart)
    break
  }

  if (recipeString.length > 8) {
    recipeStringStart += recipeString.length - 8
    recipeString = recipeString.substring(recipeString.length - 8)
  }
}
