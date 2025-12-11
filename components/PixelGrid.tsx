import React, { useRef } from 'react';
import { GridSize } from '../types';

interface PixelGridProps {
  size: GridSize;
  data: number[];
  onToggle: (index: number, value?: number) => void;
  highlightIndex: number | null;
  onHoverIndex?: (index: number | null) => void;
  readonly?: boolean;
  label?: string;
}

export const PixelGrid: React.FC<PixelGridProps> = ({ size, data, onToggle, highlightIndex, onHoverIndex, readonly = false, label }) => {
  const paintingValueRef = useRef<number>(1); // 1 for black, 0 for white

  // Dynamic grid template columns
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
    // Optimize gap: Always show grid lines (gaps) to define the squares ("方格"),
    // even at high resolutions. Previously it was 0px for >=32.
    gap: size > 16 ? '1px' : '2px',
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (readonly) return;
    e.preventDefault(); // Prevent default browser drag behavior (e.g. dragging the div as an image)
    
    const currentValue = data[index];
    const newValue = currentValue === 1 ? 0 : 1;
    paintingValueRef.current = newValue;
    
    onToggle(index, newValue);
  };

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    onHoverIndex?.(index);
    
    if (readonly) return;
    
    // Check if the primary mouse button (Left Button) is held down
    if (e.buttons === 1) {
        onToggle(index, paintingValueRef.current);
    }
  };

  return (
    <div 
      className={`
        bg-gray-200 p-2 rounded-lg shadow-inner border-4 border-gray-300 select-none aspect-square max-w-[400px] w-full mx-auto relative
        ${!readonly ? 'hover:border-blue-400 transition-colors' : ''}
      `}
      style={gridStyle}
      onMouseLeave={() => onHoverIndex?.(null)}
    >
      {/* Label Overlay */}
      <div className="absolute -top-8 left-0 right-0 text-center">
        <span className={`
          text-xs px-2 py-1 rounded shadow-sm font-bold
          ${!readonly ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
        `}>
            {label || "我们看到的 (图像)"}
        </span>
      </div>

      {data.map((val, idx) => (
        <div
          key={idx}
          onMouseDown={(e) => handleMouseDown(e, idx)}
          onMouseEnter={(e) => handleMouseEnter(e, idx)}
          className={`
            relative aspect-square cursor-pointer
            ${val === 1 ? 'bg-gray-900' : 'bg-white'}
            ${highlightIndex === idx ? 'ring-4 ring-yellow-400 z-10 scale-110 shadow-lg' : 'hover:z-10'}
            ${readonly ? 'cursor-default' : ''}
          `}
          // Note: Removed 'transition-all' and 'rounded-sm'.
          // Removing transitions ensures that when dragging quickly to paint, 
          // the color updates instantly without a "laggy" visual effect.
          title={`像素 #${idx + 1}`}
        >
        </div>
      ))}
    </div>
  );
};