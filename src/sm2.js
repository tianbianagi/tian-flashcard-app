// Simplified SM-2 algorithm
// Ratings: 'again' | 'hard' | 'easy'

const DAY_MS = 24 * 60 * 60 * 1000;

export function applyRating(card, rating) {
  let newInterval;

  switch (rating) {
    case 'again':
      newInterval = 1;
      break;
    case 'hard':
      newInterval = Math.max(1, card.interval * 1.5);
      break;
    case 'easy':
      newInterval = Math.max(1, card.interval * 2.5);
      break;
    default:
      throw new Error(`Unknown rating: ${rating}`);
  }

  return {
    ...card,
    interval: newInterval,
    nextShowTime: Date.now() + newInterval * DAY_MS,
  };
}
