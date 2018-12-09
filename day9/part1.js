const play = (numPlayers, highestMarble) => {
  const places = [0]
  const players = [...new Array(numPlayers)].map(x => 0)
  let currentMarble = 0
  let currentPlayer = 0
  let toPlace = 1

  while(toPlace <= highestMarble) {
    if (toPlace % 23 === 0) {
      const toTake = (currentMarble + places.length - 7) % places.length
      players[currentPlayer] += places.splice(toTake, 1)[0] + toPlace
      currentMarble = toTake
    } else {
      const toInsert = 1 + (currentMarble + 1) % places.length
      places.splice(toInsert, 0, toPlace)
      currentMarble = toInsert
    }
    toPlace++
    currentPlayer = (currentPlayer + 1) % players.length

    if (highestMarble < 30)
      console.log(currentPlayer, places.map((x, i) => i === currentMarble ? `(${x})` : x).join(' '  ))
  }

  console.log('players', players.join(', '), players.length)

  return Math.max(...players)
}

console.log(play(9, 25))
console.log('test1 to be 8317 is', play(10, 1618))
console.log('test3 to be 2764', play(17, 1104))
console.log('test2 to be 146373 is ', play(13, 7999))

console.log('answer', play(438, 71626))
