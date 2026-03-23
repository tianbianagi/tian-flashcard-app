// Simplified SM-2 algorithm
// Ratings: 'again' | 'hard' | 'easy'

const DAY_MS = 24 * 60 * 60 * 1000;

export function applyRating(card, rating) {
  let { interval, easeFactor } = card;

  switch (rating) {
    case 'again':
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case 'hard':
      interval = Math.max(1, interval * 1.2);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case 'easy':
      interval = Math.max(1, interval * easeFactor);
      easeFactor = easeFactor + 0.15;
      break;
    default:
      throw new Error(`Unknown rating: ${rating}`);
  }

  return {
    ...card,
    interval,
    easeFactor,
    nextShowTime: Date.now() + interval * DAY_MS,
  };
}
