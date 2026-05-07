const composition = [
  3, 7, 9, 11, 13, 14,
  22, 24, 25, 27, 54, 56,
  59, 61, 64, 66, 71, 72,
  75, 76, 77, 78, 89, 99,
  102, 105, 106, 37, 38, 39,
  40, 41, 43,
];

const couleur = [
  2, 6, 10, 28, 69, 79,
  80, 81, 82, 95, 104, 1,
  30, 108, 8, 15, 23, 26,
  29, 57, 58, 63, 74, 83,
  85, 86, 87, 103, 45,
];

const texture = [
  4, 5, 12, 16, 17, 18,
  19, 20, 21, 49, 50, 51,
  52, 53, 62, 65, 84, 88,
  107, 111, 36, 42, 44, 46,
  47,
];

const typographie = [
  31, 32, 33, 35, 48, 68,
  70, 90, 92, 96, 97, 98,
  100, 101, 55, 109, 110, 112,
  60, 67, 73, 91, 93, 94,
  34,
];

const categoryMap = {
  composition,
  couleur,
  texture,
  typographie,
};

function formatImageNumber(number) {
  return String(number).padStart(2, '0');
}

export const archiveImages = Object.entries(categoryMap).flatMap(
  ([category, imageNumbers]) =>
    imageNumbers.map((number) => ({
      id: number,
      src: `/photos/item-${String(number).padStart(2, '0')}.png`,
      categories: [category],
    }))
);