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

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let chars = content.split('').trim()

  while (true) {
    const prevLength = chars.length
    chars = reduce(chars)
    if (chars.length === prevLength) break
  }

  console.log(chars.length)
})
