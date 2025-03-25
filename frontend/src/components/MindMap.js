import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import Spinner from './Spinner';
import apiClient from '../utils/apiclients';

// Create a context to store the mindmap data across navigation
export const MindMapContext = React.createContext(null);

// Update CSS styles to include improved design
const styles = `
.mindmap-container {
  display: flex;
  flex-direction: column;
  height: 85vh;
  width: 100%;
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.mindmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.mindmap-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #4f46e5, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.mindmap-canvas {
  flex: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.loading-container p {
  margin-top: 1rem;
  color: #4b5563;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert-danger {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* Customize ReactFlow styles */
.react-flow__node {
  transition: transform 0.2s ease;
}

.react-flow__node:hover {
  transform: scale(1.05);
  z-index: 10;
}

.react-flow__edge {
  transition: stroke 0.2s ease;
}

.react-flow__controls {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.react-flow__controls button {
  border-radius: 4px;
  background: white;
  box-shadow: none;
  color: #4b5563;
}

.react-flow__controls button:hover {
  background: #f3f4f6;
}
`;

// Custom Node Component with enhanced styling
const MindMapNode = ({ data, id }) => {
  const isRoot = data.isRoot;
  const level = data.level || 0;
  
  // Determine styling based on node level
  const getNodeStyle = () => {
    if (isRoot) {
      return {
        background: 'linear-gradient(45deg, #4338ca, #6366f1)', // Indigo gradient for root
        color: 'white',
        borderRadius: '10px',
        padding: '14px 22px',
        minWidth: '200px',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      };
    }
    
    const nodeStyles = [
      { // Level 1
        background: 'linear-gradient(45deg, #6366f1, #818cf8)',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 18px',
        boxShadow: '0 3px 8px rgba(129, 140, 248, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      { // Level 2
        background: 'linear-gradient(45deg, #0d9488, #2dd4bf)',
        color: 'white',
        borderRadius: '6px',
        padding: '8px 14px',
        boxShadow: '0 2px 6px rgba(45, 212, 191, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      { // Level 3+
        background: 'linear-gradient(45deg, #9333ea, #c084fc)',
        color: 'white',
        borderRadius: '5px',
        padding: '6px 12px',
        boxShadow: '0 2px 4px rgba(192, 132, 252, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }
    ];
    
    return nodeStyles[Math.min(level - 1, nodeStyles.length - 1)];
  };
  
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: isRoot ? '16px' : level === 1 ? '14px' : '12px',
        fontWeight: isRoot ? 600 : level === 1 ? 500 : 400,
        ...getNodeStyle(),
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      {data.label}
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
};

// Custom Edge Component with enhanced styling
const MindMapEdge = ({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: '#6366f1',
        strokeWidth: 2,
        strokeDasharray: '0',
        filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05))',
        transition: 'stroke 0.2s, strokeWidth 0.2s',
        ...style,
      }}
    />
  );
};

// Custom Node Types
const nodeTypes = {
  mindmapNode: MindMapNode,
};

// Custom Edge Types
const edgeTypes = {
  mindmapEdge: MindMapEdge,
};

function MindMap({ pdfData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [mindmapData, setMindmapData] = useState(null);
  
  useEffect(() => {
    if (id) {
      loadMindmap(id);
    } else if (pdfData) {
      generateMindMap();
    }
  }, [id, pdfData]);

  // Layout the nodes in a tree structure
  const layoutNodes = (nodes, edges) => {
    if (!nodes.length) return nodes;
    
    // Find the root node
    const rootNode = nodes.find(node => node.data.isRoot);
    if (!rootNode) return nodes;
    
    // Create a map of nodes by id
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = node;
    });
    
    // Create a map of children for each node
    const childrenMap = {};
    edges.forEach(edge => {
      if (!childrenMap[edge.source]) {
        childrenMap[edge.source] = [];
      }
      childrenMap[edge.source].push(edge.target);
    });
    
    // Root node position
    rootNode.position = { x: 0, y: 0 };
    
    // Recursively position children
    const positionChildren = (nodeId, level, index, siblingCount, parentX) => {
      if (!nodeMap[nodeId] || !childrenMap[nodeId]) return;
      
      const children = childrenMap[nodeId];
      const levelSpacing = 150;
      const siblingSpacing = 200;
      
      // Calculate x position based on siblings
      let xStart = parentX - ((siblingCount - 1) * siblingSpacing) / 2;
      
      children.forEach((childId, i) => {
        const child = nodeMap[childId];
        
        // Set position
        const x = xStart + i * siblingSpacing;
        const y = level * levelSpacing;
        
        child.position = { x, y };
        
        // Position this node's children
        if (childrenMap[childId] && childrenMap[childId].length > 0) {
          positionChildren(childId, level + 1, i, childrenMap[childId].length, x);
        }
      });
    };
    
    // Start positioning from the root
    if (childrenMap[rootNode.id]) {
      positionChildren(rootNode.id, 1, 0, childrenMap[rootNode.id].length, 0);
    }
    
    return nodes;
  };

  const generateMindMap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Generating mind map for:", pdfData.filename);
      
      const response = await apiClient.post('/generate-mindmap', { 
        filename: pdfData.filename,
        extract_method: "hybrid"
      });
      
      console.log("Mind map API response:", response.data);
      
      if (response.data && response.data.mindmap) {
        const { mindmap } = response.data;
        setMindmapData(mindmap);
        
        console.log("Mind map data structure:", mindmap);
        
        // Transform the mind map data into ReactFlow nodes and edges
        const { transformedNodes, transformedEdges } = transformMindMapData(mindmap);
        
        console.log("Transformed nodes:", transformedNodes);
        console.log("Transformed edges:", transformedEdges);
        
        // Apply layout to position nodes
        const positionedNodes = layoutNodes([...transformedNodes], [...transformedEdges]);
        
        setNodes(positionedNodes);
        setEdges(transformedEdges);
        
        // Center the view
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2 });
          }
        }, 50);
      } else {
        console.error("Missing mindmap in response:", response.data);
        setError("Failed to generate mind map: no data returned from server");
      }
    } catch (err) {
      console.error("Error generating mind map:", err);
      setError("Failed to generate mind map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMindmap = async (mindmapId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/mindmaps/${mindmapId}`);
      
      if (response.data) {
        setMindmapData(response.data);
        
        // Transform the mind map data into ReactFlow nodes and edges
        const { transformedNodes, transformedEdges } = transformMindMapData(response.data);
        
        // Apply layout to position nodes
        const positionedNodes = layoutNodes([...transformedNodes], [...transformedEdges]);
        
        setNodes(positionedNodes);
        setEdges(transformedEdges);
        
        // Center the view
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2 });
          }
        }, 50);
      }
    } catch (err) {
      console.error("Error loading mind map:", err);
      setError("Failed to load mind map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Transform mind map data into ReactFlow nodes and edges
  const transformMindMapData = (data) => {
    let nodeId = 0;
    const transformedNodes = [];
    const transformedEdges = [];
    
    // Helper function to recursively process nodes
    const processNode = (node, parentId = null, level = 0) => {
      const currentId = `node-${nodeId++}`;
      
      // Create the node
      transformedNodes.push({
        id: currentId,
        type: 'mindmapNode',
        data: { 
          label: node.text || node.name || node.title || "Unnamed Node",
          isRoot: level === 0,
          level: level
        },
        position: { x: 0, y: 0 }, // Positions will be calculated by the layout
      });
      
      // Create edge from parent to this node
      if (parentId) {
        transformedEdges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'mindmapEdge',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#6366F1',
          },
        });
      }
      
      // Process children
      if (node.children && node.children.length > 0) {
        node.children.forEach(childNode => {
          processNode(childNode, currentId, level + 1);
        });
      }
    };
    
    // Start processing from the root
    processNode(data);
    
    return { transformedNodes, transformedEdges };
  };

  // Add a style tag to the component
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const onInit = useCallback(instance => {
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 50);
  }, []);

  return (
    <div className="mindmap-container scale-in">
      <div className="mindmap-header">
        <h2>Mind Map Visualization</h2>
        {pdfData && (
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        )}
      </div>
      
      {error && (
        <div className="alert alert-danger flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading-container">
          <Spinner />
          <p>Generating your mind map...</p>
        </div>
      ) : (
        <div className="mindmap-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={onInit}
            fitView
            attributionPosition="bottom-right"
            zoomOnScroll={true}
            panOnScroll={true}
            preventScrolling={false}
            zoomOnDoubleClick={true}
          >
            <Background 
              color="#e2e8f0" 
              gap={16} 
              size={1}
              variant="dots"
            />
            <Controls 
              showZoom={true}
              showFitView={true}
              showInteractive={true}
              style={{ margin: 10 }}
            />
          </ReactFlow>
        </div>
      )}
    </div>
  );
}

// Wrap MindMap with ReactFlowProvider
function MindMapWithProvider(props) {
  return (
    <MindMapContext.Provider value={null}>
      <ReactFlowProvider>
        <MindMap {...props} />
      </ReactFlowProvider>
    </MindMapContext.Provider>
  );
}

export default MindMapWithProvider; 