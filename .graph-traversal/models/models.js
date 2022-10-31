export class Vertex {
  constructor(value) {
    this.value = value;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

// export class AdjacencyList {
//   constructor(entries = []) {
//     this._nodes = new Map(...entries);
//   };

//   get nodes() { return this._nodes };
//   set nodes(newValue) { this._nodes = newValue };
// }

// GRAPH
export class Graph {
  constructor(direction = 'DIRECTED') {
    this.direction = direction
    // this.adjacencyList = new AdjacencyList();
    this.adjacencyList = new Map()
  };

  createVertex(value) {
    return new Vertex(value);
  }

  addVertex(value) {
    /* <key:Vertex, value: ADJACENCYLIST> */
    this.adjacencyList.set((value instanceof Vertex ? value : new Vertex(value)), new Map())
    return this;
  }

  getVertex() {}

  addEdge(src, dest) {
    if (this.adjacencyList.has(src)) {
      this.adjacencyList.get(src).set(dest);
      console.log('this.adjacencyList.get(src)', [...this.adjacencyList.get(src)])

    }
  }
  removeVertex() {}
  removeEdge() {}
  print() {}
  render() {}


  has(node) { return this.adjacencyList.has(src) }

  get(node) {
    return this.adjacencyList.has(node) ? this.adjacencyList.get(node) : null;
  }

  set(node) {
    /* TODO: Create New Node Instance */
    if (!this.adjacencyList.has(node)) this.adjacencyList.set(node);
    return this;
  }

  bfs(start) {
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
  }

  dfs(start, visited = new Set()) {
    console.log(start)
    visited.add(start);
    const destinations = adjacencyList.get(start);

    for (const destination of destinations) {
      if (destination === 'BKK') {
        console.log(`DFS found Bangkok`)
        return;
      }
      if (!visited.has(destination)) {
        dfs(destination, visited);
      }
    }
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

{
  Vertex,
  Graph
}

bfs('PHX')
dfs('PHX')
