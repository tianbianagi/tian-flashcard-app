import { useEffect, useRef } from 'react';

export default function CongratulationsScreen({ reviewed, onHome }) {
  const onHomeRef = useRef(onHome);
  onHomeRef.current = onHome;

  useEffect(() => {
    const timer = setTimeout(() => onHomeRef.current(), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="congrats-screen">
      <div className="congrats-content">
        <div className="congrats-icon">🎉</div>
        <h2>All done!</h2>
        <p>
          You reviewed <strong>{reviewed}</strong> card{reviewed !== 1 ? 's' : ''} this session.
        </p>
        <p className="congrats-sub">Come back later for the next round.</p>
      </div>
    </div>
  );
}
