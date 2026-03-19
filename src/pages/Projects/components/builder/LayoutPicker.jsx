import React from 'react';
import useThemeStore from '../../../../store/useThemeStore';

const LAYOUT_OPTIONS = [
    { id: 'full', label: 'Full Width', preview: '[───────────────]' },
    { id: '2-equal', label: '2 Equal Columns', preview: '[──────][──────]' },
    { id: '2-stack', label: '2 Stack Columns', preview: '[stack ][stack ]' },
    { id: 'left-big', label: 'Left Big', preview: '[────────][────]' },
    { id: 'right-big', label: 'Right Big', preview: '[────][────────]' },
    { id: 'left-stack', label: 'Left + Right Stack', preview: '[──────][stack ]' }
];

export const LayoutPicker = ({ onSelect, onCancel }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl ${isLight ? 'bg-white' : 'bg-[#1a1a1a]'}`}>
                <h3 className="text-xl font-bold mb-4">Choose Section Layout</h3>
                <div className="grid grid-cols-2 gap-4">
                    {LAYOUT_OPTIONS.map(lo => (
                        <button
                            key={lo.id}
                            onClick={() => onSelect(lo.id)}
                            className={`p-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all text-sm font-mono hover:scale-[1.02] ${
                                isLight 
                                    ? 'bg-black/5 border-black/10 hover:border-black/30 text-black/80' 
                                    : 'bg-white/5 border-white/10 hover:border-[#c8ff3e] hover:text-[#c8ff3e] text-white/80'
                            }`}
                        >
                            <span className="opacity-50 tracking-widest">{lo.preview}</span>
                            <span>{lo.label}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onCancel} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${isLight ? 'bg-black/10 text-black hover:bg-black/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
