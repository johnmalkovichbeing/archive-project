import { motion } from 'framer-motion';
import { CATEGORY_META } from '../data/images';

function frameAccent(image) {
  const firstCategory = image.categories[0];
  return CATEGORY_META[firstCategory]?.color || '#e8c4a0';
}

export default function FilmStrip({ images, isVisible, onFrameClick, activeFilmRoll }) {
  if (!isVisible) {
    return (
      <div className="film-zone-empty">
        <span>Sélectionner une bobine pour dérouler le film</span>
      </div>
    );
  }

  return (
    <motion.div
      key={activeFilmRoll}
      className="film-strip"
      initial={{ x: -360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -240, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Bande de film déroulée"
    >
      <div className="film-frames">
        {images.slice(0, 8).map((image) => (
          <motion.button
            type="button"
            className="film-frameButton"
            key={image.id}
            onClick={() => onFrameClick(image)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{ '--frame-accent': frameAccent(image) }}
            aria-label={`Ajouter l'image ${image.id} au plateau lumineux`}
          >
            <span
              className="film-frameImage"
              style={{ backgroundColor: image.color }}
            >
              {image.src ? (
                <img src={image.src} alt={`Archive ${image.id}`} />
              ) : (
                <span>{String(image.id).padStart(2, '0')}</span>
              )}
            </span>
            <span className="film-frameLabel">
              {image.date} · {image.source}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
