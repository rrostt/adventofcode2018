const printRing = start => {
  let node = start
  const nodes = []
  do {
    nodes.push(node.value)
    node = node.cw
  } while(node != start)
  return nodes
}

const play = (numPlayers, highestMarble) => {
  const players = [...new Array(numPlayers)].map(x => 0)
  let currentMarble = {
    value: 0
  }
  const startMarble = currentMarble
  let currentPlayer = 0
  let toPlace = 1

  currentMarble.cw = currentMarble
  currentMarble.ccw = currentMarble

  while(toPlace <= highestMarble) {
    if (toPlace % 23 === 0) {
      players[currentPlayer] += toPlace
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      currentMarble = currentMarble.ccw
      players[currentPlayer] += currentMarble.value
      // replace current and point ccw and cw to
      const a = currentMarble.ccw
      const b = currentMarble.cw
      a.cw = b
      b.ccw = a
      currentMarble = b
    } else {
      const a = currentMarble.cw
      const b = a.cw
      const newMarble = {
        value: toPlace,
        cw: b,
        ccw: a
      }
      a.cw = newMarble
      b.ccw = newMarble
      currentMarble = newMarble
    }
    toPlace++
    currentPlayer = (currentPlayer + 1) % players.length

    if (highestMarble < 30)
      console.log(currentPlayer, printRing(startMarble).join(' '))
  }

  return Math.max(...players)
}

console.log(play(9, 25))
console.log('test1 to be 8317 is', play(10, 1618))
console.log('test3 to be 2764', play(17, 1104))
console.log('test2 to be 146373 is ', play(13, 7999))

console.log('answer', play(438, 7162600))
