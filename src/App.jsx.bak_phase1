import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Volume2, Bookmark, BookmarkCheck,
  Calendar, Search, X, Moon, Sun, Sparkles, TrendingUp, Award,
  Eye, EyeOff, Menu, BookOpen, AlertCircle, Brain, CheckCircle2,
  XCircle, RefreshCw, Home as HomeIcon
} from 'lucide-react';
import wordData from './data/words.json';

// ============================================================
// CONSTANTS & HELPERS
// ============================================================
const STORAGE_KEYS = {
  LEARNED: 'rcal_learned',
  NOT_YET: 'rcal_not_yet',
  BOOKMARKED: 'rcal_bookmarked',
  LAST_VISIT: 'rcal_last_visit',
  THEME: 'rcal_theme',
  STREAK_DATA: 'rcal_streak',
};

const getTodayISO = () => new Date().toISOString().split('T')[0];

const findTodayIndex = () => {
  const today = getTodayISO();
  const idx = wordData.findIndex(d => d.date === today);
  if (idx >= 0) return idx;
  // If today is before start or after end
  const first = wordData[0]?.date;
  const last = wordData[wordData.length - 1]?.date;
  if (today < first) return 0;
  if (today > last) return wordData.length - 1;
  // Otherwise find closest
  return 0;
};

// ============================================================
// CUSTOM HOOK: localStorage state
// ============================================================
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

// ============================================================
// COMPONENT: WordCard — main card showing one word
// ============================================================
function WordCard({ word, dayEntry, onSpeak, isLearned, isNotYet, isBookmarked,
                   onMarkLearned, onMarkNotYet, onToggleBookmark, dark }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className={`word-card-inner ${dark ? 'dark' : ''}`}>
      {/* Image / Visual */}
      <div className="word-image-area">
        {word.image ? (
          <img src={word.image} alt={word.meaning} className="word-image" />
        ) : (
          <div className="word-image-placeholder">
            <Sparkles size={48} strokeWidth={1.2} />
            <div className="placeholder-text">{word.meaning.split(/[\/\s,]/)[0]}</div>
          </div>
        )}
      </div>

      {/* Russian word */}
      <div className="word-main">
        <h1 className="russian-word">{word.word}</h1>
        <button
          className="speak-btn"
          onClick={() => onSpeak(word.word)}
          title="Speak"
          aria-label="Speak word"
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Pronunciation */}
      <div className="pronunciation-row">
        <span className="pron">{word.pronunciation}</span>
        <span className="ipa">{word.ipa}</span>
      </div>

      {/* Meaning (hide/reveal) */}
      <div className="meaning-section">
        {hidden ? (
          <button className="reveal-btn" onClick={() => setHidden(false)}>
            <Eye size={18} /> Tap to reveal meaning
          </button>
        ) : (
          <>
            <div className="meaning-row">
              <p className="meaning">{word.meaning}</p>
              <button className="hide-btn" onClick={() => setHidden(true)} title="Hide meaning">
                <EyeOff size={16} />
              </button>
            </div>
            <p className="part-of-speech">{word.part_of_speech}</p>
          </>
        )}
      </div>

      {/* Example sentence */}
      {!hidden && (
        <div className="example-section">
          <p className="sentence-ru">
            {word.sentence_ru}
            <button
              className="mini-speak"
              onClick={() => onSpeak(word.sentence_ru)}
              title="Speak sentence"
            >
              <Volume2 size={14} />
            </button>
          </p>
          <p className="sentence-en">{word.sentence_en}</p>
        </div>
      )}

      {/* Notes */}
      {!hidden && word.notes && (
        <div className="notes-section">
          <strong>Note:</strong> {word.notes}
        </div>
      )}

      {/* PROMINENT learned / not yet buttons */}
      <div className="recall-buttons">
        <button
          className={`recall-btn learned ${isLearned ? 'active' : ''}`}
          onClick={() => onMarkLearned(word.id)}
        >
          <CheckCircle2 size={22} />
          <span>{isLearned ? 'Learned!' : "I know this"}</span>
        </button>
        <button
          className={`recall-btn notyet ${isNotYet ? 'active' : ''}`}
          onClick={() => onMarkNotYet(word.id)}
        >
          <XCircle size={22} />
          <span>{isNotYet ? 'In Review List' : "Not yet"}</span>
        </button>
      </div>

      {/* Bookmark */}
      <div className="bookmark-row">
        <button
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={() => onToggleBookmark(word.id)}
        >
          {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: DayCard — wraps one day (may have 1+ words)
// ============================================================
function DayCard({ dayEntry, onSpeak, learned, notYet, bookmarked,
                  onMarkLearned, onMarkNotYet, onToggleBookmark, dark }) {
  const [wordIdx, setWordIdx] = useState(0);

  // reset when day changes
  useEffect(() => { setWordIdx(0); }, [dayEntry.id]);

  const word = dayEntry.words[wordIdx];
  const hasMultiple = dayEntry.words.length > 1;

  const dateObj = new Date(dayEntry.date);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const isSunday = dateObj.getDay() === 0;

  return (
    <div className="day-card-outer">
      {/* Header strip */}
      <div className="card-header">
        <div className="date-stack">
          <div className="day-number">{dayNumber}</div>
          <div className="month-name">{monthName}</div>
          <div className={`day-of-week ${isSunday ? 'sunday' : ''}`}>{dayOfWeek}</div>
        </div>
        <div className="theme-stack">
          <span className="cefr-badge">{dayEntry.cefr_level}</span>
          <h2 className="theme-name">{dayEntry.theme}</h2>
          <span className="category-name">{dayEntry.category}</span>
        </div>
      </div>

      {/* Multi-word tabs */}
      {hasMultiple && (
        <div className="word-tabs">
          {dayEntry.words.map((w, i) => (
            <button
              key={w.id}
              className={`word-tab ${i === wordIdx ? 'active' : ''} ${learned.includes(w.id) ? 'tab-learned' : ''}`}
              onClick={() => setWordIdx(i)}
            >
              {i + 1}. {w.word}
            </button>
          ))}
        </div>
      )}

      {/* Word card */}
      <WordCard
        word={word}
        dayEntry={dayEntry}
        onSpeak={onSpeak}
        isLearned={learned.includes(word.id)}
        isNotYet={notYet.includes(word.id)}
        isBookmarked={bookmarked.includes(word.id)}
        onMarkLearned={onMarkLearned}
        onMarkNotYet={onMarkNotYet}
        onToggleBookmark={onToggleBookmark}
        dark={dark}
      />

      {/* Tip — LARGER */}
      <div className="tip-section">
        <div className="tip-header">
          <Sparkles size={18} />
          <span>Tip of the Day</span>
        </div>
        <p className="tip-text">{dayEntry.tip}</p>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: ReviewList — words marked "Not yet"
// ============================================================
function ReviewList({ notYet, allWords, onClose, onSpeak, onMarkLearned, dark }) {
  const reviewWords = useMemo(() => {
    return allWords.filter(w => notYet.includes(w.id));
  }, [notYet, allWords]);

  return (
    <div className={`view-overlay ${dark ? 'dark' : ''}`}>
      <div className="view-header">
        <h2><AlertCircle size={22} /> Need Review ({reviewWords.length})</h2>
        <button className="close-btn" onClick={onClose}><X size={22} /></button>
      </div>
      {reviewWords.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={48} strokeWidth={1.2} />
          <p>No words to review!</p>
          <p className="sub">Words you mark "Not yet" will appear here.</p>
        </div>
      ) : (
        <div className="review-grid">
          {reviewWords.map(w => (
            <div key={w.id} className="review-item">
              <div className="review-word-row">
                <span className="review-ru">{w.word}</span>
                <button className="mini-speak" onClick={() => onSpeak(w.word)}>
                  <Volume2 size={14} />
                </button>
              </div>
              <span className="review-en">{w.meaning}</span>
              <span className="review-pron">{w.pronunciation}</span>
              <button
                className="review-mark-learned"
                onClick={() => onMarkLearned(w.id)}
              >
                <CheckCircle2 size={16} /> Got it!
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: BrainManual — neuroscience-based usage guide
// ============================================================
function BrainManual({ onClose, dark }) {
  return (
    <div className={`view-overlay ${dark ? 'dark' : ''}`}>
      <div className="view-header">
        <h2><Brain size={22} /> How Your Brain Learns Russian</h2>
        <button className="close-btn" onClick={onClose}><X size={22} /></button>
      </div>
      <div className="manual-content">
        <section>
          <h3>🧠 Why this calendar works</h3>
          <p>
            This app is built around four principles backed by cognitive
            neuroscience. Following them, you will retain far more than
            with passive study (textbooks, vague exposure).
          </p>
        </section>

        <section>
          <h3>1. Spaced repetition (forgetting curve)</h3>
          <p>
            Your brain forgets ~60% of new information within 24 hours.
            But if you review at expanding intervals — 1 day, 3 days,
            7 days, 15 days, 30 days — memory becomes near-permanent.
          </p>
          <p className="manual-tip">
            👉 <strong>How to use:</strong> Mark words "Not yet" when
            uncertain. Visit the Review list every day. Mark "Got it!"
            only when you feel confident.
          </p>
        </section>

        <section>
          <h3>2. Active recall (not passive reading)</h3>
          <p>
            Research shows recalling information improves retention by
            ~80%, vs. 34% for passive reading. The mental effort to
            retrieve a word strengthens the neural pathway.
          </p>
          <p className="manual-tip">
            👉 <strong>How to use:</strong> Use the eye icon (👁) to hide
            the meaning. Try to remember before revealing. The struggle
            is the learning.
          </p>
        </section>

        <section>
          <h3>3. Picture Superiority Effect</h3>
          <p>
            The brain processes images 60,000x faster than text.
            Pairing a word with a visual image creates a dual-coded
            memory — verbal AND visual — making recall faster.
          </p>
          <p className="manual-tip">
            👉 <strong>How to use:</strong> Look carefully at each
            illustration. When you encounter the word later, the image
            will surface in your mind.
          </p>
        </section>

        <section>
          <h3>4. Sleep consolidates memory</h3>
          <p>
            Studies (Payne et al.) show that vocabulary learned before
            sleep is retained 20-35% better. Sleep allows the
            hippocampus to transfer short-term memories to long-term
            storage.
          </p>
          <p className="manual-tip">
            👉 <strong>How to use:</strong> Review the day's word in
            the evening, just before bed. Your brain will work on it
            while you sleep.
          </p>
        </section>

        <section>
          <h3>📅 Recommended daily routine</h3>
          <ul className="routine-list">
            <li><strong>Morning:</strong> Read today's word + tip. Use the "speak" button. Read the sentence aloud.</li>
            <li><strong>Midday:</strong> Quick check — can you recall the meaning? Mark "I know this" if yes.</li>
            <li><strong>Evening:</strong> Review yesterday's word + the Need Review list. Read example sentence aloud.</li>
            <li><strong>Before bed:</strong> One last glance at today's word. Sleep helps it stick.</li>
          </ul>
        </section>

        <section>
          <h3>🦄 Combine with Duolingo</h3>
          <p>
            This calendar complements Duolingo well. Duolingo is excellent
            for grammar drills and gamified practice. This calendar adds
            deep vocabulary with cultural context, IPA, and brain-science
            backing. Use both daily, ~10 min each.
          </p>
        </section>

        <section>
          <h3>⏰ Missed days?</h3>
          <p>
            Don't worry. When you return, the app shows what you missed.
            Use the calendar (left arrow ⬅) to flip back through skipped
            days. Quality &gt; perfect streak.
          </p>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: CatchUpBanner — shows when user has missed days
// ============================================================
function CatchUpBanner({ missedDays, onJump, onDismiss }) {
  if (missedDays === 0) return null;
  return (
    <div className="catchup-banner">
      <RefreshCw size={18} />
      <span>You missed {missedDays} day{missedDays > 1 ? 's' : ''}. </span>
      <button className="catchup-btn" onClick={onJump}>Catch up</button>
      <button className="catchup-dismiss" onClick={onDismiss}><X size={16} /></button>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  // ─── State ───────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(() => findTodayIndex());
  const [learned, setLearned] = useLocalStorage(STORAGE_KEYS.LEARNED, []);
  const [notYet, setNotYet] = useLocalStorage(STORAGE_KEYS.NOT_YET, []);
  const [bookmarked, setBookmarked] = useLocalStorage(STORAGE_KEYS.BOOKMARKED, []);
  const [dark, setDark] = useLocalStorage(STORAGE_KEYS.THEME, false);
  const [lastVisit, setLastVisit] = useLocalStorage(STORAGE_KEYS.LAST_VISIT, null);

  const [view, setView] = useState('main'); // 'main' | 'review' | 'manual' | 'index' | 'stats'
  const [menuOpen, setMenuOpen] = useState(false);
  const [tearing, setTearing] = useState(null); // 'left' | 'right' | null
  const [showCatchUp, setShowCatchUp] = useState(true);

  const dayEntry = wordData[currentIdx];

  // ─── Catch-up detection ───────────────────────────────────
  const missedDays = useMemo(() => {
    if (!lastVisit) return 0;
    const today = getTodayISO();
    const lastDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    return diff > 1 ? diff - 1 : 0;
  }, [lastVisit]);

  useEffect(() => {
    setLastVisit(getTodayISO());
  }, []);

  // ─── All words flat (for review list) ─────────────────────
  const allWords = useMemo(() => {
    return wordData.flatMap(d => d.words.map(w => ({
      ...w,
      day_date: d.date,
      day_theme: d.theme,
    })));
  }, []);

  // ─── Speech ───────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }, []);

  // ─── Navigation ───────────────────────────────────────────
  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setTearing('left');
      setTimeout(() => {
        setCurrentIdx(i => i - 1);
        setTearing(null);
      }, 250);
    }
  }, [currentIdx]);

  const goNext = useCallback(() => {
    if (currentIdx < wordData.length - 1) {
      setTearing('right');
      setTimeout(() => {
        setCurrentIdx(i => i + 1);
        setTearing(null);
      }, 250);
    }
  }, [currentIdx]);

  const goToday = useCallback(() => {
    // FIX: recompute today's index on click (not just mount)
    const todayIdx = findTodayIndex();
    setCurrentIdx(todayIdx);
    setView('main');
    setMenuOpen(false);
  }, []);

  // ─── Keyboard nav ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'main') return;
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === ' ') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, view]);

  // ─── Mark functions ───────────────────────────────────────
  const markLearned = useCallback((wordId) => {
    setLearned(prev => prev.includes(wordId) ? prev.filter(x => x !== wordId) : [...prev, wordId]);
    setNotYet(prev => prev.filter(x => x !== wordId)); // remove from not-yet
  }, [setLearned, setNotYet]);

  const markNotYet = useCallback((wordId) => {
    setNotYet(prev => prev.includes(wordId) ? prev.filter(x => x !== wordId) : [...prev, wordId]);
    setLearned(prev => prev.filter(x => x !== wordId)); // remove from learned
  }, [setLearned, setNotYet]);

  const toggleBookmark = useCallback((wordId) => {
    setBookmarked(prev => prev.includes(wordId) ? prev.filter(x => x !== wordId) : [...prev, wordId]);
  }, [setBookmarked]);

  // ─── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => ({
    learned: learned.length,
    notYet: notYet.length,
    bookmarked: bookmarked.length,
    total: allWords.length,
    progress: Math.round((learned.length / allWords.length) * 100),
  }), [learned, notYet, bookmarked, allWords]);

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className={`app-root ${dark ? 'dark' : ''}`}>
      <style>{styles}</style>

      {/* ─── Top Bar ─── */}
      <div className="topbar">
        <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <Menu size={22} />
        </button>
        <div className="app-title">
          <BookOpen size={20} />
          <span>Russian Daily</span>
        </div>
        <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Theme">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* ─── Side Menu ─── */}
      {menuOpen && (
        <div className="side-menu" onClick={() => setMenuOpen(false)}>
          <nav className="menu-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { goToday(); }}>
              <HomeIcon size={18} /> Today
            </button>
            <button onClick={() => { setView('review'); setMenuOpen(false); }}>
              <AlertCircle size={18} /> Need Review
              {notYet.length > 0 && <span className="badge">{notYet.length}</span>}
            </button>
            <button onClick={() => { setView('manual'); setMenuOpen(false); }}>
              <Brain size={18} /> How Your Brain Learns
            </button>
            <button onClick={() => { setView('stats'); setMenuOpen(false); }}>
              <TrendingUp size={18} /> Progress
            </button>
            <button onClick={() => { setView('index'); setMenuOpen(false); }}>
              <Search size={18} /> Browse All Words
            </button>
          </nav>
        </div>
      )}

      {/* ─── Catch-up banner ─── */}
      {view === 'main' && showCatchUp && missedDays > 0 && (
        <CatchUpBanner
          missedDays={missedDays}
          onJump={() => {
            const lastIdx = wordData.findIndex(d => d.date === lastVisit);
            if (lastIdx >= 0 && lastIdx + 1 < wordData.length) {
              setCurrentIdx(lastIdx + 1);
            }
            setShowCatchUp(false);
          }}
          onDismiss={() => setShowCatchUp(false)}
        />
      )}

      {/* ─── Main view ─── */}
      {view === 'main' && (
        <div className="card-area">
          <button
            className="nav-arrow nav-left"
            onClick={goPrev}
            disabled={currentIdx === 0}
            aria-label="Previous day"
          >
            <ChevronLeft size={28} />
          </button>

          <div className={`card-wrap ${tearing ? `tearing-${tearing}` : ''}`}>
            <DayCard
              dayEntry={dayEntry}
              onSpeak={speak}
              learned={learned}
              notYet={notYet}
              bookmarked={bookmarked}
              onMarkLearned={markLearned}
              onMarkNotYet={markNotYet}
              onToggleBookmark={toggleBookmark}
              dark={dark}
            />
          </div>

          <button
            className="nav-arrow nav-right"
            onClick={goNext}
            disabled={currentIdx === wordData.length - 1}
            aria-label="Next day"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* ─── Review view ─── */}
      {view === 'review' && (
        <ReviewList
          notYet={notYet}
          allWords={allWords}
          onClose={() => setView('main')}
          onSpeak={speak}
          onMarkLearned={markLearned}
          dark={dark}
        />
      )}

      {/* ─── Manual view ─── */}
      {view === 'manual' && (
        <BrainManual
          onClose={() => setView('main')}
          dark={dark}
        />
      )}

      {/* ─── Stats view ─── */}
      {view === 'stats' && (
        <div className={`view-overlay ${dark ? 'dark' : ''}`}>
          <div className="view-header">
            <h2><TrendingUp size={22} /> Your Progress</h2>
            <button className="close-btn" onClick={() => setView('main')}><X size={22} /></button>
          </div>
          <div className="stats-content">
            <div className="stat-big-card">
              <div className="stat-num">{stats.learned}</div>
              <div className="stat-lbl">Words Learned</div>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{width: `${stats.progress}%`}}></div>
              <span className="stat-bar-text">{stats.progress}% complete ({stats.learned} / {stats.total})</span>
            </div>
            <div className="stat-mini-grid">
              <div><div className="mini-num">{stats.notYet}</div><div className="mini-lbl">To Review</div></div>
              <div><div className="mini-num">{stats.bookmarked}</div><div className="mini-lbl">Bookmarked</div></div>
              <div><div className="mini-num">{currentIdx + 1}</div><div className="mini-lbl">Day Number</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Index view ─── */}
      {view === 'index' && (
        <div className={`view-overlay ${dark ? 'dark' : ''}`}>
          <div className="view-header">
            <h2><Search size={22} /> All Words</h2>
            <button className="close-btn" onClick={() => setView('main')}><X size={22} /></button>
          </div>
          <div className="index-list">
            {wordData.map((d, idx) => (
              <div key={d.id} className="index-day" onClick={() => { setCurrentIdx(idx); setView('main'); }}>
                <div className="index-date">{d.date}</div>
                <div className="index-theme">{d.theme}</div>
                <div className="index-words">
                  {d.words.map(w => w.word).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Footer date strip ─── */}
      {view === 'main' && (
        <div className="footer-strip">
          <span>Day {currentIdx + 1} of {wordData.length}</span>
          <button className="today-btn" onClick={goToday}>
            <Calendar size={14} /> Today
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STYLES (inline CSS)
// ============================================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.app-root {
  font-family: 'Inter', -apple-system, sans-serif;
  background: #f5efe3;
  min-height: 100vh;
  color: #2c1810;
  position: relative;
}
.app-root.dark {
  background: #1a1612;
  color: #e8dcc6;
}

/* ─── Topbar ─── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  background: rgba(245, 239, 227, 0.95);
  border-bottom: 1px solid #d4c4a8;
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: blur(8px);
}
.dark .topbar {
  background: rgba(26, 22, 18, 0.95);
  border-bottom-color: #3a2f24;
}
.app-title {
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 16px;
}
.icon-btn {
  background: none; border: none; padding: 8px; cursor: pointer;
  color: inherit; border-radius: 6px; display: flex; align-items: center;
}
.icon-btn:hover { background: rgba(139, 38, 38, 0.08); }

/* ─── Side menu ─── */
.side-menu {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  z-index: 200; animation: fadeIn 0.15s ease;
}
.menu-content {
  background: #f5efe3; width: 280px; height: 100%; padding: 60px 0 20px;
  display: flex; flex-direction: column; gap: 4px;
  box-shadow: 4px 0 24px rgba(0,0,0,0.2);
  animation: slideRight 0.2s ease;
}
.dark .menu-content { background: #1a1612; }
.menu-content button {
  background: none; border: none; padding: 14px 24px; text-align: left;
  font-size: 15px; cursor: pointer; color: inherit;
  display: flex; align-items: center; gap: 12px;
  position: relative;
}
.menu-content button:hover { background: rgba(139, 38, 38, 0.08); }
.menu-content .badge {
  position: absolute; right: 24px; background: #8b2626; color: white;
  font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }

/* ─── Catch-up banner ─── */
.catchup-banner {
  display: flex; align-items: center; gap: 10px;
  background: #fff4d6; padding: 10px 16px; margin: 12px 16px;
  border-radius: 8px; border-left: 4px solid #c9a45a;
  font-size: 14px;
}
.dark .catchup-banner {
  background: #3a2f1a; border-left-color: #c9a45a;
}
.catchup-btn {
  margin-left: auto; background: #8b2626; color: white;
  border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;
  font-size: 13px; font-weight: 600;
}
.catchup-dismiss {
  background: none; border: none; color: inherit; cursor: pointer; padding: 4px;
  display: flex; align-items: center;
}

/* ─── Main card area ─── */
.card-area {
  display: flex; align-items: stretch; justify-content: center;
  padding: 24px 16px; max-width: 900px; margin: 0 auto;
  gap: 12px;
}
.card-wrap {
  flex: 1; min-width: 0;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.card-wrap.tearing-left {
  transform: translateX(-30px) rotate(-2deg); opacity: 0.4;
}
.card-wrap.tearing-right {
  transform: translateX(30px) rotate(2deg); opacity: 0.4;
}
.nav-arrow {
  background: rgba(139, 38, 38, 0.08); border: none; color: #8b2626;
  cursor: pointer; padding: 12px; border-radius: 50%;
  display: flex; align-items: center;
  align-self: center;
  transition: background 0.15s;
}
.nav-arrow:hover:not(:disabled) { background: rgba(139, 38, 38, 0.18); }
.nav-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
.dark .nav-arrow { color: #d4a574; background: rgba(212, 165, 116, 0.1); }

/* ─── Day Card ─── */
.day-card-outer {
  background: #faf6ee;
  border: 1px solid #d4c4a8;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(60, 30, 10, 0.08);
  position: relative;
}
.dark .day-card-outer {
  background: #25201b;
  border-color: #3a2f24;
}

/* ─── Header ─── */
.card-header {
  display: flex; gap: 16px; align-items: flex-start;
  border-bottom: 1px dashed #d4c4a8; padding-bottom: 14px; margin-bottom: 16px;
}
.dark .card-header { border-bottom-color: #3a2f24; }
.date-stack {
  flex-shrink: 0; text-align: center; padding: 4px 14px;
  border-right: 1px dashed #d4c4a8;
}
.dark .date-stack { border-right-color: #3a2f24; }
.day-number {
  font-family: 'Old Standard TT', serif; font-size: 44px; font-weight: 700;
  color: #8b2626; line-height: 1;
}
.dark .day-number { color: #d4a574; }
.month-name {
  font-size: 12px; text-transform: uppercase; letter-spacing: 1px;
  font-weight: 600; margin-top: 2px;
}
.day-of-week {
  font-size: 11px; color: #6b5848; margin-top: 4px;
}
.day-of-week.sunday {
  color: #8b2626; font-weight: 600;
}
.dark .day-of-week { color: #a89684; }
.theme-stack { flex: 1; padding-top: 4px; }
.cefr-badge {
  display: inline-block; background: #8b2626; color: white;
  padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 700;
}
.theme-name {
  font-family: 'Old Standard TT', serif;
  font-size: 22px; font-weight: 700; margin: 6px 0 4px;
  color: #3c1e0a;
}
.dark .theme-name { color: #e8dcc6; }
.category-name {
  font-size: 12px; color: #6b5848; font-style: italic;
}
.dark .category-name { color: #a89684; }

/* ─── Word tabs ─── */
.word-tabs {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;
}
.word-tab {
  background: rgba(139, 38, 38, 0.08); color: #8b2626;
  border: 1px solid transparent;
  padding: 6px 12px; border-radius: 16px; font-size: 13px;
  cursor: pointer; font-weight: 500;
  transition: all 0.15s;
}
.word-tab:hover { background: rgba(139, 38, 38, 0.15); }
.word-tab.active {
  background: #8b2626; color: white; border-color: #8b2626;
}
.word-tab.tab-learned::after {
  content: ' ✓'; opacity: 0.7;
}
.dark .word-tab { background: rgba(212, 165, 116, 0.15); color: #d4a574; }
.dark .word-tab.active { background: #d4a574; color: #25201b; }

/* ─── Word card inner ─── */
.word-card-inner { padding: 4px 0; }
.word-image-area {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(139, 38, 38, 0.05);
  border-radius: 8px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.dark .word-image-area { background: rgba(212, 165, 116, 0.08); }
.word-image { width: 100%; height: 100%; object-fit: cover; }
.word-image-placeholder {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #8b2626; opacity: 0.5;
}
.dark .word-image-placeholder { color: #d4a574; }
.placeholder-text {
  font-family: 'Old Standard TT', serif; font-size: 18px; font-style: italic;
}

.word-main {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-bottom: 6px;
}
.russian-word {
  font-family: 'Old Standard TT', serif;
  font-size: 48px; font-weight: 700; margin: 0;
  color: #3c1e0a; line-height: 1.1;
}
.dark .russian-word { color: #f4e4c1; }
.speak-btn {
  background: #8b2626; color: white; border: none;
  width: 42px; height: 42px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform 0.15s;
}
.speak-btn:hover { transform: scale(1.1); }
.dark .speak-btn { background: #d4a574; color: #25201b; }

.pronunciation-row {
  display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap;
  margin-bottom: 14px;
}
.pron {
  font-size: 15px; color: #6b5848; font-style: italic;
}
.ipa {
  font-size: 13px; color: #8b6b48; font-family: monospace;
}
.dark .pron { color: #c4b29a; }
.dark .ipa { color: #d4a574; }

.meaning-section {
  background: rgba(139, 38, 38, 0.05);
  border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;
}
.dark .meaning-section { background: rgba(212, 165, 116, 0.08); }
.meaning-row { display: flex; align-items: flex-start; gap: 8px; }
.meaning {
  flex: 1; font-size: 20px; font-weight: 600; margin: 0; color: #3c1e0a;
}
.dark .meaning { color: #f4e4c1; }
.hide-btn {
  background: none; border: none; padding: 4px; cursor: pointer;
  color: #8b6b48; opacity: 0.6; display: flex; align-items: center;
}
.hide-btn:hover { opacity: 1; }
.part-of-speech {
  font-size: 12px; color: #8b6b48; margin: 4px 0 0;
  text-transform: lowercase; font-style: italic;
}
.reveal-btn {
  background: rgba(139, 38, 38, 0.1); border: 1px dashed #8b2626;
  color: #8b2626; padding: 12px 16px; border-radius: 6px;
  width: 100%; cursor: pointer; font-size: 14px; font-weight: 500;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.dark .reveal-btn {
  border-color: #d4a574; color: #d4a574; background: rgba(212, 165, 116, 0.1);
}

.example-section {
  border-left: 3px solid #c9a45a; padding-left: 12px; margin-bottom: 12px;
}
.sentence-ru {
  font-family: 'Old Standard TT', serif;
  font-size: 18px; margin: 0 0 4px; font-style: italic;
  display: flex; align-items: center; gap: 8px;
}
.mini-speak {
  background: none; border: 1px solid #c9a45a; color: #8b6b48;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
}
.mini-speak:hover { background: rgba(201, 164, 90, 0.15); }
.sentence-en {
  font-size: 13px; color: #6b5848; margin: 0;
}
.dark .sentence-en { color: #c4b29a; }

.notes-section {
  background: rgba(201, 164, 90, 0.1);
  border-radius: 6px; padding: 10px 12px;
  font-size: 13px; margin-bottom: 14px;
  color: #6b5848;
}
.dark .notes-section { background: rgba(201, 164, 90, 0.15); color: #c4b29a; }

/* ─── Recall buttons (BIG, PROMINENT) ─── */
.recall-buttons {
  display: flex; gap: 8px; margin: 16px 0 12px;
}
.recall-btn {
  flex: 1; padding: 14px 12px; border: 2px solid;
  background: white; border-radius: 8px; cursor: pointer;
  font-size: 14px; font-weight: 600;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.dark .recall-btn { background: #2a241e; }
.recall-btn.learned {
  border-color: #4a7c4a; color: #4a7c4a;
}
.recall-btn.learned:hover, .recall-btn.learned.active {
  background: #4a7c4a; color: white;
}
.recall-btn.notyet {
  border-color: #c9a45a; color: #a07a30;
}
.recall-btn.notyet:hover, .recall-btn.notyet.active {
  background: #c9a45a; color: white;
}

.bookmark-row { display: flex; }
.bookmark-btn {
  background: none; border: 1px solid #c9a45a; color: #8b6b48;
  padding: 6px 12px; border-radius: 16px; cursor: pointer; font-size: 13px;
  display: flex; align-items: center; gap: 6px;
  margin-left: auto;
}
.bookmark-btn.active { background: #c9a45a; color: white; }

/* ─── Tip section (LARGER text per request) ─── */
.tip-section {
  background: linear-gradient(135deg, rgba(201, 164, 90, 0.1), rgba(139, 38, 38, 0.05));
  border-radius: 8px; padding: 14px 16px; margin-top: 16px;
  border-left: 4px solid #c9a45a;
}
.tip-header {
  display: flex; align-items: center; gap: 6px; font-size: 13px;
  font-weight: 700; color: #8b6b48; text-transform: uppercase;
  letter-spacing: 1px; margin-bottom: 8px;
}
.dark .tip-header { color: #c9a45a; }
.tip-text {
  font-size: 16px;     /* LARGER per request */
  line-height: 1.6;
  margin: 0;
  color: #3c1e0a;
}
.dark .tip-text { color: #e8dcc6; }

/* ─── Footer ─── */
.footer-strip {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 24px; max-width: 900px; margin: 0 auto;
  font-size: 13px; color: #6b5848;
}
.dark .footer-strip { color: #a89684; }
.today-btn {
  background: #8b2626; color: white; border: none;
  padding: 6px 14px; border-radius: 16px; cursor: pointer;
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center; gap: 6px;
}
.dark .today-btn { background: #d4a574; color: #25201b; }

/* ─── Overlay views ─── */
.view-overlay {
  position: fixed; inset: 0; background: #f5efe3;
  z-index: 150; overflow-y: auto; padding: 0 0 40px;
}
.view-overlay.dark { background: #1a1612; color: #e8dcc6; }
.view-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid #d4c4a8;
  background: inherit; position: sticky; top: 0; z-index: 5;
}
.dark .view-header { border-bottom-color: #3a2f24; }
.view-header h2 {
  margin: 0; font-size: 20px; font-family: 'Old Standard TT', serif;
  display: flex; align-items: center; gap: 10px;
}
.close-btn {
  background: none; border: none; padding: 6px; cursor: pointer;
  color: inherit; border-radius: 6px;
  display: flex; align-items: center;
}
.close-btn:hover { background: rgba(139, 38, 38, 0.1); }

/* ─── Review list ─── */
.review-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px; padding: 20px;
}
.review-item {
  background: #faf6ee; border: 1px solid #d4c4a8;
  border-radius: 8px; padding: 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.dark .review-item { background: #25201b; border-color: #3a2f24; }
.review-word-row { display: flex; align-items: center; gap: 8px; }
.review-ru {
  font-family: 'Old Standard TT', serif; font-size: 22px;
  font-weight: 700; color: #8b2626;
}
.dark .review-ru { color: #d4a574; }
.review-en { font-size: 14px; font-weight: 500; }
.review-pron { font-size: 12px; color: #8b6b48; font-style: italic; }
.review-mark-learned {
  margin-top: 6px;
  background: rgba(74, 124, 74, 0.1); border: 1px solid #4a7c4a;
  color: #4a7c4a; padding: 6px 10px; border-radius: 4px;
  cursor: pointer; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; gap: 6px; justify-content: center;
}
.review-mark-learned:hover { background: #4a7c4a; color: white; }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 60px 20px; gap: 12px; color: #6b5848;
}
.empty-state .sub { font-size: 13px; opacity: 0.7; }

/* ─── Manual ─── */
.manual-content {
  max-width: 720px; margin: 0 auto; padding: 24px;
}
.manual-content section {
  margin-bottom: 28px; padding-bottom: 20px;
  border-bottom: 1px dashed #d4c4a8;
}
.dark .manual-content section { border-bottom-color: #3a2f24; }
.manual-content section:last-child { border-bottom: none; }
.manual-content h3 {
  font-family: 'Old Standard TT', serif; font-size: 20px;
  color: #8b2626; margin: 0 0 10px;
}
.dark .manual-content h3 { color: #d4a574; }
.manual-content p {
  font-size: 15px; line-height: 1.7; margin: 0 0 10px;
}
.manual-tip {
  background: rgba(201, 164, 90, 0.1);
  border-left: 3px solid #c9a45a;
  padding: 10px 14px; border-radius: 4px;
  font-size: 14px !important;
}
.routine-list { font-size: 15px; line-height: 1.9; padding-left: 20px; }

/* ─── Stats ─── */
.stats-content {
  max-width: 600px; margin: 0 auto; padding: 24px;
  display: flex; flex-direction: column; gap: 20px;
}
.stat-big-card {
  background: linear-gradient(135deg, #8b2626, #6b1818);
  color: white; padding: 32px; border-radius: 12px;
  text-align: center;
}
.dark .stat-big-card { background: linear-gradient(135deg, #d4a574, #b08654); color: #25201b; }
.stat-num { font-size: 48px; font-weight: 700; font-family: 'Old Standard TT', serif; }
.stat-lbl { font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 2px; }
.stat-bar {
  background: #d4c4a8; height: 24px; border-radius: 12px;
  position: relative; overflow: hidden;
}
.dark .stat-bar { background: #3a2f24; }
.stat-bar-fill {
  background: #4a7c4a; height: 100%; transition: width 0.3s;
}
.stat-bar-text {
  position: absolute; inset: 0; display: flex; align-items: center;
  justify-content: center; font-size: 13px; font-weight: 600; color: #2c1810;
}
.dark .stat-bar-text { color: #e8dcc6; }
.stat-mini-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.stat-mini-grid > div {
  background: #faf6ee; padding: 16px; border-radius: 8px;
  text-align: center; border: 1px solid #d4c4a8;
}
.dark .stat-mini-grid > div { background: #25201b; border-color: #3a2f24; }
.mini-num { font-size: 28px; font-weight: 700; color: #8b2626; }
.dark .mini-num { color: #d4a574; }
.mini-lbl { font-size: 12px; color: #6b5848; }

/* ─── Index ─── */
.index-list {
  max-width: 700px; margin: 0 auto; padding: 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.index-day {
  background: #faf6ee; border: 1px solid #d4c4a8;
  border-radius: 6px; padding: 10px 14px; cursor: pointer;
  display: grid; grid-template-columns: 100px 1fr 2fr; gap: 12px;
  align-items: center; font-size: 13px;
}
.dark .index-day { background: #25201b; border-color: #3a2f24; }
.index-day:hover { background: rgba(139, 38, 38, 0.05); }
.index-date { font-family: monospace; color: #8b6b48; }
.index-theme { font-weight: 600; }
.index-words { color: #6b5848; font-style: italic; }
.dark .index-words { color: #a89684; }

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .card-area { padding: 12px 8px; gap: 6px; }
  .nav-arrow { padding: 8px; }
  .day-card-outer { padding: 14px; }
  .russian-word { font-size: 38px; }
  .meaning { font-size: 17px; }
  .tip-text { font-size: 15px; }
  .index-day { grid-template-columns: 80px 1fr; }
  .index-words { grid-column: 1 / -1; padding-top: 4px; }
  .stat-mini-grid { grid-template-columns: 1fr; }
}
`;
