import { Graph, Vertex } from './models/models.js';

const graph = new Graph();

graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.addVertex('F');

console.log('graph', graph)
console.log('graph', [...graph.adjacencyList])
const getVertex = (value) => {
  graph.adjacencyList

};

// [...vertexA]
graph.addEdge('A', 'C')
graph.addEdge('B', 'C')
graph.addEdge('B', 'D')
graph.addEdge('C', 'E')
graph.addEdge('D', 'F')
const vertexA = graph.adjacencyList.get('A');
console.log('graph', graph)

console.log('[...graph.adjacencyList]', [...graph.adjacencyList])
// console.log('[...graph.adjacencyList]', graph.adjacencyList.get('A'))
graph.adjacencyList.forEach((value, key) => {
  console.log('key, ...value', key,value)

});
