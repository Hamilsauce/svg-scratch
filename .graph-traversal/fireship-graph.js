const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');

const routes = [
    ['PHX', 'LAX'],
    ['PHX', 'JFK'],
    ['JFK', 'OKC'],
    ['JFK', 'HEL'],
    ['JFK', 'LOS'],
    ['JFK', 'EZE'],
    ['MEX', 'LAX'],
    ['MEX', 'BKK'],
    ['MEX', 'LIM'],
    ['EZE', 'MEX'],
    ['MEX', 'EZE'],
    ['LIM', 'BKK'],
];


// The graph
const adjacencyList = new Map();

// Add node
function addNode(airport) {
  adjacencyList.set(airport, []);
}

// Add edge, undirected
function addEdge(origin, destination) {
  adjacencyList.get(origin).push(destination);
  adjacencyList.get(destination).push(origin);
}

function bfs(start) {
  console.group('bfs')

  const visited = new Set();
  const queue = [start];
  
  while (queue.length > 0) {
    const airport = queue.shift(); // mutates the queue
    const destinations = adjacencyList.get(airport);

    for (const destination of destinations) {
      if (destination === 'BKK') {
        console.log(`BFS found Bangkok!`)
      }

      if (!visited.has(destination)) {
        visited.add(destination);
        queue.push(destination);
      }
    }
  }
  console.groupEnd('bfs')
}
let cnt = 0

function dfs(start, target, visited = new Set()) {
  // const targ = target
  cnt++
  console.log('start,target', start, target);
  console.log('pass count', cnt);
 
  console.group('dfs')
  console.log(start)
  visited.add(start);
  const destinations = adjacencyList.get(start);

  for (const destination of destinations) {
   if (destination === target) {
     console.log('found target!', start, target);
     return target
   }
    if (destination === 'BKK') {
      console.log(`DFS found Bangkok`)
      return;
    }
    if (!visited.has(destination)) {
      dfs(destination, target, visited);
    }
  }
  console.groupEnd('dfs')

}


// Create the Graph
airports.forEach(addNode);
routes.forEach(route => addEdge(...route))


bfs('PHX')

setTimeout(() => {
  dfs('PHX', 'EZE')
}, 1000)
