import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({ children, className = '', padding = 'md', shadow = 'sm' }: CardProps) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
