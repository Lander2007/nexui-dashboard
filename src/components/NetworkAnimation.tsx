import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

const NetworkAnimation = () => {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    // Generate network nodes
    const generateNodes = () => {
      const nodeCount = 8;
      const newNodes: Node[] = [];

      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * 80 + 10, // Keep nodes away from edges
          y: Math.random() * 80 + 10,
          connections: [],
        });
      }

      // Create connections between nearby nodes
      newNodes.forEach((node, index) => {
        const nearbyNodes = newNodes.filter((otherNode, otherIndex) => {
          if (otherIndex === index) return false;
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          return distance < 40; // Connect nodes within 40% distance
        });

        node.connections = nearbyNodes.slice(0, 2).map(n => n.id); // Max 2 connections per node
      });

      setNodes(newNodes);
    };

    generateNodes();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="absolute inset-0 w-full h-full opacity-40"> {/* Increased opacity */}
        {/* Render connections */}
        {nodes.map((node) =>
          node.connections.map((connectedId) => {
            const connectedNode = nodes.find(n => n.id === connectedId);
            if (!connectedNode) return null;

            return (
              <motion.line
                key={`${node.id}-${connectedId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${connectedNode.x}%`}
                y2={`${connectedNode.y}%`}
                stroke="rgba(157, 112, 255, 0.7)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3 + 2,
                }}
              />
            );
          })
        )}

        {/* Data flow particles along connections */}
        {nodes.map((node) =>
          node.connections.map((connectedId) => {
            const connectedNode = nodes.find(n => n.id === connectedId);
            if (!connectedNode) return null;

            return (
              <motion.circle
                key={`particle-${node.id}-${connectedId}`}
                r="3"
                fill="rgba(157, 112, 255, 1)"
                initial={{
                  cx: `${node.x}%`,
                  cy: `${node.y}%`,
                  opacity: 0,
                }}
                animate={{
                  cx: [`${node.x}%`, `${connectedNode.x}%`],
                  cy: [`${node.y}%`, `${connectedNode.y}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 4,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 3,
                  ease: "easeInOut",
                }}
              />
            );
          })
        )}
      </svg>

      {/* Network nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-4 h-4 bg-nexlytix-400 rounded-full shadow-lg border border-nexlytix-300"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            boxShadow: '0 0 15px rgba(157, 112, 255, 0.8)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            delay: node.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(157, 112, 255, 0.1) 50%, transparent 100%)',
          width: '2px',
        }}
        initial={{ x: -10 }}
        animate={{ x: window.innerWidth + 10 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(0deg, transparent 0%, rgba(157, 112, 255, 0.08) 50%, transparent 100%)',
          height: '2px',
        }}
        initial={{ y: -10 }}
        animate={{ y: window.innerHeight + 10 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Hexagonal grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(157, 112, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 25% 25%, rgba(157, 112, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(157, 112, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 60px 60px',
        }}
        animate={{
          backgroundPosition: [
            '0px 0px, 0px 0px, 0px 0px',
            '60px 60px, 30px 30px, 90px 90px',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default NetworkAnimation;