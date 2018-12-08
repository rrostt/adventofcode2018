const fs = require('fs')

const parseNode = data => {
  const numChildren = +data[0]
  const numMeta = +data[1]
  const children = []

  let pos = 2
  for (let i=0;i<numChildren;i++) {
    const { child, size } = parseNode(data.slice(pos))
    children.push(child)
    pos += size
  }
  return {
    child: {
      children,
      meta: data.slice(pos, pos + numMeta)
    },
    size: pos + numMeta
  }
}

const sumMeta = node => {
  return [...node.meta, ...node.children.map(sumMeta)].reduce((sum, x) => sum + x)
}

fs.readFile('./input.txt', 'utf8', (err, content) => {
  let data = content.trim().split(' ').map(x => +x)

  const root = parseNode(data).child

  const metaSum = sumMeta(root)

  console.log('meta', metaSum)
})
