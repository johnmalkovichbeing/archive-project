import { motion } from 'framer-motion';
import { CATEGORY_KEYS, CATEGORY_META } from '../data/images';

function getDateRange(images) {
  const dates = images.map((image) => image.date).sort();
  if (!dates.length) return '—';
  if (dates[0] === dates[dates.length - 1]) return dates[0];
  return `${dates[0]} — ${dates[dates.length - 1]}`;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const value = parseInt(clean, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function saturation(hex) {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === min) return 0;
  const lightness = (max + min) / 2;
  return lightness > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}

function getPalette(images) {
  const colors = images.map((image) => image.color);
  const fallback = ['#6f5d52', '#b78a65', '#7f8576', '#5f6b7d', '#d2a47d'];
  return [...colors, ...fallback].slice(0, 5);
}

function getPosterMode(images) {
  const counts = CATEGORY_KEYS.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  images.forEach((image) => {
    image.categories.forEach((category) => {
      counts[category] += 1;
    });
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topCategory, topCount] = sorted[0];
  const secondCount = sorted[1]?.[1] || 0;

  if (topCategory === 'composition') return 'composition';
  if (topCount === secondCount) return 'composition';
  if (topCount > images.length / 2) return topCategory;

  return 'composition';
}

function PosterInner({ mode, images, palette }) {
  const saturatedColor = [...palette].sort((a, b) => saturation(b) - saturation(a))[0];

  if (mode === 'typo') {
    return (
      <div className="poster-inner poster-typo" style={{ '--poster-accent': palette[0] }}>
        <span className="typo-word typo-word-one">COLLECTER</span>
        <span className="typo-word typo-word-two">CLASSER</span>
        <span className="typo-word typo-word-three">ACTIVER</span>
        <span className="typo-word typo-word-four">ARCHIVER</span>
        <span className="typo-gridline" />
      </div>
    );
  }

  if (mode === 'couleur') {
    return (
      <div className="poster-inner poster-couleur">
        {palette.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className={`colour-block colour-block-${index + 1}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  }

  if (mode === 'texture') {
    return (
      <div className="poster-inner poster-texture" style={{ '--texture-base': saturatedColor }}>
        <span className="texture-layer texture-layer-one" />
        <span className="texture-layer texture-layer-two" />
        <span className="texture-layer texture-layer-three" />
        <span className="texture-label">surface / trace / mémoire</span>
      </div>
    );
  }

  return (
    <div className="poster-inner poster-composition">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`poster-gridItem poster-gridItem-${index + 1}`}
          style={{ backgroundColor: image.color }}
        >
          {image.src ? (
            <img src={image.src} alt={`Archive sélectionnée ${image.id}`} />
          ) : (
            <span>{String(image.id).padStart(2, '0')}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Poster({ selectedImages, onDismiss }) {
  const palette = getPalette(selectedImages);
  const mode = getPosterMode(selectedImages);
  const dominantLabel =
    mode === 'composition' && selectedImages.length > 1
      ? 'Composition mixte'
      : CATEGORY_META[mode]?.label || 'Composition';

  return (
    <motion.div
      className="poster-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Poster généré"
    >
      <motion.article
        className="poster-mount"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <PosterInner mode={mode} images={selectedImages} palette={palette} />

        <footer className="poster-caption">
          <span>{dominantLabel}</span>
          <span>{getDateRange(selectedImages)}</span>
          <span>Im Eunsu / 2025</span>
        </footer>
      </motion.article>
    </motion.div>
  );
}
