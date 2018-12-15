const fs = require('fs')

const compareXY = (a, b) => a.y - b.y !== 0 ? a.y - b.y : a.x - b.x

const getTurnList = players =>
  players.sort(compareXY)

const getPositionsFrom = (x, y) =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([ dx, dy ]) => [x + dx, y + dy])

const getAdjacentPlayers = (players, {x, y}, type) =>
  getPositionsFrom(x, y)
    .map(([x, y]) => players.find(({ x: px, y: py, c, hit }) => px === x && py === y && c === type && hit > 0))
    .filter(player => !!player)

const getDistancesFromPlayers = (canvas, players, type) => {
  const starts = players.filter(({ c, hit }) => c === type && hit > 0)
  const distances = [...new Array(canvas.length)].map(row => [...new Array(canvas[0].length)].map(_ => Number.POSITIVE_INFINITY))

  let distance = 0
  let from = starts
  while (from.length > 0) {
    const next = []
    from.forEach(({x, y}) => {
      distances[y][x] = distance
      next.push(
        ...getPositionsFrom(x,y)
          .filter(([x, y]) => canvas[y][x] === '.' && distances[y][x] > distance && !next.find(({ x: nx, y: ny }) => x === nx && y === ny))
          .map(([x, y]) => ({ x, y }))
      )
    })
    from = next
    distance++
  }
  return distances
}

const getDistancesFromPoint = (canvas, point) => {
  const distances = [...new Array(canvas.length)].map(row => [...new Array(canvas[0].length)].map(_ => Number.POSITIVE_INFINITY))

  let distance = 0
  let from = [point]
  while (from.length > 0) {
    const next = []
    from.forEach(({x, y}) => {
      distances[y][x] = distance
      next.push(
        ...getPositionsFrom(x,y)
          .filter(([x, y]) => canvas[y][x] === '.' && distances[y][x] > distance && !next.find(({ x: nx, y: ny }) => x === nx && y === ny))
          .map(([x, y]) => ({ x, y }))
      )
    })
    from = next
    distance++
  }
  return distances
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.split('\n')

  let canvas = lines.map(line => line.split(''))

  let ap = 10
  let result
  do {
    ap++
    canvas = lines.map(line => line.split(''))
    result = play(canvas, ap)
    console.log(result)
  } while (result.deadElves > 0)
  console.log(ap, result)

  // 27730
  // play(`#######
  // #.G...#
  // #...EG#
  // #.#.#G#
  // #..G#E#
  // #.....#
  // #######`.split('\n').map(x => x.trim().split('')))

  // 36334
  // play(`#######
  // #G..#E#
  // #E#E.E#
  // #G.##.#
  // #...#E#
  // #...E.#
  // #######`.split('\n').map(x => x.trim().split('')))

  // 39514
  // play(`#######
  // #E..EG#
  // #.#G.E#
  // #E.##E#
  // #G..#.#
  // #..E#.#
  // #######`.split('\n').map(x => x.trim().split('')))

  // 28944
  // play(`#######
  // #.E...#
  // #.#..G#
  // #.###.#
  // #E#G#G#
  // #...#G#
  // #######`.split('\n').map(x => x.trim().split('')))

  // 27755
  // play(`#######
  // #E.G#.#
  // #.#G..#
  // #G.#.G#
  // #G..#.#
  // #...E.#
  // #######`.split('\n').map(x => x.trim().split('')))

  // 18740
  // play(`#########
  // #G......#
  // #.E.#...#
  // #..##..G#
  // #...##..#
  // #...#...#
  // #.G...G.#
  // #.....G.#
  // #########`.split('\n').map(x => x.trim().split('')))
})

const play = (canvas, attackPower) => {
  const attack = {
    'E': attackPower,
    'G': 3
  }
  const pieces = canvas
    .map((row, y) => row.map((c, x) => ({ c, x, y })))
    .reduce((flat, row) => [...flat, ...row])
  const players = pieces.filter(({ c }) => c === 'G' || c === 'E').map(player => ({ ...player, hit: 200 }))

  let turnNumber = 0
  let result
  while (!result) {
    const turns = getTurnList(players)

    turns
      .forEach(player => {
        if (result || player.hit <= 0) return

        const friend = player.c
        const enemy = friend === 'E' ? 'G' : 'E'

        if (players.filter(({ hit, c }) => c === enemy && hit > 0).length === 0) {
          console.log('game over')
          console.log(turnNumber, players.filter(({ hit, c }) => c === friend && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0))
          console.log(turnNumber * players.filter(({ hit, c }) => c === friend && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0))
          // process.exit(0)
          result = {
            turnNumber,
            goblins: players.filter(({ hit, c }) => c === 'G' && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0),
            elves: players.filter(({ hit, c }) => c === 'E' && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0),
            deadElves: players.filter(({ hit, c }) => hit <= 0 && c === 'E').length
          }
          result.elvesPoints = result.turnNumber * result.elves
          result.goblinsPoints = result.turnNumber * result.goblins
          return
        }

        let adjacentPlayers = getAdjacentPlayers(players, player, enemy)

        // move
        if (adjacentPlayers.length === 0) {
          const distancesFrom = getDistancesFromPoint(canvas, player)
          const closest = players
            .filter(({ c, hit }) => c === enemy && hit > 0)
            .map(({ x, y }) => getPositionsFrom(x, y).filter(([x, y]) => canvas[y][x] === '.'))
            .reduce((as, a) => [...as, ...a], [])
            .map(([x, y]) => ({ x, y, d: distancesFrom[y][x] }))
            .sort((a, b) => (a.d - b.d) || compareXY(a, b))
            .filter(({ d }) => d < Number.POSITIVE_INFINITY)
          if (closest.length > 0) {
            const distancesTo = getDistancesFromPoint(canvas, closest[0])
            const moveTo = getPositionsFrom(player.x, player.y)
              .map(([x, y]) => ({ x, y, d: distancesTo[y][x] }))
              .sort((a, b) => (a.d - b.d) || compareXY(a, b))[0]

            canvas[player.y][player.x] = '.'
            canvas[moveTo.y][moveTo.x] = player.c
            player.x = moveTo.x
            player.y = moveTo.y
            adjacentPlayers = getAdjacentPlayers(players, player, enemy)
          }
        }

        // attack
        if (adjacentPlayers.length > 0) {
          adjacentPlayers.sort((a, b) => a.hit - b.hit !== 0 ? a.hit - b.hit : compareXY(a, b))
          const foe = adjacentPlayers[0]
          foe.hit -= attack[player.c]
          if (foe.hit <= 0) {
            canvas[foe.y][foe.x] = '.'
          }
        }
      })

    console.log(canvas.map(row => row.join('')).join('\n'))
    console.log('Elves', players.filter(({ hit, c }) => c === 'E' && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0), 'Goblins', players.filter(({ hit, c }) => c === 'G' && hit > 0).map(({ hit }) => hit).reduce((sum, hit) => sum + hit, 0))
    turnNumber++
    // if (turnNumber == 3) break
  }

  return result
}
