import { motion } from 'framer-motion';

interface VemoLogoProps {
  className?: string;
  animate?: boolean;
}

const VemoLogo = ({ className = "w-6 h-6", animate = false }: VemoLogoProps) => {
  return (
    <motion.div
      className={className}
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.8, repeat: animate ? Infinity : 0 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Purple gradient for V */}
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7e22ce', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Light purple for accents */}
          <linearGradient id="lightPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Purple pulse gradient */}
          <radialGradient id="pulsePurple">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0 }} />
          </radialGradient>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Strong glow */}
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* White background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#ffffff"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        
        {/* Pulse effect when speaking */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#pulsePurple)"
          opacity="0.3"
          animate={animate ? {
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {}}
          transition={{
            duration: 2,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Hexagon outline */}
        <path
          d="M 50 12 L 73 26 L 73 54 L 50 68 L 27 54 L 27 26 Z"
          fill="none"
          stroke="#e9d5ff"
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Inner circuit pattern - light purple */}
        <g opacity="0.3">
          <line x1="35" y1="38" x2="65" y2="38" stroke="#c084fc" strokeWidth="1.5" />
          <line x1="35" y1="52" x2="65" y2="52" stroke="#c084fc" strokeWidth="1.5" />
          <line x1="50" y1="30" x2="50" y2="60" stroke="#c084fc" strokeWidth="1.5" />
        </g>
        
        {/* Main V letter - purple gradient - SMALLER but EXTRA THICK */}
        <path
          d="M 25 28 L 50 62 L 75 28 L 85 28 L 56 72 L 44 72 L 15 28 Z"
          fill="url(#purpleGradient)"
          filter="url(#glow)"
        />
        
        {/* Network nodes - purple - repositioned */}
        <motion.circle
          cx="35"
          cy="38"
          r="3"
          fill="#a855f7"
          filter="url(#strongGlow)"
          animate={animate ? {
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut",
            delay: 0
          }}
        />
        
        <motion.circle
          cx="65"
          cy="38"
          r="3"
          fill="#a855f7"
          filter="url(#strongGlow)"
          animate={animate ? {
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        
        <motion.circle
          cx="50"
          cy="52"
          r="3"
          fill="#a855f7"
          filter="url(#strongGlow)"
          animate={animate ? {
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.6
          }}
        />
        
        {/* Corner accent dots - light purple */}
        <circle cx="50" cy="15" r="2" fill="#c084fc" opacity="0.7" />
        <circle cx="70" cy="28" r="2" fill="#c084fc" opacity="0.7" />
        <circle cx="70" cy="52" r="2" fill="#c084fc" opacity="0.7" />
        <circle cx="50" cy="65" r="2" fill="#c084fc" opacity="0.7" />
        <circle cx="30" cy="52" r="2" fill="#c084fc" opacity="0.7" />
        <circle cx="30" cy="28" r="2" fill="#c084fc" opacity="0.7" />
        
        {/* Subtle highlight on V - adjusted for smaller but thicker V */}
        <path
          d="M 27 30 L 50 60 L 44 60 L 25 30 Z"
          fill="rgba(255, 255, 255, 0.4)"
        />
      </svg>
    </motion.div>
  );
};

export default VemoLogo;