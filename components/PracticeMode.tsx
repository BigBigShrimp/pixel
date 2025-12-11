import React, { useState, useEffect } from 'react';
import { MousePointerClick, Paintbrush, BrainCircuit, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { PixelGrid } from './PixelGrid';

const QUESTIONS = {
    easy: [
        { id: 1, type: 'choice', text: '观察左边的图形，哪个编码是正确的？', gridSize: 3, targetData: [1, 0, 1, 0, 1, 0, 1, 0, 1], options: [{ label: 'A', value: '111000111' }, { label: 'B', value: '101010101' }, { label: 'C', value: '010101010' }], correctAnswer: '101010101' },
        { id: 2, type: 'choice', text: '我们要画一个“全黑”的 2x2 方块，应该用什么编码？', gridSize: 2, targetData: [1, 1, 1, 1], options: [{ label: 'A', value: '0000' }, { label: 'B', value: '1001' }, { label: 'C', value: '1111' }], correctAnswer: '1111' }
    ],
    medium: [
        { id: 3, type: 'draw', text: '请根据编码 1111100110011111 画出图形 (4x4)', gridSize: 4, targetData: [1,1,1,1, 1,0,0,1, 1,0,0,1, 1,1,1,1] },
        { id: 4, type: 'draw', text: '请画一个“加号” (+)：010111010 (3x3)', gridSize: 3, targetData: [0,1,0, 1,1,1, 0,1,0] }
    ],
    hard: [
        { id: 5, type: 'quiz', text: '如果不改变格子的大小，想要图像变得更清晰，应该怎么办？', options: [{ label: 'A', value: '减少格子的数量' }, { label: 'B', value: '增加格子的数量（提高分辨率）' }, { label: 'C', value: '把屏幕调亮一点' }], correctAnswer: '增加格子的数量（提高分辨率）' },
        { id: 6, type: 'quiz', text: '一个 8x8 的图像，总共包含多少个比特 (Bit)？', options: [{ label: 'A', value: '16' }, { label: 'B', value: '64' }, { label: 'C', value: '8' }], correctAnswer: '64' }
    ]
};

export const PracticeMode = () => {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [drawData, setDrawData] = useState<number[]>([]);
    const [drawKey, setDrawKey] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const currentQuestions = QUESTIONS[difficulty];
    const question = currentQuestions[currentQIndex];

    useEffect(() => {
        if (question.type === 'draw' && question.gridSize) {
            setDrawData(new Array(question.gridSize * question.gridSize).fill(0));
            setDrawKey(k => k + 1);
        }
        setFeedback(null);
    }, [question]);

    const handleChoice = (val: string) => {
        if (feedback) return;
        setFeedback(val === question.correctAnswer ? 'correct' : 'wrong');
    };

    const handleCheckDrawing = () => {
        if (!question.targetData) return;
        const isCorrect = drawData.every((val, idx) => val === question.targetData![idx]);
        setFeedback(isCorrect ? 'correct' : 'wrong');
    };

    const handleNext = () => {
        if (currentQIndex < currentQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            if (difficulty === 'easy') {
                setDifficulty('medium');
                setCurrentQIndex(0);
            } else if (difficulty === 'medium') {
                setDifficulty('hard');
                setCurrentQIndex(0);
            } else {
                setShowSuccess(true);
            }
        }
    };

    const handleTogglePixel = (idx: number, val?: number) => {
        if (feedback === 'correct') return;
        setDrawData(prev => {
            const copy = [...prev];
            copy[idx] = val ?? (copy[idx] ? 0 : 1);
            return copy;
        });
    };

    const levels = [
        { id: 'easy', label: '初级：火眼金睛', icon: MousePointerClick, color: 'bg-green-500' },
        { id: 'medium', label: '中级：神笔马良', icon: Paintbrush, color: 'bg-blue-500' },
        { id: 'hard', label: '高级：智慧大脑', icon: BrainCircuit, color: 'bg-purple-500' }
    ];

    if (showSuccess) {
        return (
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in zoom-in py-12">
                 <div className="inline-block p-12 bg-yellow-100 rounded-full mb-4 shadow-inner">
                    <Trophy size={80} className="text-yellow-600" />
                 </div>
                 <h2 className="text-4xl font-black text-slate-800">挑战成功！</h2>
                 <p className="text-xl text-slate-600">你已经完成所有关卡，掌握了像素与二进制的奥秘！</p>
                 <button onClick={() => { setShowSuccess(false); setDifficulty('easy'); setCurrentQIndex(0); }} className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 shadow-xl transition-transform hover:scale-105 flex items-center gap-2 mx-auto">
                    <RotateCcw size={20} /> 再玩一次
                 </button>
            </div>
        );
    }

    const isLastQuestion = currentQIndex === currentQuestions.length - 1;
    let nextButtonText = "下一题";
    if (isLastQuestion) {
        nextButtonText = difficulty === 'hard' ? "完成挑战" : "继续挑战";
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-center gap-4 mb-8">
                {levels.map((level) => {
                    const Icon = level.icon;
                    return (
                        <button
                            key={level.id}
                            onClick={() => { setDifficulty(level.id as any); setCurrentQIndex(0); setFeedback(null); setShowSuccess(false); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-b-4 ${difficulty === level.id ? `${level.color} text-white border-black/20 scale-105 shadow-lg` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            <Icon size={18} /> {level.label}
                        </button>
                    );
                })}
            </div>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative min-h-[400px]">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="bg-yellow-400 text-yellow-900 font-black px-3 py-1 rounded-lg text-sm shadow-sm">第 {currentQIndex + 1} / {currentQuestions.length} 题</span>
                        <h3 className="text-xl font-bold text-slate-800">
                            {question.type === 'choice' && '看图识码'}
                            {question.type === 'draw' && '看码画图'}
                            {question.type === 'quiz' && '脑力风暴'}
                        </h3>
                    </div>
                </div>
                <div className="p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-slate-700 mb-8 text-center leading-relaxed">{question.text}</h2>
                    <div className="w-full max-w-2xl">
                        {question.type === 'choice' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="flex justify-center"><PixelGrid size={question.gridSize!} data={question.targetData!} onToggle={() => {}} highlightIndex={null} readonly label="题目图形" /></div>
                                <div className="space-y-4">
                                    {question.options?.map((opt, idx) => (
                                        <button key={idx} onClick={() => handleChoice(opt.value)} disabled={!!feedback} className={`w-full p-4 rounded-xl font-mono text-lg font-bold border-2 transition-all flex items-center justify-between group ${feedback && opt.value === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-700' : ''} ${feedback === 'wrong' && opt.value !== question.correctAnswer ? 'opacity-50' : ''} ${!feedback ? 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md' : ''}`}>
                                            <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-sm border shadow-sm text-slate-400 group-hover:text-blue-500">{opt.label}</span><span>{opt.value}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {question.type === 'draw' && (
                            <div className="flex flex-col items-center gap-6">
                                <PixelGrid key={drawKey} size={question.gridSize!} data={drawData} onToggle={handleTogglePixel} highlightIndex={null} label="在此作答" />
                                <button onClick={handleCheckDrawing} disabled={!!feedback} className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
                                    <CheckCircle2 /> 提交答案
                                </button>
                            </div>
                        )}
                        {question.type === 'quiz' && (
                            <div className="grid gap-4 max-w-xl mx-auto">
                                {question.options?.map((opt, idx) => (
                                    <button key={idx} onClick={() => handleChoice(opt.value)} disabled={!!feedback} className={`w-full p-6 rounded-xl text-left font-bold border-2 transition-all flex items-center gap-4 ${feedback && opt.value === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-700' : ''} ${feedback === 'wrong' && opt.value !== question.correctAnswer ? 'opacity-50' : ''} ${!feedback ? 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50' : ''}`}>
                                        <span className="shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-serif italic text-slate-500">{opt.label}</span><span className="text-lg">{opt.value}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {feedback && (
                    <div className={`absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center animate-in slide-in-from-bottom-full ${feedback === 'correct' ? 'bg-green-100 border-t-4 border-green-500' : 'bg-red-100 border-t-4 border-red-500'}`}>
                        <div className="flex items-center gap-4">
                            {feedback === 'correct' ? <div className="bg-green-500 text-white p-2 rounded-full"><CheckCircle2 size={32} /></div> : <div className="bg-red-500 text-white p-2 rounded-full"><XCircle size={32} /></div>}
                            <div>
                                <h4 className={`text-xl font-black ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>{feedback === 'correct' ? '太棒了！回答正确！' : '哎呀，再试一次吧！'}</h4>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {feedback === 'wrong' && <button onClick={() => { setFeedback(null); if (question.type === 'draw') setDrawData(new Array(question.gridSize! * question.gridSize!).fill(0)); }} className="px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-50">重试</button>}
                            {feedback === 'correct' && <button onClick={handleNext} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2">{nextButtonText} <ArrowRight size={18} /></button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};