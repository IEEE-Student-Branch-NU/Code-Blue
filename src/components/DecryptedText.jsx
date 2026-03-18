import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
  },
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover', // 'hover', 'view', or 'both'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = (revealedSet) => {
      const allIndices = Array.from({ length: text.length }, (_, i) => i);
      const availableIndices = allIndices.filter((i) => !revealedSet.has(i));
      if (availableIndices.length === 0) return null;

      if (revealDirection === 'start') return availableIndices[0];
      if (revealDirection === 'end') return availableIndices[availableIndices.length - 1];
      if (revealDirection === 'center') {
        const center = Math.floor(text.length / 2);
        return availableIndices.reduce((prev, curr) =>
          Math.abs(curr - center) < Math.abs(prev - center) ? curr : prev
        );
      }
      return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    };

    const shouldAnimate =
      (animateOn === 'hover' && isHovering) ||
      (animateOn === 'view' && hasAnimated) ||
      (animateOn === 'both' && (isHovering || hasAnimated));

    if (shouldAnimate) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setDisplayText((prevText) => {
          const charArray = prevText.split('');

          const revealedCount = revealedIndices.size;
          const targetRevealedCount = Math.floor((currentIteration / maxIterations) * text.length);

          if (revealedCount < targetRevealedCount && revealedCount < text.length) {
            const indexToReveal = getNextIndex(revealedIndices);
            if (indexToReveal !== null) {
              setRevealedIndices((prev) => new Set(prev).add(indexToReveal));
            }
          }

          return charArray
            .map((char, i) => {
              if (revealedIndices.has(i)) return text[i];
              if (text[i] === ' ') return ' ';

              const availableChars = useOriginalCharsOnly ? text : characters;
              return availableChars[Math.floor(Math.random() * availableChars.length)];
            })
            .join('');
        });

        currentIteration++;
        if (currentIteration > maxIterations && revealedIndices.size === text.length) {
          clearInterval(interval);
          setIsScrambling(false);
        }
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => clearInterval(interval);
  }, [
    isHovering,
    hasAnimated,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
    animateOn,
    revealedIndices,
  ]);

  useEffect(() => {
    if (animateOn === 'hover') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          if (animateOn === 'view') observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn]);

  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...hoverProps}
      {...props}
    >
      <span style={styles.srOnly}>{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
