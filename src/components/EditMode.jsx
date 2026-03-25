import { useState } from 'react';
import { addCard, deleteCard, updateCard } from '../db.js';

export default function EditMode({ cards, onBack }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [toast, setToast] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    const f = front.trim();
    const b = back.trim();
    if (!f || !b) {
      setError('Both fields are required.');
      return;
    }
    await addCard(f, b);
    setFront('');
    setBack('');
    setError('');
    setToast('Card added!');
    setTimeout(() => setToast(''), 2000);
  }

  async function handleDelete(id) {
    await deleteCard(id);
    if (editingId === id) setEditingId(null);
  }

  function startEdit(card) {
    setEditingId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  }

  async function handleSave(card) {
    const f = editFront.trim();
    const b = editBack.trim();
    if (!f || !b) return;
    await updateCard({ ...card, front: f, back: b });
    setEditingId(null);
  }

  return (
    <div className="edit-mode">
      {toast && <div className="toast">{toast}</div>}
      <div className="edit-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Manage Cards</h2>
      </div>

      <form className="card-form" onSubmit={handleAdd}>
        <label>
          Front
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="e.g. Hello"
            rows={3}
          />
        </label>
        <label>
          Back
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="e.g. Hola"
            rows={3}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Add Card
        </button>
      </form>

      <div className="card-list">
        {cards.length === 0 && (
          <p className="empty-list">No cards yet. Add one above!</p>
        )}
        {cards.map((card) =>
          editingId === card.id ? (
            <div key={card.id} className="card-list-item card-list-item--editing">
              <div className="card-edit-fields">
                <textarea
                  className="card-edit-textarea"
                  value={editFront}
                  onChange={(e) => setEditFront(e.target.value)}
                  rows={2}
                />
                <textarea
                  className="card-edit-textarea"
                  value={editBack}
                  onChange={(e) => setEditBack(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="card-edit-actions">
                <button className="btn-save" onClick={() => handleSave(card)}>Save</button>
                <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div key={card.id} className="card-list-item">
              <div className="card-list-text">
                <span className="card-list-front">{card.front}</span>
                <span className="card-list-back">{card.back}</span>
              </div>
              <div className="card-list-actions">
                <button
                  className="btn-edit"
                  onClick={() => startEdit(card)}
                  title="Edit card"
                >
                  ✎
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(card.id)}
                  title="Delete card"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
