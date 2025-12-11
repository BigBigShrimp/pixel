import React, { useState } from 'react';
import { Shield, Eye, Share2, Trash2, Heart, AlertTriangle, User, Users, Globe, Smile } from 'lucide-react';
import { PixelGrid } from './PixelGrid';

export const SocialResponsibilityMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fake' | 'footprint' | 'ethics'>('fake');

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-teal-100 rounded-full mb-2">
            <Shield size={48} className="text-teal-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">数字小公民守护站</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          掌握了像素魔法（技术），我们更要学会如何正确地使用它（责任）。<br/>
          能力越大，责任越大哦！
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setActiveTab('fake')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-b-4
            ${activeTab === 'fake' 
              ? 'bg-yellow-500 text-white border-yellow-700 shadow-lg scale-105' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-yellow-50'}
          `}
        >
          <Eye size={20} />
          眼见不一定为实
        </button>
        <button
          onClick={() => setActiveTab('footprint')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-b-4
            ${activeTab === 'footprint' 
              ? 'bg-blue-500 text-white border-blue-700 shadow-lg scale-105' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-blue-50'}
          `}
        >
          <Share2 size={20} />
          互联网有记忆
        </button>
        <button
          onClick={() => setActiveTab('ethics')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-b-4
            ${activeTab === 'ethics' 
              ? 'bg-purple-500 text-white border-purple-700 shadow-lg scale-105' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-purple-50'}
          `}
        >
          <Heart size={20} />
          做负责任的创作者
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 min-h-[500px]">
        {activeTab === 'fake' && <FakeImageLesson />}
        {activeTab === 'footprint' && <DigitalFootprintLesson />}
        {activeTab === 'ethics' && <EthicsLesson />}
      </div>
    </div>
  );
};

// Sub-component 1: Seeing isn't believing (Image Tampering)
const FakeImageLesson: React.FC = () => {
  const [gridData, setGridData] = useState<number[]>([
    0,0,1,0,0,1,0,0,
    0,0,1,0,0,1,0,0,
    0,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,1,
    0,1,1,1,1,1,1,0, // Smile mouth
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
  ]);
  const [hasTampered, setHasTampered] = useState(false);

  const handleToggle = (idx: number, val?: number) => {
    setGridData(prev => {
      const copy = [...prev];
      copy[idx] = val ?? (copy[idx] ? 0 : 1);
      return copy;
    });
    setHasTampered(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
           <h3 className="text-xl font-bold text-yellow-800 flex items-center gap-2 mb-3">
             <AlertTriangle />
             挑战任务：制造“假新闻”
           </h3>
           <p className="text-yellow-900 leading-relaxed">
             看右边的这张 8x8 的像素照片，它是一个开心的笑脸。<br/>
             <strong>请你试着修改几个像素（点击格子），把它变成一个“难过”的表情，或者其他表情。</strong>
           </p>
        </div>
        
        {hasTampered && (
           <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
             <h4 className="text-lg font-bold text-slate-800">你发现了什么？</h4>
             <p className="text-slate-600">
               只需要轻轻一点，改变几个 0 和 1，照片表达的意思就完全变了！
               在数字世界里，修改图片太容易了。
             </p>
             <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-700 font-medium">
                💡 <span className="text-blue-600 font-bold">小贴士：</span> 以后在网上看到奇怪的图片（比如同学做坏事的照片），不要马上相信，也许它是被别人修改过的哦！
             </div>
           </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <PixelGrid 
           size={8} 
           data={gridData} 
           onToggle={handleToggle} 
           highlightIndex={null}
           label={hasTampered ? "被修改后的图像" : "原始图像：开心"}
        />
        <div className="mt-4 text-center text-xs text-slate-400">
          点击上面的方格进行修改
        </div>
      </div>
    </div>
  );
};

// Sub-component 2: Digital Footprint
const DigitalFootprintLesson: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'uploaded' | 'deleted'>('idle');

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center max-w-2xl">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">照片去哪儿了？</h3>
        <p className="text-slate-500">
           当我们把照片发到网上，或者发给同学，点击“删除”真的能删掉吗？
        </p>
      </div>

      <div className="relative w-full max-w-3xl bg-slate-50 rounded-3xl p-8 min-h-[300px] flex items-center justify-between gap-4">
          
          {/* User Node */}
          <div className="flex flex-col items-center gap-2 z-10">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200">
                <User size={32} className="text-blue-600"/>
             </div>
             <span className="font-bold text-slate-600">我的手机</span>
             
             <div className="flex flex-col gap-2 mt-2">
               <button 
                 onClick={() => setStep('uploaded')}
                 disabled={step !== 'idle'}
                 className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-md disabled:opacity-50 hover:bg-blue-700"
               >
                 📤 发送照片
               </button>
               {step === 'uploaded' && (
                 <button 
                   onClick={() => setStep('deleted')}
                   className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-md hover:bg-red-600 animate-pulse"
                 >
                   🗑️ 立即删除
                 </button>
               )}
             </div>
          </div>

          {/* Connection Lines & Data Packet */}
          <div className="flex-1 h-1 bg-slate-200 relative mx-4">
             {/* Animation of data packet */}
             {step === 'uploaded' && (
                <>
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-sm animate-[ping_1s_ease-in-out_infinite]"></div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-1 bg-blue-400 transition-all duration-1000"></div>
                </>
             )}
             {step === 'deleted' && (
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-1 bg-slate-200 z-20"></div> // Broken link visual
             )}
          </div>

          {/* Internet/Others Node */}
          <div className="flex flex-col items-center gap-4 z-10">
             <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-colors ${step !== 'idle' ? 'bg-green-100 border-green-200' : 'bg-slate-100 border-slate-200'}`}>
                        <Globe size={24} className={step !== 'idle' ? "text-green-600" : "text-slate-300"}/>
                    </div>
                    <span className="text-xs font-bold mt-1 text-slate-400">网络服务器</span>
                    {step !== 'idle' && <div className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded font-bold border border-yellow-200">有备份!</div>}
                </div>
                <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-colors ${step !== 'idle' ? 'bg-purple-100 border-purple-200' : 'bg-slate-100 border-slate-200'}`}>
                        <Users size={24} className={step !== 'idle' ? "text-purple-600" : "text-slate-300"}/>
                    </div>
                    <span className="text-xs font-bold mt-1 text-slate-400">同学的手机</span>
                    {step !== 'idle' && <div className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded font-bold border border-yellow-200">已保存!</div>}
                </div>
             </div>
          </div>
      </div>

      {/* Conclusion Text */}
      <div className="h-24 flex items-center justify-center">
         {step === 'idle' && <p className="text-slate-400">点击“发送照片”开始实验...</p>}
         {step === 'uploaded' && <p className="text-blue-600 font-bold text-lg animate-bounce">照片瞬间传到了服务器和同学那里！</p>}
         {step === 'deleted' && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center animate-in zoom-in">
               <h4 className="font-bold text-red-700 mb-1">删不掉？！</h4>
               <p className="text-sm text-red-600">
                 虽然你删除了自己手机里的照片，但服务器和同学手机里可能还有备份。<br/>
                 所以，<span className="font-black text-lg">发照片前一定要三思！</span>
               </p>
            </div>
         )}
      </div>
    </div>
  );
};

// Sub-component 3: Ethics Checklist
const EthicsLesson: React.FC = () => {
    const [pledges, setPledges] = useState<Record<string, boolean>>({});

    const items = [
        { id: '1', text: '我不随意修改别人的照片来取笑他们。' },
        { id: '2', text: '如果我用了别人的像素画，我会告诉大家这是谁画的（尊重原创）。' },
        { id: '3', text: '我不传播让别人感到难过或生气的图片。' },
        { id: '4', text: '保护隐私，不在网上随意发自己和家人的照片。' },
    ];

    const togglePledge = (id: string) => {
        setPledges(prev => ({...prev, [id]: !prev[id]}));
    };

    const allChecked = items.every(i => pledges[i.id]);

    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-6">数字骑士公约</h3>
            <div className="space-y-4">
                {items.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => togglePledge(item.id)}
                        className={`
                            p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all
                            ${pledges[item.id] ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200 hover:bg-slate-50'}
                        `}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                            ${pledges[item.id] ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300'}
                        `}>
                            {pledges[item.id] && <Smile size={20} />}
                        </div>
                        <span className={`text-lg font-medium ${pledges[item.id] ? 'text-green-800' : 'text-slate-600'}`}>
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>

            {allChecked && (
                <div className="mt-8 text-center animate-in zoom-in">
                    <div className="inline-block p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white shadow-xl rotate-3">
                        <span className="text-4xl">🏅</span>
                    </div>
                    <h4 className="text-2xl font-black text-orange-600 mt-4">恭喜你！</h4>
                    <p className="text-orange-800 font-medium">你已经成为了一名合格的“数字骑士”！</p>
                </div>
            )}
        </div>
    );
};
