const fs = require('fs')

const node = ([x, y]) => `${x}x${y}`

const findClosing = ([d, ...ds], openings = 0) => {
  if (d === ')' && openings === 0) return 0
  if (d === '(') return 1 + findClosing(ds, openings + 1)
  if (d === ')' && openings > 0) return 1 + findClosing(ds, openings - 1)
  return 1 + findClosing(ds, openings)
}

// const getPaths = ([d, ...ds]) => {
//   if (d === '(') {
//     const closingIndex = findClosing(ds)
//     const branchPaths = getPaths(ds.slice(0, closingIndex))
//     const postBranchPaths = getPaths(ds.slice(closingIndex + 1))
//   }
//   const prev = getPaths(ds)
// }

// const findClosingBracket = ([d, ...ds], depth = 0) => {
//   if (d === ')' && depth === 0) return 0
//   if (d === ')') return 1 + findClosingBracket(ds, depth - 1)
//   if (d === '(') return 1 + findClosingBracket(ds, depth + 1)
//   return 1 + findClosingBracket(ds, depth)
// }
const findClosingBracket = (str, start, end) => {
  let i = start
  let depth = 0
  while (i < end) {
    const d = str[i]
    if (d === ')' && depth === 0) return i
    if (d === ')') depth--
    if (d === '(') depth++
    i++
  }
  return i
}

const getOptions = (ds, start, end) => {
  // return options.join('').split('|').map(x => x.split(''))
  // console.log('getOptions', [d, ds])

  let options = [{
    start: start,
    end: start
  }]

  let i = start
  while (i < end) {
    const d = ds[i]

    if (d === '(') {
      const closing = findClosingBracket(ds, i + 1, ds.length)
      options[options.length - 1].end = closing + 1
      i = closing + 1
    } else if (d === '|') {
      options[options.length - 1].end = i
      options.push({ start: i + 1, end: i + 1})
      i++
    } else {
      options[options.length - 1].end = i + 1
      i++
    }
  }
  return options
}

// Dir can be either string or array of Dirs
// a navigation string can be turned into an array

const getPaths = (dirs, start, end) => {
  if (start === undefined) {
    start = 0
    end = dirs.length
  }
/*  const d = dirs[start]
  console.log('getPaths', d, start)
  if (d === undefined || start === end) { return [''] }
  if (end === start + 1) { return [d] }
  if (d === '(') {
    const closing = findClosingBracket(dirs, start + 1, dirs.length)
    const restPaths = getPaths(dirs, closing + 1, end)
    return getOptions(dirs, start + 1, closing)
      .map(option => getPaths(dirs, option.start, option.end))
      .reduce((flat, a) => flat.concat(a), []) // [...flat, ...a], [])
      .map(option => restPaths.map(path => option + path))
      .reduce((flat, a) => flat.concat(a), []) // [...flat, ...a], [])
  }
  return getPaths(dirs, start + 1, end).map(path => d + path)*/

  const firstOpening = dirs.indexOf('(', start)

  if (firstOpening > -1 && firstOpening < end) {
    const firstClosing = findClosingBracket(dirs, firstOpening + 1, end)

    const path = dirs.slice(start, firstOpening).join('')
    const prePaths = getOptions(dirs, firstOpening + 1, firstClosing)
      .map(({ start, end }) => getPaths(dirs, start, end).map(optionPath => path + optionPath))
      .reduce((flat, paths) => flat.concat(paths), [])
    console.log(path)
    // console.log('pre', prePaths.length)
    const afterPaths = getPaths(dirs, firstClosing + 1, end)
    return prePaths
      .map(path => afterPaths.map(afterPath => path + afterPath))
      .reduce((flat, paths) => flat.concat(paths), [])
  } else {
    console.log(start, end)
    return [dirs.slice(start, end).join('')]
  }
}

const assert = (result, expected) => {
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    console.error('mismatch', result, 'not', expected)
    throw new Error('assert failed')
  } else {
    console.log('assert passed')
  }
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const directions = content.split('').slice(1, content.length - 1)

  assert(getPaths('NSW'.split('')), ['NSW'])
  assert(getPaths('N(S|N)W'.split('')), ['NSW', 'NNW'])
  assert(getPaths('N(SW|N)W'.split('')), ['NSWW', 'NNW'])
  assert(getPaths('N(SW|N|)W'.split('')), ['NSWW', 'NNW', 'NW'])
  assert(getPaths('N(S|(N|E))W'.split('')), ['NSW', 'NNW', 'NEW'])
  assert(getPaths('NN(SSS|)E'.split('')), ['NNSSSE', 'NNE'])
  assert(getPaths('NN(E|W)E(N|S)WW'.split('')), ['NNEENWW', 'NNEESWW', 'NNWENWW', 'NNWESWW'])

  // console.log(getPaths('ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN'.split('')))
  // console.log(getPaths('NNN(N(N|)|S(S|)|)SSS'.split('')))
  console.log(getPaths(directions))
  // const firstParenthesis = directions.indexOf('(')
  // const closingParenthesis = findClosingBracket(directions.slice(firstParenthesis + 1))
  // console.log(firstParenthesis, closingParenthesis)

  // const nodes = {
  //   [node([0, 0])] : new Set()
  // }
  // const edges = []

  // const branch = []

  // let current = [0, 0]
  // directions.forEach(dir => {
  //   if (dir === 'N') {
  //     nodes[node(current)] = nodes[node(current)] || new Set()
  //     nodes[node(current)].add(dir)
  //     current[1]--
  //   }
  //   if (dir === 'S') {
  //     nodes[node(current)] = nodes[node(current)] || new Set()
  //     nodes[node(current)].add(dir)
  //     current[1]++
  //   }
  //   if (dir === 'E') {
  //     nodes[node(current)] = nodes[node(current)] || new Set()
  //     nodes[node(current)].add(dir)
  //     current[0]++
  //   }
  //   if (dir === 'W') {
  //     nodes[node(current)] = nodes[node(current)] || new Set()
  //     nodes[node(current)].add(dir)
  //     current[0]--
  //   }
  //   if (dir === '(') {
  //     console.log('branch', current)
  //     branch.push([...current])
  //   }
  //   if (dir === ')') {
  //     current = [...branch.pop()]
  //   }
  //   if (dir === '|') {
  //     console.log('alt')
  //     current = [...branch[branch.length - 1]]
  //   }
  // })

  // console.log('We have got a map')

  // current = [0, 0]
  // const distances = {}
  // let starts = [current]
  // let distance = 0
  // while (starts.length > 0) {
  //   let newStarts = []
  //   starts.forEach(start => {
  //     distances[node(start)] = distance
  //     const doors = nodes[node(start)]
  //     const N = [start[0], start[1] - 1]
  //     const S = [start[0], start[1] + 1]
  //     const W = [start[0] - 1, start[1]]
  //     const E = [start[0] + 1, start[1]]
  //     if (doors.has('N') && distances[node(N)] === undefined) newStarts.push(N)
  //     if (doors.has('S') && distances[node(S)] === undefined) newStarts.push(S)
  //     if (doors.has('W') && distances[node(W)] === undefined) newStarts.push(W)
  //     if (doors.has('E') && distances[node(E)] === undefined) newStarts.push(E)
  //   })
  //   distance++
  //   starts = newStarts
  //   console.log(distance, newStarts.length)
  // }

  // console.log('longest shortest path', Math.max(...Object.values(distances)))
})
