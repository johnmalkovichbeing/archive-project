import { useState, useEffect } from 'react';  // useEffect 추가
import { AnimatePresence } from 'framer-motion';
import { images } from './data/images';
import EntryView from './components/EntryView';
import TopView from './components/TopView';
import './styles/entry.css';
import './styles/topview.css';
import './styles/film.css';
import './styles/poster.css';

function makeLightboxPosition(index) {
  const positions = [
    { x: 12, y: 14 },
    { x: 45, y: 19 },
    { x: 24, y: 48 },
    { x: 62, y: 46 },
    { x: 39, y: 66 },
  ];
  return positions[index % positions.length];
}

export default function App() {
  const [phase, setPhase] = useState('entry');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilmRoll, setActiveFilmRoll] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPoster, setShowPoster] = useState(false);

  // ↓ 여기 추가
  useEffect(() => {
  function scaleToFit() {
  const scaleX = window.innerWidth / 1440;
  const scaleY = window.innerHeight / 900;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--app-scale', scale);
}
    scaleToFit();
    window.addEventListener('resize', scaleToFit);
    return () => window.removeEventListener('resize', scaleToFit);
  }, []);
  // ↑ 여기까지

  function handleEnterArchive() { setPhase('topview'); }
  function handleBackToEntry() {
    setShowPoster(false);
    setActiveFilmRoll(null);
    setSelectedCategory(null);
    setSelectedImages([]);
    setPhase('entry');
  }
  function handleCategoryChange(category) {
    setSelectedCategory(category);
    if (category === null) return;
    if (activeFilmRoll && activeFilmRoll !== category) setActiveFilmRoll(category);
  }
  function handleFrameClick(image) {
    setSelectedImages((current) => {
      if (current.length >= 5 || current.some((item) => item.id === image.id)) return current;
      return [...current, { ...image, lightboxPosition: makeLightboxPosition(current.length) }];
    });
  }

  return (
    <main className="app-shell" aria-label="L'archive comme outil de production">
      <AnimatePresence mode="wait">
        {phase === 'entry' ? (
          <EntryView key="entry" onEnter={handleEnterArchive} />
        ) : (
          <TopView
            key="topview"
            images={images}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            activeFilmRoll={activeFilmRoll}
            setActiveFilmRoll={setActiveFilmRoll}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            onFrameClick={handleFrameClick}
            showPoster={showPoster}
            setShowPoster={setShowPoster}
            onBack={handleBackToEntry}
          />
        )}
      </AnimatePresence>
    </main>
  );
}