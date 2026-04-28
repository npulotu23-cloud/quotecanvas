import { Image as ImageIcon, Layers, Layout as LayoutIcon, Palette, Sliders, Sparkles, Type, Wand2 } from 'lucide-react';

export const EDITOR_TABS = [
  { id: 'styles', label: 'Styles', icon: Sparkles },
  { id: 'type', label: 'Type', icon: Type },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'layout', label: 'Layout', icon: LayoutIcon },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'filter', label: 'Filter', icon: Wand2 },
  { id: 'shadow', label: 'Shadow', icon: Layers },
  { id: 'overlay', label: 'Overlay', icon: Layers },
  { id: 'format', label: 'Size', icon: Sliders }
];
