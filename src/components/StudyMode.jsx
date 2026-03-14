import { useState } from 'react';
import { updateCard, deleteCard } from '../db.js';
import { applyRating } from '../sm2.js';
import CongratulationsScreen from './CongratulationsScreen.jsx';

export default function StudyMode({ initialQueue, onBack }) {
  const [queue, setQueue] = useState(initialQueue);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

  const current = queue[0];

  function handleSkip() {
    setQueue((q) => [...q.slice(1), q[0]]);
    setRevealed(false);
    setEditing(false);
  }

  function handleReveal() {
    setRevealed(true);
  }

  function startEdit() {
    setEditFront(current.front);
    setEditBack(current.back);
    setEditing(true);
  }

  async function handleSaveEdit() {
    const f = editFront.trim();
    const b = editBack.trim();
    if (!f || !b) return;
    await updateCard({ ...current, front: f, back: b });
    setQueue((q) => [{ ...q[0], front: f, back: b }, ...q.slice(1)]);
    setEditing(false);
  }

  async function handleRate(rating) {
    if (rating === 'delete') {
      await deleteCard(current.id);
    } else {
      const updated = applyRating(current, rating);
      await updateCard(updated);
    }
    setQueue((q) => q.slice(1));
    setReviewed((n) => n + 1);
    setRevealed(false);
    setEditing(false);
  }

  if (queue.length === 0) {
    return <CongratulationsScreen reviewed={reviewed} onHome={onBack} />;
  }

  return (
    <div className="study-mode">
      <div className="study-header">
        <div className="study-header-top">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-skip" onClick={handleSkip}>Skip</button>
        </div>
        <span className="study-progress">{reviewed + 1} / {reviewed + queue.length}</span>
      </div>

      {editing ? (
        <div className="flashcard flashcard--editing">
          <div className="flashcard-inner">
            <div className="card-edit-fields">
              <textarea
                className="card-edit-textarea"
                value={editFront}
                onChange={(e) => setEditFront(e.target.value)}
                rows={3}
              />
              <div className="divider" />
              <textarea
                className="card-edit-textarea card-edit-textarea--back"
                value={editBack}
                onChange={(e) => setEditBack(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flashcard ${revealed ? 'flashcard--revealed' : ''}`}
          onClick={!revealed ? handleReveal : undefined}
          role={!revealed ? 'button' : undefined}
          tabIndex={!revealed ? 0 : undefined}
          onKeyDown={!revealed ? (e) => e.key === 'Enter' && handleReveal() : undefined}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <p className="card-text">{current.front}</p>
              {!revealed && <p className="tap-hint">Tap to reveal</p>}
            </div>

            {revealed && (
              <div className="flashcard-back">
                <div className="divider" />
                <p className="card-text card-text--back">{current.back}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editing ? (
        <div className="rating-row">
          <button className="btn-save" onClick={handleSaveEdit}>Save</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : revealed && (
        <div className="rating-row">
          <button
            className="rating-btn rating-btn--delete"
            onClick={() => handleRate('delete')}
            title="Delete card"
          >
            ❌
          </button>
          <button
            className="rating-btn rating-btn--again"
            onClick={() => handleRate('again')}
            title="Again (reset)"
          >
            😔
          </button>
          <button
            className="rating-btn rating-btn--hard"
            onClick={() => handleRate('hard')}
            title="Hard (×1.5)"
          >
            😐
          </button>
          <button
            className="rating-btn rating-btn--easy"
            onClick={() => handleRate('easy')}
            title="Easy (×2.5)"
          >
            😊
          </button>
          <button
            className="rating-btn"
            onClick={startEdit}
            title="Edit card"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
}
