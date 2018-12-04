const fs = require('fs')

const range = (from, to) => {
  return [...new Array(to - from)].map((_, i) => i + from)
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  const lines = content.split('\n')

  lines.sort()

  const sleepSessions = []
  let id
  let asleep
  lines.forEach(line => {
    const words = line.split(' ')
    if (line.indexOf('Guard') !== -1) {
      const idword = words.find(word => word.indexOf('#') === 0)
      id = +idword.substring(1)
    }
    if (line.indexOf('wakes') !== -1) {
      const wakeup = parseInt(words[1].split(':')[1])
      sleepSessions.push({ id, date: words[0].substring(1), sleep: range(asleep, wakeup) })
    }
    if (line.indexOf('asleep') !== -1) {
      asleep = parseInt(words[1].split(':')[1])
    }
  })

  const helpersDict = sleepSessions.reduce((o, session) => {
    if (!o[session.id]) {
      o[session.id] = []
    }
    o[session.id].push(session)
    return o
  }, {})

  const helpers = Object.keys(helpersDict).map(id => {
    const helperSessions = helpersDict[id]
    const sleeps = helperSessions.reduce((minutes, session) => {
      session.sleep.forEach(minute => minutes[minute]++)
      return minutes
    }, [...new Array(60)].map(x => 0))
    return {
      id: id,
      sleeps: sleeps
    }
  })

  helpers.sort((a, b) => a.sleeps.reduce((sum, x) => sum + x) - b.sleeps.reduce((sum, x) => sum + x))

  console.log(helpers.reverse()[0])
  console.log(helpers[0].sleeps.map((x, i) => `${x} ${i}`))
})
