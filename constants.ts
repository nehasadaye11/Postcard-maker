
export const COLORS = {
  sage: '#A8B5A2',
  beige: '#F5EBE0',
  lavender: '#D5B9B2',
  terracotta: '#E29578',
  mustard: '#E9C46A',
  teal: '#81B29A',
  cream: '#F4F1DE',
  charcoal: '#2D3047',
  white: '#FFFFFF',
};

// SVG Data URIs for consistent patterns that can be tinted
// Using %23 for # and ensuring xmlns is present
const POLKA_DOTS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='2' fill='black'/%3E%3C/svg%3E`;
const STRIPES = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='2' y='9' fill='black'/%3E%3C/svg%3E`;
// Centered heart in larger 80x80 box for reduced density
const HEARTS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 51.35l-1.45-1.32C33.4 45.36 30 42.28 30 38.5 30 35.42 32.42 33 35.5 33c1.74 0 3.41.81 4.5 2.09C41.09 33.81 42.76 33 44.5 33 47.58 33 50 35.42 50 38.5c0 3.78-3.4 6.86-8.55 11.54L40 51.35z' fill='black'/%3E%3C/svg%3E`;
const GRID = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Cpath d='M30 0H0v30h30V0zM1 29V1h28v28H1z' fill='black' fill-opacity='0.4'/%3E%3C/svg%3E`;
// Simple elegant floral SVG pattern
const FLORAL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='black' fill-opacity='0.6'%3E%3Cpath d='M50 35c-3 0-6 3-6 7s3 7 6 7 6-3 6-7-3-7-6-7zm-15 15c0 3 3 6 7 6s7-3 7-6-3-6-7-6-7 3-7 6zm30 0c0 3 3 6 7 6s7-3 7-6-3-6-7-6-7 3-7 6zm-15 15c-3 0-6 3-6 7s3 7 6 7 6-3 6-7-3-7-6-7z'/%3E%3Ccircle cx='50' cy='50' r='5'/%3E%3Cpath d='M25 25c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm50 0c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zM25 75c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm50 0c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z'/%3E%3C/g%3E%3C/svg%3E`;

export const PATTERNS = [
  { id: 'none', label: 'Solid', url: '' },
  { id: 'grid', label: 'Grid', url: GRID },
  { id: 'polka', label: 'Polka Dots', url: POLKA_DOTS },
  { id: 'stripes', label: 'Stripes', url: STRIPES },
  { id: 'hearts', label: 'Hearts', url: HEARTS },
  { id: 'florals', label: 'Florals', url: FLORAL },
];

export const TEXTURES = [
  { id: 'none', label: 'Smooth', url: '' },
  { id: 'paper', label: 'Handmade Paper', url: 'https://www.transparenttextures.com/patterns/handmade-paper.png' },
  { id: 'canvas', label: 'Woven Canvas', url: 'https://www.transparenttextures.com/patterns/canvas-orange.png' },
  { id: 'leather', label: 'Leather Grain', url: 'https://www.transparenttextures.com/patterns/leather.png' },
];

export const FONTS = [
  { name: 'Quicksand', className: 'font-sans' },
  { name: 'Itim', className: 'font-handwritten' },
  { name: 'Pacifico', className: 'font-accent' },
  { name: 'Gochi Hand', className: 'font-sketch' },
  { name: 'Dancing Script', className: 'font-serif' },
  { name: 'Caveat', className: 'font-serif' },
  { name: 'Indie Flower', className: 'font-serif' },
  { name: 'Special Elite', className: 'font-mono' },
];

export const STICKERS = [
  { id: 'wax-seal', label: 'Wax Seal', url: 'https://img.icons8.com/plasticine/200/wax-seal.png' },
  { id: 'washi-tape', label: 'Washi', url: 'https://img.icons8.com/plasticine/200/sticky-tape.png' },
  { id: 'heart', label: 'Heart', url: 'https://img.icons8.com/plasticine/200/like--v1.png' },
  { id: 'coffee', label: 'Coffee', url: 'https://img.icons8.com/plasticine/200/coffee-to-go.png' },
  { id: 'pressed-flower', label: 'Flower', url: 'https://img.icons8.com/plasticine/200/clover.png' },
  { id: 'cute-cat', label: 'Cat', url: 'https://img.icons8.com/plasticine/200/cat.png' },
  { id: 'stamp-bird', label: 'Bird', url: 'https://img.icons8.com/plasticine/200/bird.png' },
  { id: 'sun', label: 'Sun', url: 'https://img.icons8.com/plasticine/200/sun.png' },
  { id: 'tree', label: 'Xmas Tree', url: 'https://img.icons8.com/plasticine/200/christmas-tree.png' },
  { id: 'rings', label: 'Rings', url: 'https://img.icons8.com/plasticine/200/wedding-rings.png' },
  { id: 'cake', label: 'Cake', url: 'https://img.icons8.com/plasticine/200/cake.png' },
  { id: 'star', label: 'Star', url: 'https://img.icons8.com/plasticine/200/star.png' },
];

export const TEMPLATES = [
  {
    id: 'wedding-elegant',
    name: 'Elegant Wedding',
    backgroundColor: '#F4F1DE',
    elements: [
      { id: 'w1', type: 'text', x: 50, y: 70, width: 700, height: 100, content: 'Save the Date', style: { fontSize: 56, color: '#2D3047', fontFamily: 'Dancing Script', textAlign: 'center' } },
      { id: 'w2', type: 'label', x: 50, y: 180, width: 700, height: 40, content: 'FOR THE WEDDING OF', style: { fontSize: 14, color: '#A8B5A2', fontFamily: 'Quicksand', textAlign: 'center' } },
      { id: 'w3', type: 'text', x: 50, y: 230, width: 700, height: 80, content: 'Amelia & Thomas', style: { fontSize: 42, color: '#2D3047', fontFamily: 'Special Elite', textAlign: 'center' } },
      { id: 'w4', type: 'image', x: 340, y: 330, width: 120, height: 120, content: 'https://img.icons8.com/plasticine/200/wedding-rings.png', style: { borderRadius: 0, brightness: 100, contrast: 100 } }
    ]
  },
  {
    id: 'birthday-joy',
    name: 'Birthday Joy',
    backgroundColor: '#E9C46A',
    elements: [
      { id: 'b1', type: 'text', x: 50, y: 110, width: 700, height: 120, content: 'Happy Birthday!', style: { fontSize: 72, color: '#FFFFFF', fontFamily: 'Pacifico', textAlign: 'center' } },
      { id: 'b2', type: 'image', x: 300, y: 240, width: 200, height: 200, content: 'https://img.icons8.com/plasticine/200/cake.png', style: { borderRadius: 0, brightness: 100, contrast: 100 } }
    ]
  },
  {
    id: 'anniversary-love',
    name: 'Sweet Anniversary',
    backgroundColor: '#D5B9B2',
    elements: [
      { id: 'a2', type: 'image', x: 350, y: 80, width: 100, height: 100, content: 'https://img.icons8.com/plasticine/200/like--v1.png', style: { borderRadius: 0, brightness: 100, contrast: 100 } },
      { id: 'a1', type: 'text', x: 100, y: 190, width: 600, height: 100, content: 'Happy Anniversary', style: { fontSize: 48, color: '#FFFFFF', fontFamily: 'Indie Flower', textAlign: 'center' } },
      { id: 'a3', type: 'text', x: 100, y: 310, width: 600, height: 80, content: 'To many more years together...', style: { fontSize: 28, color: '#2D3047', fontFamily: 'Caveat', textAlign: 'center' } }
    ]
  },
  {
    id: 'christmas-holiday',
    name: 'Holiday Warmth',
    backgroundColor: '#A8B5A2',
    elements: [
      { id: 'c1', type: 'text', x: 100, y: 100, width: 600, height: 100, content: 'Merry Christmas', style: { fontSize: 56, color: '#FFFFFF', fontFamily: 'Special Elite', textAlign: 'center' } },
      { id: 'c2', type: 'image', x: 300, y: 230, width: 200, height: 200, content: 'https://img.icons8.com/plasticine/200/christmas-tree.png', style: { borderRadius: 0, brightness: 100, contrast: 100 } }
    ]
  }
];

export const INITIAL_POSTCARD: any = {
  id: 'temp-' + Date.now(),
  name: 'My New Postcard',
  orientation: 'landscape',
  backgroundColor: '#F4F1DE',
  backgroundPatternColor: '#2D3047',
  backgroundTextureColor: '#FFFFFF',
  elements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
