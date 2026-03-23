import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';
import { subscribeToCards } from './db.js';
import HomeScreen from './components/HomeScreen.jsx';
import EditMode from './components/EditMode.jsx';
import StudyMode from './components/StudyMode.jsx';

const ALLOWED_EMAIL = 'tianbian.agi@gmail.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [allCards, setAllCards] = useState([]);
  const [screen, setScreen] = useState('home');
  const [studyQueue, setStudyQueue] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || user.email !== ALLOWED_EMAIL) return;
    const unsubscribe = subscribeToCards((cards) => {
      setAllCards(cards);
    });
    return unsubscribe;
  }, [user]);

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

  async function handleLogin() {
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ALLOWED_EMAIL) {
        setAuthError('Access denied. This app is not available for your account.');
        await signOut(auth);
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Login failed. Please try again.');
      }
    }
  }

  if (authLoading) {
    return <div className="app"><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</p></div>;
  }

  if (!user || user.email !== ALLOWED_EMAIL) {
    return (
      <div className="app">
        <div className="login-screen">
          <h1>Flashcards</h1>
          <button className="btn btn-primary" onClick={handleLogin}>
            Sign in with Google
          </button>
          {authError && <p className="login-error">{authError}</p>}
        </div>
      </div>
    );
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
