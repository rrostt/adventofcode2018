const fs = require('fs')

const findFirst = graph =>
  graph
    .filter(({ deps }) => deps.length === 0)
    .sort((a, b) => a.node < b.node ? -1 : 1)[0].node

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

  const steps = []
  while(graph.length > 0) {
    const nextStep = findFirst(graph)
    steps.push(nextStep)
    graph = completeStep(graph, nextStep)
  }

  console.log(steps.join(''))
})
