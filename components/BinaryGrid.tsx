import React from 'react';

interface BinaryGridProps {
    size: number;
    data: number[];
    highlightIndex: number | null;
    onHoverIndex: (index: number | null) => void;
    onToggle?: (index: number) => void;
    label?: string;
}

export const BinaryGrid: React.FC<BinaryGridProps> = ({ size, data, highlightIndex, onHoverIndex, onToggle, label }) => {
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        gap: size > 32 ? '0px' : size > 16 ? '1px' : '2px',
    };
    const isInteractive = !!onToggle;

    return (
        <div 
            className={`
                bg-white p-2 rounded-lg shadow-inner border-4 border-slate-200 select-none aspect-square max-w-[400px] w-full mx-auto relative group
                ${isInteractive ? 'hover:border-blue-500 transition-colors' : ''}
            `}
            style={gridStyle}
            onMouseLeave={() => onHoverIndex(null)}
        >
            <div className="absolute -top-8 left-0 right-0 text-center">
                <span className={`
                    text-xs px-2 py-1 rounded shadow-sm font-bold
                    ${isInteractive ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}
                `}>
                    {label || "计算机看到的 (0/1矩阵)"}
                </span>
            </div>

            {data.map((val, idx) => (
                <div
                    key={idx}
                    onMouseEnter={() => onHoverIndex(idx)}
                    onClick={() => isInteractive && onToggle && onToggle(idx)}
                    className={`
                        flex items-center justify-center font-mono transition-all select-none overflow-hidden leading-none
                        ${size > 48 ? 'text-[5px]' : size > 32 ? 'text-[6px]' : size > 16 ? 'text-[8px]' : size > 8 ? 'text-[10px]' : 'text-sm'}
                        ${highlightIndex === idx 
                            ? 'bg-yellow-400 text-black scale-125 z-20 shadow-lg ring-2 ring-yellow-200 font-bold' 
                            : (val === 1 ? 'bg-slate-50 text-slate-900 font-black' : 'bg-slate-50 text-slate-300')
                        }
                        ${isInteractive 
                            ? 'cursor-pointer hover:bg-blue-100 hover:text-blue-700 hover:scale-110 hover:z-10 hover:font-bold' 
                            : 'cursor-default'}
                    `}
                >
                    {val}
                </div>
            ))}
        </div>
    );
};