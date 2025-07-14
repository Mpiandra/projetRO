import { Card, CardContent, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";

const TargetNode = ({ data }) => {
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
        <Typography variant="h6">{data.label}</Typography>
      </CardContent>
    </Card>
  );
};

export default TargetNode;


