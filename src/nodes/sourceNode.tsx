import { Card, CardContent, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";

const SourceNode = ({ data }) => {
  return (
    <Card
      elevation={3}
      sx={{
        backgroundColor: "#E2E9C0",
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
        <Typography variant="h6">{data.label}</Typography>
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

export default SourceNode;


