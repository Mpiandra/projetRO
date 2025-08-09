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

    console.log(aAfficher);
    
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

function findWay(dataMatrix : (number | undefined | string )[][], minWay : Way) : Way[] {
   const elementaryWay : Way[] = [];
   const visited = new Set<String>();

   let actualWay : Way = {...minWay};
   elementaryWay.push(actualWay);
   visited.add(`${actualWay.row}-${actualWay.col}`);

   while(true){
    let found = false;
    for (let i = 0; i < dataMatrix.length; i++){
        const val = dataMatrix[i][actualWay.row];
        if(typeof val === 'number' && !visited.has(`${i}-${actualWay.row}`)){
            const newWay : Way = {
                value : val,
                row : i,
                col : actualWay.row
            };
            elementaryWay.unshift(newWay);
            visited.add(`${i}-${actualWay.row}`);
            actualWay = newWay;
            found = true;
            break;
        }
    }
    if(!found) break;
   }

   actualWay = minWay;
   while(true){
    let found = false;
    for (let j = 0; j < dataMatrix.length; j++){
        const val = dataMatrix[actualWay.col][j];
        if(typeof val === 'number' && !visited.has(`${actualWay.col}-${j}`)){
            
            const newWay : Way = {
                value : val,
                row : actualWay.col,
                col : j
            };
            elementaryWay.push(newWay);
            visited.add(`${actualWay.col}-${j}`);
            actualWay = newWay;
            found = true;
            break;
        }
    }
    if(!found) break;
   }

   if(elementaryWay[0].row != 0 || elementaryWay[elementaryWay.length - 1].col != dataMatrix.length - 1){
    
    
    console.log("tsy tonga am source koa : ", elementaryWay);
    
    for(const oneWay of elementaryWay){
        dataMatrix[oneWay.row][oneWay.col] = 'Bloqué'
    }
    const emptyWay : Way[] = [];
    return emptyWay;
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
            console.log("ancienne valeur : ", initialMatrixCopy[oneWay.row][oneWay.col]);
            initialMatrixCopy[oneWay.row][oneWay.col] += minWay.value;
            console.log("nouvelle valeur : ", initialMatrix[oneWay.row][oneWay.col] += minWay.value);
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
        console.log("MinWay : ", minWay);
        
        const elementaryWay : Way[] = findWay(dataMatrix, minWay);
        console.log("elementaryWay : ", elementaryWay);
        

            const newDataMatrix : (number | undefined | string)[][] = minusMin(dataMatrix, minWay, elementaryWay);
            console.log("newDataMatrix : ", newDataMatrix);
            dataMatrix = newDataMatrix;
            
        
            const newInitialMatrix = plusValue(initialMatrix, elementaryWay, minWay);
            initialMatrix = newInitialMatrix;
            console.log("newInitialMatrix : ", newInitialMatrix);
            
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

    
    

    console.log("rows : ", rows);
    console.log("inverseRows : ", inverseRows);
    
    console.log("dataMatrix : ", dataMatrix);
    
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
            console.log("Path : ", path);
            
            const visited = new Set<string>(["0->" + col]);
            exploreAllPaths(path, dataMatrix, visited, sink, allPaths);
        }
    }


    // Affichage
    if (allPaths.length === 0) {
        console.log("Aucun chemin augmentant vers le puits.");
    } else {
        console.log("allPaths : ", allPaths);
        
        console.log("Chemins augmentants trouvés :");
        for (const path of allPaths) {
            console.log(path.map(e => `${e.direction === 'forward' ? '' : '<-'}${e.elementRow}->${e.elementCol}`).join(" → "));
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
    }dataMatrix
}

function updateMatrix (matrix : number[][], allPaths : Element[][], dataMatrix : (number | undefined | string)[][]) : void {
    let minValueSature : number = 0;
    const matrixAfter = matrix;
    const dataMatrixAfter = dataMatrix;

    for(let i = 0; i < allPaths.length; i++){
        for (let j = 0; j < allPaths[i].length; j++){
            
            if(allPaths[i][j].elementValue === 'Saturé'){
                dataMatrixAfter[allPaths[i][j].elementCol][allPaths[i][j].elementRow] = 'Bloqué';
                minValueSature = matrixAfter[allPaths[i][j].elementCol][allPaths[i][j].elementRow];
                
                if(minValueSature > matrixAfter[allPaths[i][j].elementCol][allPaths[i][j].elementRow]){
                    minValueSature = matrixAfter[allPaths[i][j].elementCol][allPaths[i][j].elementRow];

                }
                
            }
        }
    }
    console.log("minValueSature : ", minValueSature);

    for(let i = 0; i < allPaths.length; i++){
        for( let j = 0; j < allPaths[i].length; j++){
            if(allPaths[i][j].elementValue === 'Bloqué'){
                matrixAfter[allPaths[i][j].elementRow][allPaths[i][j].elementCol] += minValueSature;
            } else {
                matrixAfter[allPaths[i][j].elementCol][allPaths[i][j].elementRow] -= minValueSature;
            }
        }
    }

    console.log("matrix after : ", matrix);
    console.log("dataMatrix after : ", dataMatrix);
    
    
}

export function getMaxFlow(matrix : number[][], dataMatrix : (number | undefined | string)[][]): {updatedDataMatrix : (number | undefined | string)[][], updatedMatrix : (number)[][]} {
    const allPaths : Element[][] = [];
    const updatedMatrix : number[][] = Array.from({length : matrix.length}, () => Array(matrix.length));
    const updatedDataMatrix : (number | undefined | string)[][] = Array.from({length : dataMatrix.length}, () => Array(dataMatrix.length));

    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix.length; j++){
            updatedMatrix[i][j] = matrix[i][j];
        }
    }

    for(let i = 0; i < dataMatrix.length; i++){
        for(let j = 0; j < dataMatrix.length; j++){
            updatedDataMatrix[i][j] = dataMatrix[i][j];
        }
    }

    do{
        const allPaths : Element[][] = getWayToSink(updatedDataMatrix);
        if(allPaths.length > 0){
            updateMatrix(updatedMatrix, allPaths, updatedDataMatrix);
        }
    }while(allPaths.length > 0)
    
    return{updatedDataMatrix, updatedMatrix};
}
