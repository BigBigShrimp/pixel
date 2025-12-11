import React from 'react';
import { Image, BoxSelect, Maximize, MousePointerClick } from 'lucide-react';
import { GridSize } from '../types';

interface InfoPanelProps {
  gridSize: GridSize;
  totalBits: number;
  onLoadPreset: (size: GridSize, data: number[]) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ gridSize, totalBits, onLoadPreset }) => {

  const generatePattern = (size: number, type: 'checkboard' | 'circle' | 'random'): number[] => {
    const arr = new Array(size * size).fill(0);
    if (type === 'checkboard') {
        return arr.map((_, i) => (Math.floor(i / size) + i) % 2);
    }
    if (type === 'circle') {
        const center = (size - 1) / 2;
        const radius = size / 2 - 1.5; // Slightly smaller to fit nicely
        return arr.map((_, i) => {
            const x = i % size;
            const y = Math.floor(i / size);
            const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
            return dist <= radius ? 1 : 0;
        });
    }
    return arr;
  }

  // Preset Data definitions
  const presets = [
    {
        name: "极简方块",
        size: 2 as GridSize,
        description: "只有 4 个格子，只能勉强表示黑白相间。",
        data: [1, 0, 0, 1]
    },
    {
        name: "小十字",
        size: 3 as GridSize,
        description: "9 个格子，可以画一个简单的符号。",
        data: [0, 1, 0, 1, 1, 1, 0, 1, 0]
    },
    {
        name: "笑脸",
        size: 8 as GridSize,
        description: "64 个格子，足够画一个表情包了！",
        data: [
            0,0,1,1,1,1,0,0,
            0,1,0,0,0,0,1,0,
            1,0,1,0,0,1,0,1,
            1,0,0,0,0,0,0,1,
            1,0,1,0,0,1,0,1,
            1,0,0,1,1,0,0,1,
            0,1,0,0,0,0,1,0,
            0,0,1,1,1,1,0,0
        ]
    },
    {
        name: "像素小熊猫",
        size: 16 as GridSize,
        description: "用 0 和 1 画出的可爱国宝！",
        data: "00110000000110000111100000111100011111111111110011110000000111101000000000000010100000000000001010000000000000101001110001110010101111000111101010111000001110101011000100011010100000000000001010000000000000101111111111111110000000000000000000000000000000000000000000000000".split('').map(Number)
    },
    {
        name: "信息科技",
        size: 32 as GridSize,
        description: "1024 个格子，刚好可以写下这四个汉字。",
        data: "0000100010000000000000100000000000001000010000000000010000000000000101111111110000011111111100000001000000000000000100000001000000110011111110000001111111110000010100000000000000010000000100000001001111111000000111111111000000010000000000000001000000010000000100111111100000011111111100000001001000001000000000010000000000010010000010000000100010001000000100100000100000101000100001000001001111111000001010000010010000010010000010000100011111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001100100100000010000010000000011100000101000000100000100000000001000001010000001000001000000000010001000100001111011111110000111111001001000000100000100000000001000010010000001000001000000000110000000100000010011111100000001110011111110000110010001000000101010000010000111000100010000010010000000100000010000101000000000100000001000000100000100000000001000000010000001000010100000000010000000100000010001000100000000100000001000011101100000110000000000000000000000000000000000".split('').map(Number)
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
        <Image className="w-6 h-6 text-blue-500" />
        图案实验室
      </h2>
      
      <div className="mb-4 text-sm text-slate-500">
        点击下面的按钮，看看不同长度的编码能画出什么样的图形？
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {presets.map((preset, idx) => (
            <div 
                key={idx}
                onClick={() => onLoadPreset(preset.size, preset.data)}
                className={`
                    group relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md
                    ${gridSize === preset.size ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-blue-300'}
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className={`font-bold ${gridSize === preset.size ? 'text-blue-700' : 'text-slate-700'}`}>
                            {preset.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <BoxSelect size={12}/>
                            {preset.size} x {preset.size} 网格
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-xl font-black ${gridSize === preset.size ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-400'}`}>
                            {preset.size * preset.size}
                        </span>
                        <p className="text-[10px] text-slate-400">位编码</p>
                    </div>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                    {preset.description}
                </p>

                {gridSize === preset.size && (
                    <div className="absolute -right-2 -top-2 bg-blue-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                        <MousePointerClick size={14} />
                    </div>
                )}
            </div>
        ))}
      </div>

      <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <Maximize className="text-yellow-600 shrink-0 mt-1" size={18} />
            <div>
                <h5 className="font-bold text-yellow-800 text-sm">观察与思考</h5>
                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                    对比 16x16 和 32x32，你会发现格子越多，能表达的信息（比如复杂的汉字）就越丰富！
                </p>
            </div>
          </div>
      </div>
    </div>
  );
};