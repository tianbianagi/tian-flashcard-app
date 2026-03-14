import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase.js';

const cardsCol = collection(db, 'cards');

export function subscribeToCards(callback) {
  return onSnapshot(cardsCol, (snapshot) => {
    const cards = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(cards);
  });
}

export async function addCard(front, back, tags = []) {
  const card = {
    front,
    back,
    tags,
    interval: 1,
    easeFactor: 2.5,
    nextShowTime: Date.now(),
  };
  const ref = await addDoc(cardsCol, card);
  return { id: ref.id, ...card };
}

export async function updateCard(updated) {
  const { id, ...data } = updated;
  await setDoc(doc(db, 'cards', id), data);
}

export async function deleteCard(id) {
  await deleteDoc(doc(db, 'cards', id));
}

export async function importCards(newCards, existingCards) {
  const existingFronts = new Set(existingCards.map((c) => c.front));
  const batch = writeBatch(db);
  let imported = 0;

  for (const card of newCards) {
    if (!existingFronts.has(card.front)) {
      batch.set(doc(cardsCol), {
        front: card.front,
        back: card.back,
        tags: card.tags || [],
        interval: 1,
        easeFactor: 2.5,
        nextShowTime: Date.now(),
      });
      imported++;
    }
  }

  await batch.commit();
  return imported;
}

export async function clearAllCards(existingCards) {
  const batch = writeBatch(db);
  for (const card of existingCards) {
    batch.delete(doc(db, 'cards', card.id));
  }
  await batch.commit();
}
