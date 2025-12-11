import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Eraser, CheckCircle, Wand2, RotateCcw, ArrowRightLeft, Eye, Binary, FileCode2, Lock, Image as ImageIcon, GraduationCap, ShieldCheck } from 'lucide-react';
import { PixelGrid } from './components/PixelGrid';
import { BinaryGrid } from './components/BinaryGrid';
import { BinaryStream } from './components/BinaryStream';
import { InfoPanel } from './components/InfoPanel';
import { PracticeMode } from './components/PracticeMode';
import { SocialResponsibilityMode } from './components/SocialResponsibilityMode';
import { GridSize, AppMode } from './types';

const App: React.FC = () => {
  const [size, setSize] = useState<GridSize>(8);
  // Initialize with 8x8 grid filled with 0s to match default size
  const [gridData, setGridData] = useState<number[]>(new Array(64).fill(0));
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [inputMode, setInputMode] = useState<'draw' | 'code'>('draw');
  
  const [challengePrompt, setChallengePrompt] = useState("画一个“智”字");

  // State to toggle the visibility of the right-side output (Code or Image)
  const [showCode, setShowCode] = useState(false);

  // Note: Removed the useEffect that watched [size] and reset data.
  // It caused race conditions when loading presets (flashing data then resetting to 0).
  // Now, every function that changes size MUST also explicitly setGridData.

  // Handler for loading presets from InfoPanel
  const handleLoadPreset = (newSize: GridSize, newData: number[]) => {
    setSize(newSize);
    setGridData(newData);
    setMode(AppMode.EXPLORE); // Switch to explore mode to view the preset
    setShowCode(false); // Reset code view on preset load
    setInputMode('draw'); // Ensure we are in draw mode to see the preset visually on the left
  };

  const handleResolutionSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    
    // Immediately generate circle for feedback
    const center = (newSize - 1) / 2;
    const radius = newSize / 2 - 1.0; 
    const circleData = new Array(newSize * newSize).fill(0).map((_, i) => {
        const x = i % newSize;
        const y = Math.floor(i / newSize);
        const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
        return dist <= radius ? 1 : 0;
    });

    setGridData(circleData);
    setMode(AppMode.EXPLORE);
  };

  const togglePixel = useCallback((index: number, value?: number) => {
    setGridData(prev => {
      const newData = [...prev];
      if (value !== undefined) {
          newData[index] = value;
      } else {
          newData[index] = newData[index] === 0 ? 1 : 0;
      }
      return newData;
    });
  }, []);

  const clearGrid = () => {
    setGridData(new Array(size * size).fill(0));
  };

  // Helper to switch main App Modes (Explore vs Challenge)
  // This satisfies the requirement: "模式切换，默认左图右码，并且清空"
  const switchAppMode = (newMode: AppMode) => {
    setMode(newMode);
    
    // Reset specific states when entering Explore/Challenge/Practice
    if (newMode === AppMode.EXPLORE || newMode === AppMode.CHALLENGE) {
        setInputMode('draw'); // Default to Left: Image, Right: Code
        clearGrid();          // Clear the grid
        setShowCode(false);   // Hide the output initially for a clean slate
        setHighlightIndex(null);
    }
  };

  const handleSwapMode = () => {
    setInputMode(prev => prev === 'draw' ? 'code' : 'draw');
    // Ensure output is visible when swapping modes for better UX
    setShowCode(true);
    // Clear the grid when swapping modes as requested
    clearGrid();
  };

  const handleStreamUpdate = (newData: number[]) => {
    setGridData(newData);
  };

  // Logic to cycle through challenge prompts including "Zhi" and "De"
  const nextChallenge = () => {
    const prompts = [
      "画一个“智”字", 
      "画一个“德”字",
      "画一个笑脸", 
      "画一把椅子", 
      "画一个爱心"
    ];
    const currentIndex = prompts.indexOf(challengePrompt);
    const nextIndex = (currentIndex + 1) % prompts.length;
    setChallengePrompt(prompts[nextIndex]);
  };

  // Available sizes for the manual selector (removed 64)
  const availableSizes: GridSize[] = [2, 3, 4, 8, 16, 32];

  // Helper function to render content based on mode
  const renderContent = () => {
    if (mode === AppMode.PRACTICE) {
      return <PracticeMode />;
    }
    
    if (mode === AppMode.RESPONSIBILITY) {
      return <SocialResponsibilityMode />;
    }

    // Default: EXPLORE or CHALLENGE content
    return (
      <>
        {/* Top Controls Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            {/* Size Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                <Grid size={16} />
                画布大小
              </span>
              <div className="flex gap-1 flex-wrap">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                        if (size !== s) {
                          setSize(s as GridSize);
                          setGridData(new Array(s*s).fill(0));
                          setShowCode(false);
                          setInputMode('draw');
                        }
                    }}
                    className={`
                      w-9 h-9 rounded-lg font-bold text-xs md:text-sm transition-all border-2 shrink-0
                      ${size === s 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-auto">
            <button 
                onClick={clearGrid}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-sm font-bold"
              >
                <Eraser size={18} />
                清空
              </button>
          </div>
        </div>

        {/* Challenge Banner */}
        {mode === AppMode.CHALLENGE && (
          <div className="mb-8 bg-purple-600 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <CheckCircle className="text-purple-300" />
                任务：{challengePrompt}
              </h2>
              <p className="text-purple-100 text-sm opacity-90">请在左边的格子里尝试画出来，看看计算机会变成什么代码！</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={nextChallenge}
                className="px-4 py-2 bg-purple-700/50 hover:bg-purple-800 rounded-lg text-sm font-medium transition-colors border border-purple-500"
              >
                <RotateCcw size={14} className="inline mr-1"/>
                换个题目
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workspace (Left & Middle) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* The Visual Translation Area */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              
              {/* Left Slot: Input */}
              <div className="w-full max-w-[350px] order-1">
                  {inputMode === 'draw' ? (
                    <PixelGrid 
                      size={size} 
                      data={gridData} 
                      onToggle={togglePixel}
                      highlightIndex={highlightIndex}
                      onHoverIndex={setHighlightIndex}
                      label="输入：我来画图"
                    />
                  ) : (
                    <BinaryGrid 
                      size={size} 
                      data={gridData} 
                      highlightIndex={highlightIndex}
                      onHoverIndex={setHighlightIndex}
                      onToggle={togglePixel}
                      label="输入：修改0和1"
                    />
                  )}
              </div>

              {/* Center: Action & Swap Control */}
              <div className="flex flex-col items-center gap-4 z-10 order-2">
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => setShowCode(!showCode)}
                      className={`
                        w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 border-4
                        ${showCode
                          ? 'bg-green-500 border-green-200 text-white' 
                          : 'bg-white border-slate-200 text-slate-500 hover:scale-110 hover:border-blue-300 hover:text-blue-500'}
                      `}
                      title={showCode ? "隐藏输出" : "显示输出"}
                    >
                      {showCode ? (
                        inputMode === 'draw' ? <FileCode2 fill="currentColor" className="text-white" size={24} /> : <ImageIcon className="text-white" size={24} />
                      ) : (
                        inputMode === 'draw' ? <Binary className="text-blue-500/50" size={24} /> : <ImageIcon className="text-blue-500/50" size={24} />
                      )}
                      <span className="text-[10px] font-bold uppercase mt-1">
                        {showCode ? '隐藏' : (inputMode === 'draw' ? '编码' : '图像')}
                      </span>
                    </button>
                    {!showCode && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center animate-pulse">
                        点击生成<br/>{inputMode === 'draw' ? '计算机编码' : '图像'}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={handleSwapMode}
                    className="group flex flex-col items-center gap-1 mt-2"
                    title="切换模式：画图 vs 写代码"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-500 flex items-center justify-center shadow-sm group-hover:border-blue-400 group-hover:text-blue-500 transition-all group-hover:rotate-180">
                      <ArrowRightLeft size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-400">
                      互换
                    </span>
                  </button>
              </div>

              {/* Right Slot: Output */}
              <div className="w-full max-w-[350px] order-3">
                {showCode ? (
                    <div className="animate-in zoom-in-50 duration-300">
                        {inputMode === 'draw' ? (
                            <BinaryGrid 
                                size={size} 
                                data={gridData} 
                                highlightIndex={highlightIndex}
                                onHoverIndex={setHighlightIndex}
                                label="输出：计算机看到的"
                            />
                        ) : (
                            <PixelGrid 
                                size={size} 
                                data={gridData} 
                                onToggle={() => {}} // No-op
                                highlightIndex={highlightIndex}
                                onHoverIndex={setHighlightIndex}
                                readonly={true}
                                label="输出：生成的图像"
                            />
                        )}
                    </div>
                ) : (
                    <div className="aspect-square w-full max-w-[400px] bg-slate-50 rounded-lg border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 select-none">
                        <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                            <Lock size={32} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-sm text-slate-500">
                            {inputMode === 'draw' ? '编码已隐藏' : '图像已隐藏'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">点击中间按钮查看</p>
                    </div>
                )}
              </div>
            </div>
            
            {/* Resolution Slider Section - ONLY VISIBLE IN EXPLORE MODE */}
            {mode === AppMode.EXPLORE && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                      <Eye size={120} />
                  </div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-slate-700 flex items-center gap-2">
                              <Eye className="text-blue-600" />
                              分辨率实验室
                          </h3>
                          <span className="text-xs font-mono font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
                              当前分辨率: {size} × {size}
                          </span>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">8 (模糊)</span>
                          <input 
                              type="range" 
                              min="8" 
                              max="64" 
                              step="2"
                              value={size} 
                              onChange={handleResolutionSliderChange}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                          />
                          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">64 (清晰)</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-3 text-center font-medium">
                          👈 拖动滑块 👉 观察圆形的边缘如何变化！分辨率越高，需要的 0 和 1 就越多。
                      </p>
                  </div>
              </div>
            )}

            {/* Bottom: Linear Stream View (Always Visible) */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <BinaryStream 
                  data={gridData} 
                  highlightIndex={highlightIndex}
                  onHoverIndex={setHighlightIndex}
                  onDataChange={handleStreamUpdate}
                />
            </div>

          </div>

          {/* Right Sidebar: Info & Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center group hover:border-blue-200 transition-colors">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">分辨率 (大小)</p>
                <p className="text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                  <span>{size}</span>
                  <span className="text-slate-300 text-xl">×</span>
                  <span>{size}</span>
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center group hover:border-blue-200 transition-colors">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">信息量 (总比特数)</p>
                <p className="text-3xl font-black text-blue-600">{size * size}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">需要 {size*size} 个 0 或 1</p>
              </div>
            </div>

            {/* Replaced InfoPanel with the new Preset Functionality */}
            <InfoPanel 
              gridSize={size} 
              totalBits={size * size} 
              onLoadPreset={handleLoadPreset}
            />
            
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => switchAppMode(AppMode.EXPLORE)}>
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-lg">
              <Wand2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">像素魔法师</h1>
              <p className="text-xs text-slate-500 font-medium">探索计算机的 0 和 1 世界</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => switchAppMode(AppMode.EXPLORE)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${mode === AppMode.EXPLORE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              自由探索
            </button>
            <button 
              onClick={() => switchAppMode(AppMode.CHALLENGE)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${mode === AppMode.CHALLENGE ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              小小挑战
            </button>
            <button 
              onClick={() => switchAppMode(AppMode.PRACTICE)}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${mode === AppMode.PRACTICE ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <GraduationCap size={16} />
              闯关练习
            </button>
            <button 
              onClick={() => switchAppMode(AppMode.RESPONSIBILITY)}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${mode === AppMode.RESPONSIBILITY ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldCheck size={16} />
              社会责任
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;