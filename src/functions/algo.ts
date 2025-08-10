import { Edge } from "@xyflow/react";
import { Element, Way } from "./interface";


function initializeMatrix (nbNodes : number) : number[][] {
    const initialMatrix : number[][] = [];
    console.log("INIT :");
    
    for (let i = 0; i < nbNodes; i++){
        const row : number[] = [];
        for(let j = 0; j < nbNodes; j++){
            row.push(0);
        }
        initialMatrix.push(row);
    }
    return initialMatrix;
}

function recupData (edges : Edge[], nbNodes: number) : (number | undefined | string )[][]{
    const dataMatrix : (number | undefined | string)[][] = Array.from({length: nbNodes}, () => Array.from({length: nbNodes}));
    const aAfficher : (number | undefined | string)[][] = Array.from({length: nbNodes}, () => Array.from({length: nbNodes}));
    
    for(const ed of edges){
        const weight = (ed.data as {label: string}).label
        dataMatrix[parseInt(ed.source)][parseInt(ed.target)] = parseInt(weight);
        aAfficher[parseInt(ed.source)][parseInt(ed.target)] = parseInt(weight);
    }
    
    return dataMatrix;
}

function findMin(dataMatrix : (number | undefined | string)[][]) : Way{
    let min : number | undefined = undefined;
    let minRow = -1;
    let minCol = -1;
    
    for(let i = 0; i < dataMatrix.length; i++){
        for (let j = 0; j < dataMatrix.length; j++){
            const val = dataMatrix[i][j];
            if(typeof val === 'number' && (min === undefined || val < min)){
                min = val;
                minRow = i;
                minCol = j;
            }
        }
    }

    const minValue : Way = {
        value : min,
        row : minRow,
        col : minCol
    }

    return minValue;
}

function findWay(
  dataMatrix: (number | undefined | string)[][],
  minWay: Way
): Way[] {
  const n = dataMatrix.length;
  const source = 0;
  const sink = n - 1;
  const I0 = minWay.row;
  const J0 = minWay.col;

  function bfs(start: number, goal: number): number[] | null {
    const queue: number[] = [start];
    const parent = Array<number>(n).fill(-1);
    const visited = Array<boolean>(n).fill(false);
    visited[start] = true;
    while (queue.length) {
      const u = queue.shift() as number;
      if (u === goal) break;
      for (let v = 0; v < n; v++) {
        const val = dataMatrix[u][v];
        if (!visited[v] && typeof val === "number" && val > 0) {
          visited[v] = true;
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    if (!visited[goal]) return null;
    return parent;
  }

  function buildPathFromParent(parent: number[], start: number, goal: number): number[] {
    const path: number[] = [];
    let cur = goal;
    while (cur !== -1 && cur !== start) {
      path.unshift(cur);
      cur = parent[cur];
    }
    if (cur === start) path.unshift(start);
    return path;
  }

  const parentA = bfs(source, I0);
  if (!parentA) {
    if (typeof dataMatrix[I0][J0] === "number") dataMatrix[I0][J0] = "Bloqué";
    return [];
  }
  const pathA = buildPathFromParent(parentA, source, I0);

  const parentB = bfs(J0, sink);
  if (!parentB) {
    if (typeof dataMatrix[I0][J0] === "number") dataMatrix[I0][J0] = "Bloqué";
    return [];
  }
  const pathB = buildPathFromParent(parentB, J0, sink);

  const fullNodes: number[] = [...pathA, J0, ...pathB.slice(1)];

  const seen = new Map<number, number>(); 
  for (let i = 0; i < fullNodes.length; i++) {
    const node = fullNodes[i];
    if (seen.has(node)) {
      const firstIdx = seen.get(node)!;
      const secondIdx = i;
      const cycleNodes = fullNodes.slice(firstIdx, secondIdx + 1);
      const cycleEdges: { from: number; to: number; cap: number }[] = [];
      for (let k = 0; k < cycleNodes.length - 1; k++) {
        const u = cycleNodes[k];
        const v = cycleNodes[k + 1];
        const cap = dataMatrix[u][v];
        if (typeof cap === "number") {
          cycleEdges.push({ from: u, to: v, cap });
        } else {
        }
      }
      if (cycleEdges.length > 0) {
        let minEdge = cycleEdges[0];
        for (const e of cycleEdges) {
          if (e.cap < minEdge.cap) minEdge = e;
        }
        dataMatrix[minEdge.from][minEdge.to] = "Bloqué";
      }
      return [];
    }
    seen.set(node, i);
  }

  const elementaryWay: Way[] = [];
  for (let k = 0; k < fullNodes.length - 1; k++) {
    const u = fullNodes[k];
    const v = fullNodes[k + 1];
    const val = dataMatrix[u][v];
    elementaryWay.push({ row: u, col: v, value: typeof val === "number" ? val : undefined });
  }

  return elementaryWay;
}


function plusValue(initialMatrix : number[][], elementaryWay : Way[], minWay : Way) : number[][]{
    const initialMatrixCopy : number [][] = Array.from({length: initialMatrix.length}, () => Array.from({length: initialMatrix.length}));
    for(let i = 0; i < initialMatrix.length; i++){
        for (let j = 0; j < initialMatrix.length; j++){
            initialMatrixCopy[i][j] = initialMatrix[i][j]
        }
    }

    for(let oneWay of elementaryWay){
        if(minWay.value !== undefined){
            initialMatrixCopy[oneWay.row][oneWay.col] += minWay.value;
        }
    }
    return initialMatrixCopy;
}

function minusMin(dataMatrix : (number | undefined | string)[][], minWay : Way, elementaryWay : Way[]) : (number | undefined | string )[][] {
    const dataMatrixCopy : (number | undefined | string) [][] = Array.from({length: dataMatrix.length}, () => Array.from({length: dataMatrix.length}));
    for(let i = 0; i < dataMatrix.length; i++){
        for(let j = 0; j < dataMatrix.length; j++){
            dataMatrixCopy[i][j] = dataMatrix[i][j]
        }
    }

    for(let oneWay  of elementaryWay){
        let thereIsANumber : Boolean = false;
        if(oneWay.value !== undefined && minWay.value !== undefined) {
            dataMatrixCopy[oneWay.row][oneWay.col] = oneWay.value - minWay.value;
            if(dataMatrixCopy[oneWay.row][oneWay.col] == 0){
                dataMatrixCopy[oneWay.row][oneWay.col] = 'Saturé';
                for (let i = 0; i < dataMatrixCopy.length; i++){
                    if( typeof dataMatrixCopy[oneWay.row][i] === 'number'){
                        thereIsANumber = true;
                    }
                }
                if(!thereIsANumber){
                    for(let j = 0; j < dataMatrixCopy.length; j++){
                        if(typeof dataMatrixCopy[j][oneWay.row] === 'number'){
                            dataMatrixCopy[j][oneWay.row] = 'Bloqué'
                        }
                    }
                }
            }
        }
        
    }
    return dataMatrixCopy;
}

function getRowValue(dataMatrix : (number | undefined | string)[][]) : (number | string)[]{
    const row : (number | string )[] = [];
    for (let i = 0; i < dataMatrix.length; i++){
        for (let j = 0; j < dataMatrix[i].length; j++){
            const val = dataMatrix[i][j];
            if(val !== undefined){
                row.push(val);
            }
        }
    }
    return row;
}

export function fullFlow (edges : Edge[], nbNodes : number) : {dataMatrix : (number | undefined | string)[][], initialMatrix : number[][], inverseRows : (number | string)[][]}  {
    let dataMatrix = recupData(edges, nbNodes);
   
    let initialMatrix : number[][] = initializeMatrix(nbNodes);
    
    const rows : (number | string)[][] = []
    rows.push(getRowValue(dataMatrix)); 
    

    while(true){
        const minWay : Way = findMin(dataMatrix);
        
        const elementaryWay : Way[] = findWay(dataMatrix, minWay);
        

            const newDataMatrix : (number | undefined | string)[][] = minusMin(dataMatrix, minWay, elementaryWay);
            dataMatrix = newDataMatrix;
            
        
            const newInitialMatrix = plusValue(initialMatrix, elementaryWay, minWay);
            initialMatrix = newInitialMatrix;
            const row : (number | string)[] = getRowValue(newDataMatrix);
            rows.push(row);

            let thereIsANumber : boolean = false
            for(let i = 0; i < row.length; i++){
                if(typeof row[i] === 'number'){
                    thereIsANumber = true;
                }
            }
            if(!thereIsANumber) break;


    }

    const inverseRows : (number | string)[][] = Array.from({length : rows[0].length}, () => Array(rows.length)); 

    for (let i = 0; i < inverseRows.length; i++){
        for(let j = 0; j < rows.length; j++){
            inverseRows[i][j] = rows[j][i];
        }
    }

    return {dataMatrix, initialMatrix, inverseRows};
    
    
}

function getWayToSink(dataMatrix: (number | undefined | string)[][]): Element[][] {
    const allPaths: Element[][] = [];
    const sink = dataMatrix.length - 1;

    for (let col = 0; col < dataMatrix.length; col++) {
        if (dataMatrix[0][col] === "Bloqué") {
            const path: Element[] = [{
                elementValue: "Bloqué",
                elementRow: 0,
                elementCol: col,
                direction: 'forward'
            }];
            const visited = new Set<string>([`0->${col}`]);
            exploreAllPaths(path, dataMatrix, visited, sink, allPaths);
        }
    }

    return allPaths;
}

function exploreAllPaths(
    currentPath: Element[],
    dataMatrix: (number | undefined | string)[][],
    visited: Set<string>,
    sink: number,
    allPaths: Element[][]
): void {
    const last = currentPath[currentPath.length - 1];
    const current = last.elementCol;

    if (current === sink) {
        allPaths.push(currentPath);
        return;
    }

    for (let col = 0; col < dataMatrix.length; col++) {
        if (dataMatrix[current][col] === "Bloqué" && !visited.has(`${current}->${col}`)) {
            const next: Element = {
                elementValue: "Bloqué",
                elementRow: current,
                elementCol: col,
                direction: 'forward'
            };
            const newVisited = new Set(visited);
            newVisited.add(`${current}->${col}`);
            exploreAllPaths([...currentPath, next], dataMatrix, newVisited, sink, allPaths);
        }
    }

    for (let row = 0; row < dataMatrix.length; row++) {
        if (dataMatrix[row][current] === "Saturé" && !visited.has(`${row}->${current}`)) {
            const back: Element = {
                elementValue: "Saturé",
                elementRow: current,
                elementCol: row,
                direction: 'backward'
            };
            const newVisited = new Set(visited);
            newVisited.add(`${row}->${current}`);
            exploreAllPaths([...currentPath, back], dataMatrix, newVisited, sink, allPaths);
        }
    }
}

function updateMatrix(
    matrix: number[][],
    allPaths: Element[][],
    dataMatrix: (number | undefined | string)[][],
    edges : Edge[],
    nbNodes : number
): void {
    let minValueSature = Infinity;

    for (const path of allPaths) {
        for (const e of path) {
            if (e.elementValue === 'Saturé') {
                const value = matrix[e.elementCol][e.elementRow];
                if (value < minValueSature) {
                    minValueSature = value;
                }
            }
        }
    }

    console.log("minValueSature : ", minValueSature);
    

    if (minValueSature === Infinity) minValueSature = 0;

    const initialDataMatrix = recupData(edges, nbNodes);

        for (const e of allPaths[0]) {

            console.log("currentPath : ", e);
            
            if (e.direction === 'forward') {
                const newCapacity = matrix[e.elementRow][e.elementCol] + minValueSature;
                matrix[e.elementRow][e.elementCol] += minValueSature;
                console.log("oldCapacity : ", matrix[e.elementRow][e.elementCol]);
                
                console.log("newCapacity : ", newCapacity);
                
                if(initialDataMatrix[e.elementRow][e.elementCol] === newCapacity){
                    dataMatrix[e.elementRow][e.elementCol] = "Saturé";
                }
                
            } else {
                const newCapacity = matrix[e.elementCol][e.elementRow] - minValueSature;
                matrix[e.elementCol][e.elementRow] -= minValueSature
                console.log("oldCapacity : ", matrix[e.elementCol][e.elementRow]);
                
                console.log("newCapacity  : ", newCapacity);
                
                dataMatrix[e.elementCol][e.elementRow] = "Bloqué";
            }
        }
}

export function getMaxFlow(
    matrix: number[][],
    dataMatrix: (number | undefined | string)[][], edges : Edge[], nbNodes : number
): { updatedDataMatrix: (number | undefined | string)[][], updatedMatrix: number[][], allPaths : Element[][] } {

    console.log("matrix : ", matrix);
    console.log("dataMatrix : ", dataMatrix);
    
    
    const updatedMatrix = matrix.map(row => [...row]);
    const updatedDataMatrix = dataMatrix.map(row => [...row]);

    const allPaths : Element[][] = [];

    while (true) {
        const paths = getWayToSink(updatedDataMatrix);
        if (paths.length === 0) break;
        allPaths.push(paths[0])
        updateMatrix(updatedMatrix, paths, updatedDataMatrix, edges, nbNodes);
        getMaxFlow(updatedMatrix, updatedDataMatrix, edges, nbNodes);
    }

    console.log("AllPaths : ", allPaths);
    
    return { updatedDataMatrix, updatedMatrix, allPaths };
}



