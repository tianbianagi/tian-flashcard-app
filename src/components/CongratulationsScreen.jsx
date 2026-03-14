export default function CongratulationsScreen({ reviewed, onHome }) {
  return (
    <div className="congrats-screen">
      <div className="congrats-content">
        <div className="congrats-icon">🎉</div>
        <h2>All done!</h2>
        <p>
          You reviewed <strong>{reviewed}</strong> card{reviewed !== 1 ? 's' : ''} this session.
        </p>
        <p className="congrats-sub">Come back later for the next round.</p>
        <button className="btn btn-primary" onClick={onHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
