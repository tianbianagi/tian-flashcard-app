import { useState, useEffect } from 'react';
import { subscribeToCards } from './db.js';
import HomeScreen from './components/HomeScreen.jsx';
import EditMode from './components/EditMode.jsx';
import StudyMode from './components/StudyMode.jsx';

export default function App() {
  const [allCards, setAllCards] = useState([]);
  const [screen, setScreen] = useState('home');
  const [studyQueue, setStudyQueue] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCards((cards) => {
      setAllCards(cards);
    });
    return unsubscribe;
  }, []);

  const now = Date.now();
  const dueCards = allCards.filter((c) => c.nextShowTime <= now);

  function goHome() {
    setScreen('home');
  }

  function startStudy() {
    const queue = [...dueCards];
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    setStudyQueue(queue);
    setScreen('study');
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          dueCount={dueCards.length}
          totalCount={allCards.length}
          onStudy={startStudy}
          onManage={() => setScreen('edit')}
        />
      )}
      {screen === 'edit' && (
        <EditMode
          cards={allCards}
          onBack={goHome}
        />
      )}
      {screen === 'study' && (
        <StudyMode
          initialQueue={studyQueue}
          onBack={goHome}
        />
      )}
    </div>
  );
}
