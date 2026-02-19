
export const COLORS = {
  sage: '#A8B5A2',
  beige: '#F5EBE0',
  lavender: '#D5B9B2',
  terracotta: '#E29578',
  mustard: '#E9C46A',
  teal: '#81B29A',
  cream: '#F4F1DE',
  charcoal: '#2D3047', // Darkened for better visibility
};

export const PATTERNS = [
  { id: 'none', label: 'Solid', url: '' },
  { id: 'grid', label: 'Grid Paper', url: 'https://www.transparenttextures.com/patterns/graphy.png' },
  { id: 'kraft', label: 'Kraft Texture', url: 'https://www.transparenttextures.com/patterns/natural-paper.png' },
];

export const FONTS = [
  { name: 'Quicksand', className: 'font-sans' },
  { name: 'Itim', className: 'font-handwritten' },
  { name: 'Pacifico', className: 'font-accent' },
  { name: 'Gochi Hand', className: 'font-sketch' },
];

export const INITIAL_POSTCARD: any = {
  id: 'temp-' + Date.now(),
  name: 'My New Postcard',
  orientation: 'landscape',
  backgroundColor: '#F4F1DE',
  backgroundPatternColor: '#2D3047',
  elements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
