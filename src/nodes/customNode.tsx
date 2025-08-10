import { Card, CardContent, Typography } from "@mui/material";
import { Handle, Node, Position } from "@xyflow/react";
import React from "react";
import { Element } from "../functions/interface";

const CustomNode = ({ data }) => {
  return (
    <Card
      elevation={3}
      sx={{
        background: "linear-gradient(90deg, hsla(120, 6%, 90%, 1) 0%, hsla(228, 75%, 16%, 1) 100%)",
        borderRadius: "50%",
        width: 75,
        height: 75,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", 
        overflow: "visible", 
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          position: "absolute",
          top: -10, 
          left: "50%",
          transform: "translateX(-50%)",
          width: 16,
          height: 16,
          backgroundColor: "black",
          borderRadius: "50%",
          border: "2px solid white",
          zIndex: 10,
          pointerEvents: "all", 
        }}
      />
      <CardContent
        sx={{
          padding: 0, 
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="white
        
        
        
        
        ">{data.label}</Typography>
      </CardContent>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          position: "absolute",
          bottom: -10, 
          left: "50%",
          transform: "translateX(-50%)",
          width: 16,
          height: 16,
          backgroundColor: "white",
          borderRadius: "50%",
          border: "2px solid black",
          zIndex: 10,
          pointerEvents: "all", 
        }}
      />
    </Card>
  );
};

export default CustomNode;




