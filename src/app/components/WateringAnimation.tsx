import React from 'react';

interface WateringAnimationProps {
  isActive: boolean;
}

export function WateringAnimation({ isActive }: WateringAnimationProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-blue-500/10 to-emerald-500/5 animate-pulse-slow" />
      
      {/* Water Droplets Container */}
      <div className="absolute inset-0">
        {/* Multiple water drops with staggered animations */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`drop-${i}`}
            className="water-drop absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }}
          >
            <div className="water-drop-inner" />
          </div>
        ))}
      </div>

      {/* Ripple Effects at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-center items-end overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={`ripple-${i}`}
            className="ripple absolute bottom-0"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Splash Particles */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {[...Array(20)].map((_, i) => {
          const angle = (Math.random() - 0.5) * 120;
          const distance = 50 + Math.random() * 100;
          return (
            <div
              key={`splash-${i}`}
              className="splash-particle absolute"
              style={{
                animationDelay: `${Math.random() * 0.5}s`,
                '--angle': `${angle}deg`,
                '--distance': `${distance}px`
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Mist/Spray Effect */}
      <div className="absolute inset-0 flex justify-center items-center">
        {[...Array(10)].map((_, i) => (
          <div
            key={`mist-${i}`}
            className="mist-particle absolute"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 30}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Shimmer/Sparkle Effects */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        /* Water Drop 3D Animation */
        .water-drop {
          top: -50px;
          animation: dropFall linear infinite;
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
        }

        .water-drop-inner {
          width: 12px;
          height: 16px;
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.95) 0%,
            rgba(5, 150, 105, 0.85) 50%,
            rgba(4, 120, 87, 0.75) 100%
          );
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          position: relative;
          box-shadow: 
            inset -2px -2px 8px rgba(255, 255, 255, 0.5),
            inset 2px 2px 8px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(16, 185, 129, 0.4);
          transform-style: preserve-3d;
          animation: wobble 0.3s ease-in-out infinite alternate;
        }

        .water-drop-inner::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 3px;
          width: 4px;
          height: 6px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          filter: blur(1px);
        }

        @keyframes dropFall {
          0% {
            transform: translateY(0) rotateX(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 50px)) rotateX(360deg) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes wobble {
          0% {
            transform: rotateY(-5deg) rotateX(5deg);
          }
          100% {
            transform: rotateY(5deg) rotateX(-5deg);
          }
        }

        /* Ripple Effect */
        .ripple {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 3px solid rgba(16, 185, 129, 0.6);
          animation: rippleExpand 2s ease-out infinite;
          box-shadow: 
            0 0 20px rgba(16, 185, 129, 0.4),
            inset 0 0 20px rgba(16, 185, 129, 0.2);
        }

        @keyframes rippleExpand {
          0% {
            transform: scale(0) translateY(0);
            opacity: 1;
            border-width: 4px;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: scale(3) translateY(-20px);
            opacity: 0;
            border-width: 0px;
          }
        }

        /* Splash Particles */
        .splash-particle {
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, 
            rgba(16, 185, 129, 1) 0%,
            rgba(5, 150, 105, 0.8) 50%,
            rgba(4, 120, 87, 0.4) 100%
          );
          border-radius: 50%;
          animation: splashOut 1.2s ease-out infinite;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
        }

        @keyframes splashOut {
          0% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: 
              translate(
                calc(cos(var(--angle)) * var(--distance)), 
                calc(sin(var(--angle)) * var(--distance) - 50px)
              ) 
              scale(0) 
              rotateZ(360deg);
            opacity: 0;
          }
        }

        /* Mist/Spray Particles */
        .mist-particle {
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, 
            rgba(209, 250, 229, 0.6) 0%,
            rgba(16, 185, 129, 0.3) 50%,
            rgba(5, 150, 105, 0.1) 100%
          );
          border-radius: 50%;
          animation: mistFloat ease-in-out infinite;
          filter: blur(3px);
        }

        @keyframes mistFloat {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
            transform: translateY(-40px) translateX(20px) scale(1);
          }
          100% {
            transform: translateY(-80px) translateX(-20px) scale(0.3);
            opacity: 0;
          }
        }

        /* Sparkle/Shimmer Effects */
        .sparkle {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: sparkleShine 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        @keyframes sparkleShine {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
            box-shadow: 
              0 0 20px rgba(255, 255, 255, 1),
              0 0 30px rgba(16, 185, 129, 0.6);
          }
        }

        /* Slow pulse for overlay */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
