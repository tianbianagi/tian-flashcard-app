export default function HomeScreen({ onStudy, onManage, dueCount, totalCount }) {
  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>Flashcards</h1>
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
