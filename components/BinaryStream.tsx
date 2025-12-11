import React, { useState, useEffect } from 'react';
import { Pencil, Check, X, AlertCircle } from 'lucide-react';

interface BinaryStreamProps {
  data: number[];
  onHoverIndex: (index: number | null) => void;
  highlightIndex: number | null;
  onDataChange: (newData: number[]) => void;
}

export const BinaryStream: React.FC<BinaryStreamProps> = ({ data, onHoverIndex, highlightIndex, onDataChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // When data changes externally and we are not editing, update the internal state potentially (optional, mainly for reset)
  // But usually we want to initialize editing with current data
  useEffect(() => {
    if (!isEditing) {
      setError(null);
    }
  }, [data, isEditing]);

  const handleStartEdit = () => {
    setInputValue(data.join(''));
    setIsEditing(true);
    setError(null);
    onHoverIndex(null); // Stop highlighting when editing starts
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const cleanInput = (str: string) => str.replace(/[^01]/g, '');

  const handleSave = () => {
    const cleaned = cleanInput(inputValue);
    
    if (cleaned.length !== data.length) {
      setError(`长度不对哦！需要 ${data.length} 位，现在有 ${cleaned.length} 位。`);
      return;
    }

    const newData = cleaned.split('').map(Number);
    onDataChange(newData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Allow typing formatting chars but clean them for validation display
    setInputValue(val);
    
    const cleaned = cleanInput(val);
    if (cleaned.length === data.length) {
      setError(null);
    }
  };

  const currentLength = cleanInput(inputValue).length;
  const targetLength = data.length;
  const isLengthCorrect = currentLength === targetLength;

  return (
    <div className={`bg-white text-slate-800 font-mono p-4 rounded-xl shadow-md w-full border-2 transition-colors ${isEditing ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
      <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
           {!isEditing && <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
           {isEditing ? '修改内部编码' : '计算机内部存储 (Data Stream)'}
        </h3>
        
        {!isEditing ? (
           <button 
             onClick={handleStartEdit}
             className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-blue-600 hover:text-white px-2 py-1 rounded transition-colors text-slate-500"
           >
             <Pencil size={12} />
             修改编码
           </button>
        ) : (
          <div className="flex gap-2">
            <button 
               onClick={handleCancel}
               className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors"
               title="取消"
            >
              <X size={16} />
            </button>
            <button 
               onClick={handleSave}
               disabled={!isLengthCorrect}
               className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all
                 ${isLengthCorrect 
                   ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg hover:scale-105' 
                   : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
               `}
            >
              <Check size={14} />
              生成图像
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="animate-in fade-in duration-200">
          <textarea
            value={inputValue}
            onChange={handleChange}
            className="w-full h-[120px] bg-slate-50 text-slate-800 p-3 rounded-lg focus:outline-none resize-none text-lg leading-relaxed tracking-widest font-mono border border-slate-200 focus:border-blue-500 shadow-inner"
            placeholder="在这里输入 0 和 1..."
            spellCheck={false}
          />
          <div className="mt-2 flex justify-between items-center text-xs">
            <div className={`flex items-center gap-2 ${isLengthCorrect ? 'text-green-600' : 'text-orange-500'}`}>
              <span className="font-bold">长度: {currentLength} / {targetLength}</span>
              {!isLengthCorrect && <span>({currentLength < targetLength ? `还差 ${targetLength - currentLength} 位` : `多了 ${currentLength - targetLength} 位`})</span>}
            </div>
            <div className="text-slate-400">只支持 0 和 1</div>
          </div>
          {error && (
            <div className="mt-2 text-red-500 text-xs flex items-center gap-1 animate-pulse">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto break-all text-lg leading-none select-none scrollbar-thin scrollbar-thumb-slate-300 pr-2">
            {data.map((bit, idx) => (
              <span
                key={idx}
                onMouseEnter={() => onHoverIndex(idx)}
                onMouseLeave={() => onHoverIndex(null)}
                className={`
                  inline-block w-4 text-center cursor-crosshair transition-all duration-75 rounded
                  ${highlightIndex === idx 
                      ? 'bg-yellow-400 text-black font-bold scale-125 z-10' 
                      : (bit === 1 ? 'text-slate-900 font-extrabold bg-slate-100' : 'text-slate-300')
                  }
                  hover:bg-yellow-500 hover:text-black
                `}
              >
                {bit}
              </span>
            ))}
          </div>
          <div className="mt-2 flex justify-between items-end border-t border-slate-100 pt-2">
            <div className="text-xs text-slate-500">
               * 只要改变这里的 0 和 1，上面的图片也会立刻变化哦！
            </div>
             <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">长度: {data.length} 位</span>
          </div>
        </>
      )}
    </div>
  );
};