import { motion } from 'framer-motion';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating circles */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-nexlytix-500/40 to-nexlytix-700/40 blur-lg shadow-2xl"
        initial={{ x: -100, y: 100 }}
        animate={{
          x: [window.innerWidth + 100, -100],
          y: [100, 200, 150, 300],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-nexlytix-400/35 to-nexlytix-600/35 blur-md shadow-xl"
        initial={{ x: window.innerWidth + 50, y: 300 }}
        animate={{
          x: [-50, window.innerWidth + 50],
          y: [300, 100, 250, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating squares */}
      <motion.div
        className="absolute w-16 h-16 bg-nexlytix-500/30 rotate-45 shadow-lg"
        initial={{ x: 200, y: -50 }}
        animate={{
          x: [200, 300, 150, 400],
          y: [-50, window.innerHeight + 50],
          rotate: [45, 225, 405],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-12 h-12 bg-nexlytix-600/35 rotate-45 shadow-lg"
        initial={{ x: 600, y: -30 }}
        animate={{
          x: [600, 500, 700, 550],
          y: [-30, window.innerHeight + 30],
          rotate: [45, 405, 765],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-nexlytix-400/60 rounded-full shadow-md"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: -10,
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Pulsing orbs */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(157, 112, 255, 0.1) 0%, transparent 70%)',
          left: '20%',
          top: '30%',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-60 h-60 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(157, 112, 255, 0.08) 0%, transparent 70%)',
          right: '15%',
          bottom: '25%',
        }}
        animate={{
          scale: [1.2, 0.8, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingElements;