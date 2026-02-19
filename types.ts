
export type ElementType = 'text' | 'image' | 'label';

export interface PostcardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  rotation?: number;
  style: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    borderRadius?: number;
    brightness?: number;
    contrast?: number;
    borderWidth?: number;
    borderColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: string;
  };
}

export type Orientation = 'portrait' | 'landscape';

export interface PostcardDesign {
  id: string;
  name: string;
  orientation: Orientation;
  backgroundColor: string;
  backgroundPattern?: string;
  backgroundPatternColor?: string;
  elements: PostcardElement[];
  createdAt: string;
  updatedAt: string;
}

export interface HistoryState {
  past: PostcardDesign[];
  present: PostcardDesign;
  future: PostcardDesign[];
}
