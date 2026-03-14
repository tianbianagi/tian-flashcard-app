export default function HomeScreen({ onStudy, onManage, dueCount, totalCount }) {
  return (
    <div className="home-screen">
      <div className="home-header">
        <div className="home-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <rect x="9" y="12" width="18" height="15.6" rx="2.5" fill="#a78bfa"/>
            <rect x="5" y="9" width="18" height="15.6" rx="2.5" fill="#7c3aed"/>
            <rect x="8" y="13" width="11" height="2" rx="1" fill="white" opacity="0.9"/>
            <rect x="8" y="17" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
          </svg>
        </div>
        <p className="home-subtitle">
          {totalCount === 0
            ? 'No cards yet — add some in Manage Cards.'
            : `${dueCount} card${dueCount !== 1 ? 's' : ''} due · ${totalCount} total`}
        </p>
      </div>

      <div className="home-actions">
        <button
          className="btn btn-primary"
          onClick={onStudy}
          disabled={dueCount === 0}
        >
          Start Session
          {dueCount > 0 && <span className="badge">{dueCount}</span>}
        </button>
        <button className="btn btn-secondary" onClick={onManage}>
          Manage Cards
        </button>
      </div>

      {dueCount === 0 && totalCount > 0 && (
        <p className="home-all-done">All caught up! Come back later.</p>
      )}
    </div>
  );
}
