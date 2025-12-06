import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingObject {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    shape: 'circle' | 'square' | 'triangle';
    opacity: number;
}

const AnimatedBackground = () => {
    const [objects, setObjects] = useState<FloatingObject[]>([]);

    useEffect(() => {
        // Generate random floating objects
        const generateObjects = () => {
            const newObjects: FloatingObject[] = [];
            const objectCount = 15;

            for (let i = 0; i < objectCount; i++) {
                newObjects.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 40 + 20,
                    duration: Math.random() * 20 + 15,
                    delay: Math.random() * 5,
                    shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
                    opacity: Math.random() * 0.4 + 0.3, // Increased base opacity
                });
            }
            setObjects(newObjects);
        };

        generateObjects();
    }, []);

    const renderShape = (obj: FloatingObject) => {
        const baseClasses = "absolute"; // Removed blur for clarity
        const style = {
            width: obj.size,
            height: obj.size,
            left: `${obj.x}%`,
            top: `${obj.y}%`,
        };

        // Increase opacity for better visibility
        const enhancedOpacity = Math.min(obj.opacity * 3, 0.9);

        switch (obj.shape) {
            case 'circle':
                return (
                    <div
                        className={`${baseClasses} rounded-full bg-gradient-to-br from-nexlytix-400 to-nexlytix-600 shadow-lg`}
                        style={{
                            ...style,
                            opacity: enhancedOpacity,
                            boxShadow: `0 0 20px rgba(157, 112, 255, ${enhancedOpacity * 0.6})`
                        }}
                    />
                );
            case 'square':
                return (
                    <div
                        className={`${baseClasses} bg-gradient-to-br from-nexlytix-500 to-nexlytix-700 rotate-45 shadow-lg`}
                        style={{
                            ...style,
                            opacity: enhancedOpacity,
                            boxShadow: `0 0 15px rgba(157, 112, 255, ${enhancedOpacity * 0.5})`
                        }}
                    />
                );
            case 'triangle':
                return (
                    <div
                        className={`${baseClasses}`}
                        style={{
                            ...style,
                            opacity: enhancedOpacity,
                            width: 0,
                            height: 0,
                            borderLeft: `${obj.size / 2}px solid transparent`,
                            borderRight: `${obj.size / 2}px solid transparent`,
                            borderBottom: `${obj.size}px solid rgba(157, 112, 255, ${enhancedOpacity})`,
                            filter: `drop-shadow(0 0 10px rgba(157, 112, 255, ${enhancedOpacity * 0.4}))`,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Floating geometric shapes */}
            {objects.map((obj) => (
                <motion.div
                    key={obj.id}
                    initial={{
                        x: `${obj.x}vw`,
                        y: `${obj.y}vh`,
                        rotate: 0,
                        scale: 0.8
                    }}
                    animate={{
                        x: [`${obj.x}vw`, `${(obj.x + 30) % 100}vw`, `${obj.x}vw`],
                        y: [`${obj.y}vh`, `${(obj.y + 20) % 100}vh`, `${obj.y}vh`],
                        rotate: [0, 180, 360],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: obj.duration,
                        delay: obj.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute"
                >
                    {renderShape(obj)}
                </motion.div>
            ))}

            {/* Floating particles */}
            {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 bg-nexlytix-400 rounded-full shadow-lg" // Larger and clearer particles
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: [0, 0.8, 0], // Increased particle opacity
                    }}
                    transition={{
                        duration: Math.random() * 10 + 8,
                        delay: Math.random() * 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Gradient orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full opacity-30 blur-2xl" // Less blur, more opacity
                style={{
                    background: 'radial-gradient(circle, rgba(157, 112, 255, 0.4) 0%, transparent 70%)',
                }}
                initial={{ x: '10%', y: '20%' }}
                animate={{
                    x: ['10%', '80%', '10%'],
                    y: ['20%', '70%', '20%'],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute w-80 h-80 rounded-full opacity-25 blur-2xl" // Less blur, more opacity
                style={{
                    background: 'radial-gradient(circle, rgba(157, 112, 255, 0.3) 0%, transparent 70%)',
                }}
                initial={{ x: '70%', y: '60%' }}
                animate={{
                    x: ['70%', '20%', '70%'],
                    y: ['60%', '10%', '60%'],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Animated grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(157, 112, 255, 0.3)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Animated lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.line
                        key={`line-${i}`}
                        x1="0"
                        y1={`${20 + i * 20}%`}
                        x2="100%"
                        y2={`${20 + i * 20}%`}
                        stroke="rgba(157, 112, 255, 0.2)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                        transition={{
                            duration: 4,
                            delay: i * 0.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default AnimatedBackground;