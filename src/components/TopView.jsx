import { useMemo, useState } from 'react';

const CATEGORIES = [
  {
    id: 'typographie',
    label: 'Typographie / densité textuelle',
    src: '/index/index-typographie.png',
  },
  {
    id: 'couleur',
    label: 'Couleur / température',
    src: '/index/index-couleur.png',
  },
  {
    id: 'texture',
    label: 'Texture / matière',
    src: '/index/index-texture.png',
  },
  {
    id: 'composition',
    label: 'Composition / espace blanc',
    src: '/index/index-composition.png',
  },
];

const composition = [
  1, 2, 3, 6, 7, 9,
  11, 13, 14, 18, 19, 20, 21, 22, 23, 24,
  26, 25, 27, 29, 54, 56,
  59, 61, 64, 66, 71, 72,
  75, 76, 77, 78, 79, 80,
  81, 82, 86, 87, 89, 99,
  102, 104, 105, 106, 108, 37,
  38, 39, 40, 41, 43,
];

const couleur = [
  2, 6, 7, 10, 22, 27,
  28, 69, 79, 80, 81, 82,
  95, 104, 1, 30, 108, 8,
  15, 23, 26, 29, 31, 34,
  35, 56, 57, 58, 63, 74,
  83, 85, 86, 87, 90, 103,
  45,
];

const texture = [
  1, 2, 4, 5, 6, 7,
  8, 10, 12, 13, 15, 16,
  17,
  28, 48, 49, 50, 51,
  52, 53, 62, 65, 63, 
  79, 80, 81, 82, 83, 84, 
  85, 86, 87, 88, 95, 96, 
  98, 100, 101, 107, 108, 109, 
  110, 111, 112, 36, 42, 44, 
  46, 47,
];

const typographie = [
  3, 7, 9, 11, 24, 25, 26,
  27, 29, 31, 32, 33, 35,
  48, 54, 56, 61, 66, 68,
  70, 75, 89, 90, 92, 96,
  97, 98, 100, 101, 103, 55, 104,
  109, 110, 112, 60, 67, 73,
  91, 93, 94, 34,
];

const categoryMap = {
  typographie,
  couleur,
  texture,
  composition,
};

const IMAGES_PER_SPREAD = 18;

function formatImageNumber(number) {
  return String(number).padStart(2, '0');
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createArchiveImages() {
  const imageMap = new Map();

  Object.entries(categoryMap).forEach(([category, imageNumbers]) => {
    imageNumbers.forEach((number) => {
      if (!imageMap.has(number)) {
        imageMap.set(number, {
          id: number,
          src: `/photos/item-${formatImageNumber(number)}.png`,
          categories: [],
        });
      }

      imageMap.get(number).categories.push(category);
    });
  });

  return Array.from(imageMap.values());
}

const archiveImages = createArchiveImages();

export default function TopView() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [drawnImages, setDrawnImages] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const filteredImages = useMemo(() => {
    const images =
      activeCategory === 'all'
        ? archiveImages
        : archiveImages.filter((image) =>
            image.categories.includes(activeCategory)
          );

    return shuffleArray(images);
  }, [activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredImages.length / IMAGES_PER_SPREAD)
  );

  const currentImages = useMemo(() => {
    const start = pageIndex * IMAGES_PER_SPREAD;
    const images = filteredImages.slice(start, start + IMAGES_PER_SPREAD);

    while (images.length < IMAGES_PER_SPREAD) {
      images.push(null);
    }

    return images;
  }, [filteredImages, pageIndex]);

  const leftImages = currentImages.slice(0, 9);
  const rightImages = currentImages.slice(9, 18);

  function handleCategoryClick(categoryId) {
    setActiveCategory(categoryId);
    setPageIndex(0);
  }

  function goPrev() {
    setPageIndex((current) => {
      if (current === 0) return totalPages - 1;
      return current - 1;
    });
  }

  function goNext() {
    setPageIndex((current) => {
      if (current === totalPages - 1) return 0;
      return current + 1;
    });
  }

  function handleRandomDraw() {
  const categories = ['typographie', 'couleur', 'texture', 'composition'];
  const usedCategories = new Set();

  const picked = categories.map((cat) => {
    const pool = archiveImages.filter((img) => img.categories.includes(cat));
    const image = pool[Math.floor(Math.random() * pool.length)];

    const availableCategory = image.categories.find(c => !usedCategories.has(c)) || cat;
    usedCategories.add(availableCategory);

    return { ...image, displayCategory: availableCategory };
  });

  setDrawnImages(picked);
}

  return (
    <section className="top-view">
      <button
        className="page-arrow page-arrow-left"
        type="button"
        onClick={goPrev}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="vinyl-binder">
        <img src="/dossier1.png" alt="" className="dossier-bg" />
        <img src="/vinyl-overlay.png" alt="" className="vinyl-overlay" />

        <div className="index-tabs">
          <button
            type="button"
            className={`index-tab index-tab-all ${
              activeCategory === 'all' ? 'is-active' : ''
            }`}
            onClick={() => handleCategoryClick('all')}
            aria-label="All"
          >
            <img src="/index/index-all.png" alt="" />
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`index-tab index-tab-${category.id} ${
                activeCategory === category.id ? 'is-active' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
              aria-label={category.label}
            >
              <img src={category.src} alt="" />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="card-stack-btn"
          onClick={handleRandomDraw}
          aria-label="Tirage aléatoire"
        >
          <img src="/card-stack.png" alt="tirage aléatoire" />
        </button>

        <div className="pocket-page pocket-page-left">
          {leftImages.map((image, index) => (
            <div
              className="pocket-cell"
              key={`left-${pageIndex}-${index}`}
              onClick={() => image && setZoomedImage(image)}
              style={{ cursor: image ? 'pointer' : 'default' }}
            >
              {image && (
                <img
                  src={image.src}
                  alt={`archive item ${image.id}`}
                  className={`pocket-photo pocket-photo-${index + 1}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="pocket-page pocket-page-right">
          {rightImages.map((image, index) => (
            <div
              className="pocket-cell"
              key={`right-${pageIndex}-${index}`}
              onClick={() => image && setZoomedImage(image)}
              style={{ cursor: image ? 'pointer' : 'default' }}
            >
              {image && (
                <img
                  src={image.src}
                  alt={`archive item ${image.id}`}
                  className={`pocket-photo pocket-photo-${index + 10}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        className="page-arrow page-arrow-right"
        type="button"
        onClick={goNext}
        aria-label="Next page"
      >
        ›
      </button>

      {drawnImages && (
        <div className="random-overlay" onClick={() => setDrawnImages(null)}>
          <div className="random-overlay-bg" />
          <div
            className="random-cards-row"
            onClick={(e) => e.stopPropagation()}
          >
            {drawnImages.map((image) => (
              <div key={image.id} className="random-card-item">
                <span className="random-card-category">
                  {image.displayCategory}
                </span>
                <img src={image.src} alt={`item ${image.id}`} />
              </div>
            ))}
            <button
              className="random-close-btn"
              onClick={() => setDrawnImages(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div className="zoom-overlay" onClick={() => setZoomedImage(null)}>
          <div className="zoom-overlay-bg" />
          <div
            className="zoom-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={zoomedImage.src} alt={`item ${zoomedImage.id}`} />
            <span className="zoom-categories">
              {zoomedImage.categories.join(' / ')}
            </span>
            <button
              className="zoom-close-btn"
              onClick={() => setZoomedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}