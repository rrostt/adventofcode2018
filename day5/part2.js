const fs = require('fs')

const reduce = chars => {
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] !== chars[i - 1] && chars[i].toLowerCase() === chars[i - 1].toLowerCase()) {
      chars.splice(i - 1, 2)
      return chars
    }
  }
  return chars
}

const getReducedLength = original => {
  let chars = original.slice()
  while (true) {
    const prevLength = chars.length
    chars = reduce(chars)
    if (chars.length === prevLength) break
  }
  console.log(chars.length)
  return chars.length
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lengths = [...new Set(content.trim().toLowerCase().split(''))].map(char => getReducedLength(content.trim().replace(new RegExp(char, 'g'), '').replace(new RegExp(char.toUpperCase(), 'g'), '').split('')))

  lengths.sort((a, b) => a - b)

  console.log(lengths[0])
})
