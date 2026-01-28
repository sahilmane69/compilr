"use client";
import { useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, BackgroundVariant, Node, Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IRNode } from '../../lib/languages/interface';

interface GraphViewProps {
     data: { rootId: string; nodes: Record<string, IRNode> };
}

export function GraphView({ data }: GraphViewProps) {
     const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
     const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

     useEffect(() => {
          if (!data || !data.rootId) {
               setNodes([]);
               setEdges([]);
               return;
          }

          const newNodes: Node[] = [];
          const newEdges: Edge[] = [];

          const LEVELS_gap = 150;
          const SIBLINGS_gap = 220;

          // BFS to determine levels
          const levels: Record<number, string[]> = {};
          const q: { id: string, level: number }[] = [{ id: data.rootId, level: 0 }];
          const visited = new Set<string>();

          while (q.length > 0) {
               const { id, level } = q.shift()!;
               if (visited.has(id)) continue;
               visited.add(id);

               if (!levels[level]) levels[level] = [];
               levels[level].push(id);

               const node = data.nodes[id];
               if (node && node.children) {
                    node.children.forEach(c => q.push({ id: c, level: level + 1 }));
               }
          }

          Object.keys(levels).forEach(lvlKey => {
               const lvl = parseInt(lvlKey);
               const ids = levels[lvl];
               const startX = -(ids.length * SIBLINGS_gap) / 2;

               ids.forEach((id, idx) => {
                    const node = data.nodes[id];
                    if (!node) return;

                    // Color coding based on IR Type / Role
                    let bg = 'hsl(240 5% 15%)';
                    let border = '#333';
                    let color = '#ccc';

                    if (node.role === 'definition') { border = '#818cf8'; color = '#fff'; }
                    if (node.role === 'operator') { border = '#f472b6'; }
                    if (node.role === 'literal') { border = '#34d399'; }

                    // Richer Node Content via HTML Label
                    // For simplicity in React Flow default nodes, we pass string or simpler component.
                    // But we can construct a JSX-like label structure if we used custom node types.
                    // For now, let's format the label text.

                    const displayLabel = `${node.type}\n${node.label !== node.type ? node.label : ''}`;

                    newNodes.push({
                         id,
                         data: { label: displayLabel },
                         position: { x: startX + idx * SIBLINGS_gap, y: lvl * LEVELS_gap },
                         style: {
                              background: bg,
                              color: color,
                              border: `1px solid ${border}`,
                              borderRadius: '6px',
                              fontSize: '11px',
                              width: 180,
                              padding: '8px',
                              textAlign: 'center',
                              fontFamily: 'var(--font-mono)',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                         }
                    });

                    if (node.children) {
                         node.children.forEach(cid => {
                              newEdges.push({
                                   id: `${id}-${cid}`,
                                   source: id,
                                   target: cid,
                                   type: 'smoothstep',
                                   animated: false,
                                   style: { stroke: 'rgba(255,255,255,0.3)' },
                                   markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.3)' }
                              });
                         });
                    }
               });
          });

          setNodes(newNodes);
          setEdges(newEdges);

     }, [data, setNodes, setEdges]);

     return (
          <div style={{ width: '100%', height: '100%', background: 'hsl(240 5% 8%)', borderRadius: '8px', border: '1px solid #333' }}>
               <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    minZoom={0.1}
                    colorMode="dark"
               >
                    <Background color="#333" gap={20} variant={BackgroundVariant.Dots} />
                    <Controls />
                    <MiniMap style={{ background: '#111' }} nodeColor="#444" />
               </ReactFlow>
          </div>
     );
}
