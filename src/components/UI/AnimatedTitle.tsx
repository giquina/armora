import { useEffect, useState } from 'react';
import styles from './AnimatedTitle.module.css';

interface AnimatedTitleProps {
  text: string;
  highlightWord?: string;
  className?: string;
  delay?: number;
}

export function AnimatedTitle({ 
  text, 
  highlightWord = 'Armora', 
  className = '',
  delay = 0 
}: AnimatedTitleProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const words = text.split(' ');

  const renderWord = (word: string, wordIndex: number) => {
    const isHighlighted = word === highlightWord;
    const letters = word.split('');
    
    return (
      <span key={wordIndex} className={styles.word}>
        {letters.map((letter, letterIndex) => {
          const totalIndex = words.slice(0, wordIndex).join('').length + letterIndex;
          return (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className={`${styles.letter} ${isHighlighted ? styles.highlighted : ''}`}
              style={{
                animationDelay: isVisible ? `${totalIndex * 100}ms` : '0ms'
              }}
            >
              {letter}
            </span>
          );
        })}
        {wordIndex < words.length - 1 && <span className={styles.space}> </span>}
      </span>
    );
  };

  return (
    <h1 className={`${styles.animatedTitle} ${className} ${isVisible ? styles.animate : ''}`}>
      {words.map((word, index) => renderWord(word, index))}
    </h1>
  );
}