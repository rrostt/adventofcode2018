const fs = require('fs')

const findReady = graph =>
  graph
    .filter(({ deps }) => deps.length === 0)
    .sort((a, b) => a.node < b.node ? -1 : 1)
    .map(({ node }) => node)

const completeStep = (graph, step) =>
  graph.map(({ node, deps }) => ({
    node,
    deps: deps.filter(dep => dep !== step)
  }))
    .filter(({node}) => node !== step)

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let lines = content.trim().split('\n')

  const deps = lines.map(line => {
    const words = line.split(' ')
    return [words[1], words[7]]
  })

  let graph = Object.values(deps.reduce((graph, dep) => {
    let node = graph[dep[1]]
    if (node === undefined) {
      node = graph[dep[1]] = { node: dep[1], deps: [] }
    }
    node.deps.push(dep[0])
    return graph
  }, {}))

  const x = ([...new Set(graph.map(({ deps }) => deps).reduce((allDeps, deps) => [...allDeps, ...deps]))])
    .forEach(dep => {
      if (graph.filter(({node}) => node === dep).length === 0) {
        graph.push({ node: dep, deps: [] })
      }
    })

  const NUM_WORKERS = 5
  let workers = []
  let time = 0
  while(graph.length > 0) {
    const available = findReady(graph)
      .filter(step => workers.find(worker => worker.step === step) === undefined)
    workers.push(...available.slice(0, NUM_WORKERS - workers.length)
      .map(step => ({
        time: step.charCodeAt(0) - 64 + 60,
        step
      })))

    workers.forEach(worker => {
      worker.time--
      if (worker.time === 0) {
        console.log('completed', worker.step)
        graph = completeStep(graph, worker.step)
      }
    })
    workers = workers.filter(({ time }) => time > 0)

    time++
  }

  console.log(time)
})
