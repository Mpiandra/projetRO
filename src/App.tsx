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
import { Element } from './functions/interface';

export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    [
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
    
  ]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    []
  );
  const [fullFlowEdges, setFullFlowEdges] = useState<Edge[]>([]);
  const [maxFlowEdges, setMaxFlowEdges] = useState<Edge[]>([]);

  const [dataMatrix, setDataMatrix] = useState<(number | undefined | string)[][]>([]);
  const [initialMatrix, setInitialMatrix] = useState<number[][]>([]);

  const [maxFlowDataMatrix, setMaxFlowDataMatrix] = useState<(number | undefined | string)[][]>([]);
  const [maxFlowMatrix, setMaxFlowMatrix] = useState<number[][]>([]);
  
  const [rows, setRows] = useState<(number | string)[][]>([]);
  const [allPaths, setAllPaths] = useState<Element[][]>([]);



  useEffect(() => {
    console.log(edges);
    console.log(nodes);
    

  }, [edges, nodes])

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
    const maxFlowResult = getMaxFlow(result.initialMatrix, result.dataMatrix, edges, nodes.length);
    setMaxFlowDataMatrix(maxFlowResult.updatedDataMatrix);
    setMaxFlowMatrix(maxFlowResult.updatedMatrix);
    setAllPaths(maxFlowResult.allPaths)
  
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
          <Grid sx={{ height: '90vh' }}>
            <Paper
              sx={{
                height: '87vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(90deg, hsla(120, 6%, 90%, 1) 0%, hsla(228, 75%, 16%, 1) 100%);',
                  color: 'white',
                  padding: 2,
                  flexShrink: 0,
                  borderTopLeftRadius: 12, 
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="h4" align='center'>Flux</Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodesType}
                  edgeTypes={edgeTypes}
                  onConnect={onConnect}
                />
              </Box>
            </Paper>
          </Grid>

          {dataMatrix.length > 0 && (
            <Grid sx={{ height: '90vh' }}>
            <Paper
              sx={{
                height: '87vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(90deg, hsla(120, 6%, 90%, 1) 0%, hsla(228, 75%, 16%, 1) 100%);',
                  color: 'white',
                  padding: 2,
                  flexShrink: 0,
                  borderTopLeftRadius: 12, 
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="h4" align='center'>Flot complet</Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <ReactFlow
                  nodes={nodes}
                  edges={fullFlowEdges}
                  onNodesChange={onNodesChange}
                  nodeTypes={nodesType}
                  edgeTypes={edgeTypes}
                />
              </Box>
            </Paper>
          </Grid>
          )}
          {dataMatrix.length > 0 && (
              <Grid sx={{ height: '90vh' }}>
                <Box
                  sx={{
                    height: '87vh',
                    width: '100%',
                    border: '1px solid',
                    borderRadius: 2,
                    overflow: 'hidden', 
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(90deg, hsla(120, 6%, 90%, 1) 0%, hsla(228, 75%, 16%, 1) 100%);',
                      color: 'white',
                      padding: 2,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="h4" align='center'>Capacité résiduelle</Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                      <Table>
                        <TableBody>
                          {edges.map((edge, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                {`x${parseInt(edge.source) + 1}x${parseInt(edge.target) + 1}`}
                              </TableCell>
                              {rows[rowIndex].map((cell, cellIndex) => {
                                const isSature =
                                  rows[rowIndex][cellIndex + 1] === 'Saturé' && cell !== 'Saturé'

                                return (
                                  <TableCell
                                    key={cellIndex}
                                    align="center"
                                    sx={{
                                      color: cell === 'Saturé' ? 'red' : '',
                                      backgroundColor: isSature ? 'blue' : '',
                                    }}
                                  >
                                    {cell}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  </Box>
                </Box>
              </Grid>

            
          )}
      {dataMatrix.length > 0 && (

          <Grid sx={{ height: '90vh' }}>
            <Paper
              sx={{
                height: '87vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(90deg, hsla(120, 6%, 90%, 1) 0%, hsla(228, 75%, 16%, 1) 100%);',
                  color: 'white',
                  padding: 2,
                  flexShrink: 0,
                  borderTopLeftRadius: 12, 
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="h4" align='center'>Flot Maximal</Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <ReactFlow
                  nodes={nodes}
                  edges={maxFlowEdges}
                  onNodesChange={onNodesChange}
                  nodeTypes={nodesType}
                  edgeTypes={edgeTypes}
                />
              </Box>
            </Paper>
          </Grid>
        
      )}
  
      </Grid>

    </Grid>

  );
}