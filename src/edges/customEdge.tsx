import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';
import React, { useState } from 'react';

interface CustomEdgeProps extends EdgeProps {
  onLabelChange?: (id: string, newLabel: number) => void;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id, sourceX, sourceY, targetX, targetY, data, selected, onLabelChange
}) => {

  const [label, setLabel] = useState<number>(Number(data?.label) || 0);
  const [isEditing, setIsEditing] = useState(false);

  // Lignes droites
  const edgePath = getStraightPath({ sourceX, sourceY, targetX, targetY })[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(Number(e.target.value));
  };

  const handleBlur = () => {
    setIsEditing(false);
    onLabelChange?.(id, label);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onLabelChange?.(id, label);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <>
      {/* Définition du marqueur de flèche */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
          fill="black"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>

      <BaseEdge
        path={edgePath}
        markerEnd="url(#arrowhead)" // flèche à la fin
        style={{ stroke: 'black', strokeWidth: 2 }}
      />

      <foreignObject
        x={(sourceX + targetX) / 2 - 50}
        y={(sourceY + targetY) / 2 - 15}
        width={100}
        height={30}
        style={{ pointerEvents: 'all' }}
      >
        {isEditing ? (
          <input
            type="number"
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              width: '100%',
              height: '100%',
              fontSize: '10px',
              textAlign: 'center',
              border: '1px solid blue',
              outline: 'none',
              background: 'white',
              borderRadius: '4px',
            }}
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            style={{
              width: '50%',
              height: '50%',
              fontSize: '20px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            {label}
          </div>
        )}
      </foreignObject>
    </>
  );
};

export default CustomEdge;
