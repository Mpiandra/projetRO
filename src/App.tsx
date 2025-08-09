import { useCallback, useEffect, useMemo, useState } from 'react';
import {

  useNodesState,
  useEdgesState,
  ReactFlow,
  Connection,
  addEdge,
  Node,
  Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Box, Fab, Paper, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, South } from '@mui/icons-material';
import { nodesType } from './functions';
import CustomEdge from './edges/customEdge';
import { fullFlow, getMaxFlow } from './functions/algo';

export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      type: 'source',
      id: '0',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'α' }
    },
    {
      type: 'target',
      id: 'ω',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `ω` },
    }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [fullFlowEdges, setFullFlowEdges] = useState<Edge[]>([]);
  const [maxFlowEdges, setMaxFlowEdges] = useState<Edge[]>([]);

  const [dataMatrix, setDataMatrix] = useState<(number | undefined | string)[][]>([]);
  const [initialMatrix, setInitialMatrix] = useState<number[][]>([]);

  const [maxFlowDataMatrix, setMaxFlowDataMatrix] = useState<(number | undefined | string)[][]>([]);
  const [maxFlowMatrix, setMaxFlowMatrix] = useState<number[][]>([]);
  
  const [rows, setRows] = useState<(number | string)[][]>([]);



  useEffect(() => {
    console.log(edges);

  }, [edges])

  const addNode = useCallback(() => {
    setNodes((prevNodes) => {
      const newNode = {
        type: 'custom',
        deletable: true,
        id: (prevNodes.length - 1).toString(),
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `${String.fromCharCode((prevNodes.length -2 % 26) + 65)}` },
      };

      prevNodes[1].id = (prevNodes.length).toString();


      return [...prevNodes, newNode];
    });
  }, [setNodes]);



  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, deletable: true, type: "custom" }, eds))
  }, [setEdges])

  const updateEdgeLabel = useCallback((id: string, label: string) => {
    setEdges(
      (edges) => edges.map((edge) => edge.id === id ? { ...edge, data: { label: label } } : edge)
    )
  }, [setEdges])

  const handleClick = () => {
    const result = fullFlow(edges, nodes.length);
    setDataMatrix(result.dataMatrix);
    setInitialMatrix(result.initialMatrix)
    setRows(result.inverseRows);
    const maxFlowResult = getMaxFlow(result.initialMatrix, result.dataMatrix);
    setMaxFlowDataMatrix(maxFlowResult.updatedDataMatrix);
    setMaxFlowMatrix(maxFlowResult.updatedMatrix);

  
  }

  useEffect(() => {
  setFullFlowEdges(
    edges.map((edge) => {
      const source = parseInt(edge.source);
      const target = parseInt(edge.target);

      const newLabel = initialMatrix?.[source]?.[target];

      return {
        ...edge,
        data: {
          ...edge.data,
          label: newLabel
        }
      };
    })
  );
}, [initialMatrix]);

  useEffect(() => {
  setMaxFlowEdges(
    edges.map((edge) => {
      const source = parseInt(edge.source);
      const target = parseInt(edge.target);

      const newLabel = maxFlowMatrix?.[source]?.[target];

      return {
        ...edge,
        data: {
          ...edge.data,
          label: newLabel
        }
      };
    })
  );
}, [maxFlowMatrix]);

  const edgeTypes = useMemo(() => ({
    custom: (props: any) => <CustomEdge {...props} onLabelChange={updateEdgeLabel} />
  }), [updateEdgeLabel]);



  return (

    <Grid container spacing={0} style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }} >
       <Grid size={2}
       style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '16.66%',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }}
       >
          <Stack spacing={4}>
            {dataMatrix.length > 0 && 
              <Paper elevation={3} style={{background: 'aliceblue', height: '80vh', justifyContent: 'center'}}>
                <Stack direction={'column'} spacing={0.5}>
                  <Typography variant='h5'>Algorithme de MANUEL BLOCH</Typography>
                  <Typography variant='body1'>* On pose f(I, J) = 0 [p(I, J) = C (I, J)] : tous les arcs transportent au départune quantité nulle</Typography>
                  <Typography variant='body1'>* On choisit, dans la liste des arcs praticables la capacité résiduelle strictement positive la plus faible p(I0, J0)</Typography>
                  <Typography variant='body1'>* Déterminer un chemin simple passant par l’arc (I0, J0) choisi</Typography>
                  <Typography variant='body1'>*** Si ce chemin est élémentaire, faire passer le flux  (I0, J0) sur tous les arcs de ce chemin, et la capacité p(I,J) = p(I,J) - p(I0,J0)</Typography>
                  <Typography variant='body1'>*** Si ce chemin n’est pas élémentaire, bloquer l’ arc de capacité la plus faible du circuit ainsi mis en évidence</Typography>
                  <Typography variant='h5'>Algorithme de FORD FULKERSON</Typography>
                  <Typography variant='body1'>* Marquer l’entrée du réseau (par exemple, au moyen de « + »)</Typography>
                  <Typography variant='body1'>* Marquer toute extrémité terminale J d’un arc non saturé (I, J), dont l’extrémité initiale I est déjà marquée</Typography>
                  <Typography variant='body1'>* Marquer l’extrémité initiale K de tout arc (K, L) transportant un flux non nul, dont l’extrémité terminale L est déjà marquée</Typography>
                </Stack>
              </Paper>
            }
            <Stack direction={"row"} spacing={4}>
              <Fab onClick={addNode}><Add/></Fab>
              <Fab variant={'extended'} onClick={handleClick}><South/>Flot maximal</Fab>
          </Stack>
          </Stack>
      </Grid>

      <Grid size={10}
        style={{
          marginLeft: '16.66%',
          width: '83.34%',
      }}
      >
          <Grid sx={{height: '90vh'}}>
            <Paper style={{ background: 'aliceblue', height: '87vh', width: '100%' }}>
              <Typography variant='h4'>Flux</Typography>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodesType}
                edgeTypes={edgeTypes}
                onConnect={onConnect}
              />
            </Paper>
          </Grid>
          {/* {dataMatrix.length > 0 && (
            <Grid sx={{height: '90vh'}}>
              <Paper style={{ backgroundColor: 'aliceblue', height: '87vh', width: '100%' }}>
                <Typography variant='h4'>Flot Complet</Typography>
                <ReactFlow
                  nodes={nodes}
                  edges={fullFlowEdges}
                  onNodesChange={onNodesChange}
                  nodeTypes={nodesType}
                  edgeTypes={edgeTypes}
            />
              </Paper>
            </Grid>
          )}
          {dataMatrix.length > 0 && (
              <Grid sx={{height: '90vh'}}>
                <Box sx={{
                  height : '87vh',
                  width : '100%',
                  overflowY : 'auto',
                  border: '1px, solid',
                  borderRadius : 2,
                  p : 2
                }}>
                  <Paper style={{ backgroundColor: 'aliceblue', width: '100%' }}>
                    <Typography variant='h4'>Capacité résiduelle</Typography>
                    <Table>
                      <TableBody>
                      {edges.map((edge, rowIndex) => {
                        return (
                        <TableRow key={rowIndex}>
                          <TableCell align="center" style={{ fontWeight: "bold" }}>
                            {`x${parseInt(edge.source) + 1}x${parseInt(edge.target) + 1}`}
                          </TableCell>
                          {rows[rowIndex].map((cell, cellIndex) => {
                            const isSature = rows[rowIndex][cellIndex + 1] === "Saturé" && cell !== "Saturé";
                            
                            return (
                            <TableCell key={cellIndex} align='center' sx={{
                              color: cell === "Saturé" ? "red" : "",
                              backgroundColor: isSature ? "blue" : ""
                            }}>{cell}</TableCell>
                          )
                          })}
                        </TableRow>
                      )
                      })}
                      </TableBody>
                    </Table>
                </Paper>

                </Box>
              </Grid>
            
          )}
      {dataMatrix.length > 0 && (
          <Grid sx={{height: '90vh'}}>
            <Paper style={{ backgroundColor: 'aliceblue', height: '87vh', width: '100%' }}>
              <Typography variant='h4'>Flot Maximal</Typography>
              <ReactFlow
                nodes={nodes}
                edges={maxFlowEdges}
                onNodesChange={onNodesChange}
                nodeTypes={nodesType}
                edgeTypes={edgeTypes}
          />
            </Paper>
          </Grid>
        
      )} */}
  
      </Grid>

    </Grid>

  );
}