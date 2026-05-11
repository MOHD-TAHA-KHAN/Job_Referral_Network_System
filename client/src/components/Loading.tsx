import './Loading.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Loading = ({ size = 'md', message }: LoadingProps) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
