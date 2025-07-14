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
import { Button, Fab, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddSharp } from '@mui/icons-material';
import { nodesType } from './functions';
import CustomEdge from './edges/customEdge';
import { fullFlow, getMaxFlow } from './functions/algo';

export default function App() {

  const [sinkLabel, setSinkLabel] = useState<string>('x2');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      type: 'source',
      id: '0',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'x1' }
    },
    {
      type: 'target',
      id: 'ω',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${sinkLabel}` },
    }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [dataMatrix, setDataMatrix] = useState<(number | undefined | string)[][]>([]);
  const [initialMatrix, setInitialMatrix] = useState<number[][]>([]);



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
        data: { label: `x${(prevNodes.length).toString()}` },
      };

      prevNodes[1].id = (prevNodes.length).toString();
      setSinkLabel(`x${(prevNodes.length + 1).toString()}`);


      return [...prevNodes, newNode];
    });
  }, [setNodes]);

  useEffect(() => {
    console.log();

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.type === 'target'
          ? { ...node, data: { ...node.data, label: sinkLabel } }
          : node
      )
    );
  }, [sinkLabel, setNodes]);


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
    getMaxFlow(result.initialMatrix, result.dataMatrix);
  }

  const edgeTypes = useMemo(() => ({
    custom: (props: any) => <CustomEdge {...props} onLabelChange={updateEdgeLabel} />
  }), [updateEdgeLabel]);

  useEffect(() => {
    console.log("DataMatrix : ", dataMatrix);
    console.log("initialMatrix : ", initialMatrix);
    
  }, [dataMatrix, initialMatrix])




  return (

    <Grid container spacing={0} style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }} >

      <Grid size={dataMatrix.length === 0 ? 12 : 7}>

        <Paper style={{ backgroundColor: 'aliceblue', height: '90vh', width: '100%' }}>
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
      {dataMatrix.length > 0 && (
        <Grid size={5}>
          <Paper style={{ backgroundColor: 'aliceblue', height: '90vh', width: '100%' }}>
            <h1>HAHA</h1>
          </Paper>
        </Grid>
      )}
      <Grid size={12}>
          <Fab onClick={addNode}><AddSharp /></Fab>
          <Button variant={'outlined'} onClick={handleClick}>graphe finale</Button>
      </Grid>

    </Grid>

  );
}