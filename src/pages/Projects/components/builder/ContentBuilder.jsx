import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiImage } from 'react-icons/fi';
import { EditableText } from '../EditableText';
import { LayoutPicker } from './LayoutPicker';
import useThemeStore from '../../../../store/useThemeStore';

const uid = () => 'id-' + Math.random().toString(36).substr(2, 9);

const BLOCK_TYPES = [
    { type: 'text', label: 'Text/Markdown' },
    { type: 'heading', label: 'Heading' },
    { type: 'list', label: 'Bullet List' },
    { type: 'image', label: 'Local Image' },
    { type: 'chips', label: 'Tech Stack/Chips' },
    { type: 'metric', label: 'Metric/Stat' },
    { type: 'link', label: 'Button/Link' }
];

const getGridClass = (layout) => {
    switch(layout) {
        case 'full': return 'grid grid-cols-1';
        case '2-equal': 
        case '2-stack': return 'grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-[clamp(24px,5vw,80px)] items-start';
        case 'left-big': 
        case 'left-stack': return 'grid grid-cols-1 lg:grid-cols-2 cs-grid-left-big gap-y-12 gap-x-[clamp(24px,5vw,80px)] items-start';
        case 'right-big': return 'grid grid-cols-1 lg:grid-cols-2 cs-grid-right-big gap-y-12 gap-x-[clamp(24px,5vw,80px)] items-start';
        default: return 'grid grid-cols-1';
    }
};

const getInitialColumns = (layout) => {
    const colCount = layout === 'full' ? 1 : 2;
    return Array.from({ length: colCount }).map((_, i) => ({
        id: uid(),
        columnTitle: `Column ${i + 1}`,
        blocks: []
    }));
};

const BlockRenderer = ({ block, onChange, onDelete, isAdminPreview, projectId }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    const Wrapper = ({ children }) => (
        <div className="relative group/block mb-4 last:mb-0">
            {children}
            {isAdminPreview && (
                <button 
                    onClick={onDelete}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/block:opacity-100 transition-opacity z-10 shadow-lg"
                    title="Delete Block"
                >
                    ×
                </button>
            )}
        </div>
    );

    if (block.type === 'heading') {
        return (
            <Wrapper>
                <h3 className="cs-heading-sm">
                    <EditableText value={block.content || ''} onSave={v => onChange({ content: v })} isAdminPreview={isAdminPreview} placeholder="Heading text..." />
                </h3>
            </Wrapper>
        );
    }
    
    if (block.type === 'text') {
        return (
            <Wrapper>
                <EditableText 
                    className="cs-detail-body block w-full" 
                    value={block.content || ''} 
                    onSave={v => onChange({ content: v })} 
                    isAdminPreview={isAdminPreview} 
                    multiline={true} 
                    placeholder="Type markdown or text here..." 
                />
            </Wrapper>
        );
    }

    if (block.type === 'list') {
        const items = block.items || [];
        return (
            <Wrapper>
                <ul className={`list-disc pl-4 space-y-1 text-sm ${isLight ? 'text-black/70' : 'text-white/60'}`}>
                    {items.map((item, i) => (
                        <li key={i} className="group/item relative">
                            <EditableText 
                                value={item} 
                                onSave={v => {
                                    const next = [...items]; 
                                    next[i] = v; 
                                    onChange({ items: next }); 
                                }} 
                                isAdminPreview={isAdminPreview} 
                            />
                            {isAdminPreview && (
                                <button onClick={() => onChange({ items: items.filter((_, idx) => idx !== i) })} className="absolute -left-6 top-1 text-red-500 opacity-0 group-hover/item:opacity-100">×</button>
                            )}
                        </li>
                    ))}
                    {isAdminPreview && (
                        <li className="list-none -ml-4 mt-2">
                            <button onClick={() => onChange({ items: [...items, "New Item"] })} className="text-xs opacity-50 hover:opacity-100">+ Add Item</button>
                        </li>
                    )}
                </ul>
            </Wrapper>
        );
    }

    if (block.type === 'chips') {
        const items = block.items || [];
        return (
            <Wrapper>
                <div className="cs-chip-wrap">
                    {items.map((item, i) => (
                        <div key={i} className="relative group/chip">
                            <span className="cs-chip">
                                <EditableText value={item} onSave={v => { const next = [...items]; next[i] = v; onChange({ items: next }); }} isAdminPreview={isAdminPreview} />
                            </span>
                            {isAdminPreview && (
                                <button onClick={() => onChange({ items: items.filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/chip:opacity-100 transition-opacity">×</button>
                            )}
                        </div>
                    ))}
                    {isAdminPreview && (
                        <button onClick={() => onChange({ items: [...items, "New Tag"] })} className="cs-chip border-dashed opacity-50 hover:opacity-100">+ Add</button>
                    )}
                </div>
            </Wrapper>
        );
    }

    if (block.type === 'metric') {
        return (
            <Wrapper>
                <div className="flex flex-col">
                    <p className="cs-score-label mb-1">
                        <EditableText value={block.label || 'Label'} onSave={v => onChange({ label: v })} isAdminPreview={isAdminPreview} placeholder="Metric Label" />
                    </p>
                    <p className="cs-score-value text-3xl font-bold">
                        <EditableText value={block.value || '0'} onSave={v => onChange({ value: v })} isAdminPreview={isAdminPreview} placeholder="Value" />
                    </p>
                </div>
            </Wrapper>
        );
    }

    if (block.type === 'link') {
        return (
            <Wrapper>
                <div className="flex flex-col gap-3 items-start">
                    <a 
                        href={isAdminPreview ? undefined : (block.url || '#')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cs-link-btn"
                        onClick={e => isAdminPreview && e.preventDefault()}
                    >
                        <EditableText 
                            value={block.label || 'Link Text'} 
                            onSave={v => onChange({ label: v })} 
                            isAdminPreview={isAdminPreview} 
                            placeholder="Link Text"
                        />
                    </a>
                    {isAdminPreview && (
                        <input
                            type="text"
                            value={block.url || ''}
                            onChange={e => onChange({ url: e.target.value })}
                            placeholder="Enter URL (https://...)"
                            className={`w-full max-w-sm px-3 py-1.5 text-xs rounded border ${isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/5 border-white/10 text-white'}`}
                        />
                    )}
                </div>
            </Wrapper>
        );
    }

    if (block.type === 'image') {
        const [uploading, setUploading] = useState(false);

        const handleImageUpload = async (e) => {
            const file = e.target.files?.[0];
            if (!file || !projectId) return;
            
            try {
                setUploading(true);
                const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=${projectId}&type=imgs`, {
                    method: 'POST', body: file
                });
                const data = await res.json();
                if (data.ok) {
                    onChange({ src: data.url });
                }
            } catch (err) {
                console.error("Upload failed", err);
            } finally {
                setUploading(false);
                e.target.value = '';
            }
        };

        return (
            <Wrapper>
                {block.src ? (
                    <img src={block.src} alt="Block media" className="cs-media-thumb w-full rounded-xl" />
                ) : (
                    <div className="w-full aspect-video bg-black/5 rounded-xl border border-dashed border-black/10 flex items-center justify-center">
                        <span className="opacity-40 text-sm">Image Placeholder</span>
                    </div>
                )}
                {isAdminPreview && (
                    <div className="mt-2 flex gap-2 w-full">
                        <label className={`cursor-pointer flex-1 text-center px-4 py-2 rounded text-xs font-bold transition-colors ${
                            isLight 
                                ? 'bg-black/5 hover:bg-black/10 text-black/70' 
                                : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}>
                            {uploading ? 'Uploading...' : (block.src ? 'Change Image' : 'Upload Image')}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                disabled={uploading}
                            />
                        </label>
                        {block.src && (
                            <button 
                                onClick={async () => {
                                    if (block.src.startsWith('/assets/uploads/')) {
                                        try {
                                            await fetch(`/__delete-upload?path=${encodeURIComponent(block.src)}`, { method: 'DELETE' });
                                        } catch(e) {}
                                    }
                                    onChange({ src: '' });
                                }}
                                className="px-4 py-2 rounded text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                )}
            </Wrapper>
        );
    }

    return null;
};

export const ContentBuilder = ({ sections = [], onUpdateSections, isAdminPreview = false, projectId }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [showPicker, setShowPicker] = useState(false);

    const updateSection = (sIdx, updater) => {
        const next = [...sections];
        next[sIdx] = { ...next[sIdx], ...updater };
        onUpdateSections(next);
    };

    const addSection = (layoutId) => {
        const newSection = {
            id: uid(),
            sectionTitle: 'New Section',
            layout: layoutId,
            columns: getInitialColumns(layoutId)
        };
        onUpdateSections([...sections, newSection]);
        setShowPicker(false);
    };

    const removeSection = async (sIdx) => {
        const section = sections[sIdx];
        if (section.columns) {
            for (const col of section.columns) {
                if (col.blocks) {
                    for (const block of col.blocks) {
                        if (block.type === 'image' && block.src && block.src.startsWith('/assets/uploads/')) {
                            try {
                                await fetch(`/__delete-upload?path=${encodeURIComponent(block.src)}`, { method: 'DELETE' });
                            } catch (e) {}
                        }
                    }
                }
            }
        }
        onUpdateSections(sections.filter((_, i) => i !== sIdx));
    };

    const moveSection = (sIdx, dir) => {
        if (sIdx + dir < 0 || sIdx + dir >= sections.length) return;
        const next = [...sections];
        const temp = next[sIdx];
        next[sIdx] = next[sIdx + dir];
        next[sIdx + dir] = temp;
        onUpdateSections(next);
    };

    const updateColumn = (sIdx, cIdx, updater) => {
        const nextCols = [...sections[sIdx].columns];
        nextCols[cIdx] = { ...nextCols[cIdx], ...updater };
        updateSection(sIdx, { columns: nextCols });
    };

    const addBlock = (sIdx, cIdx, type) => {
        const nextCols = [...sections[sIdx].columns];
        nextCols[cIdx].blocks = [...(nextCols[cIdx].blocks || []), { id: uid(), type }];
        updateSection(sIdx, { columns: nextCols });
    };

    const updateBlock = (sIdx, cIdx, bIdx, updater) => {
        const nextCols = [...sections[sIdx].columns];
        const nextBlocks = [...nextCols[cIdx].blocks];
        nextBlocks[bIdx] = { ...nextBlocks[bIdx], ...updater };
        nextCols[cIdx].blocks = nextBlocks;
        updateSection(sIdx, { columns: nextCols });
    };

    const removeBlock = async (sIdx, cIdx, bIdx) => {
        const nextCols = [...sections[sIdx].columns];
        const blockToRemove = nextCols[cIdx].blocks[bIdx];
        
        if (blockToRemove && blockToRemove.type === 'image' && blockToRemove.src && blockToRemove.src.startsWith('/assets/uploads/')) {
            try {
                await fetch(`/__delete-upload?path=${encodeURIComponent(blockToRemove.src)}`, { method: 'DELETE' });
            } catch (e) {}
        }

        nextCols[cIdx].blocks = nextCols[cIdx].blocks.filter((_, i) => i !== bIdx);
        updateSection(sIdx, { columns: nextCols });
    };

    return (
        <div className="cs-builder-root flex flex-col gap-12 mt-12 mb-12">
            {sections.map((section, sIdx) => (
                <section key={section.id} className="cs-shell cs-story cs-animate relative group/section max-w-5xl mx-auto w-full">
                    
                    {/* Admin Section Controls */}
                    {isAdminPreview && (
                        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
                            <button onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/10 text-black hover:bg-black/20 disabled:opacity-30"><FiArrowUp size={14}/></button>
                            <button onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/10 text-black hover:bg-black/20 disabled:opacity-30"><FiArrowDown size={14}/></button>
                            <div className="h-4" />
                            <button onClick={() => removeSection(sIdx)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200"><FiTrash2 size={14}/></button>
                        </div>
                    )}

                    {/* Section Title */}
                    <h2 className="cs-heading mb-6">
                        <EditableText 
                            value={section.sectionTitle} 
                            onSave={v => updateSection(sIdx, { sectionTitle: v })} 
                            isAdminPreview={isAdminPreview} 
                            placeholder="Section Title"
                        />
                    </h2>

                    <div className={getGridClass(section.layout)}>
                        {(section.columns || []).map((col, cIdx) => (
                            <div key={col.id} className="cs-detail-col flex-1 flex flex-col">
                                {col.columnTitle && (
                                    <h3 className="cs-heading-sm mb-4">
                                        <EditableText 
                                            value={col.columnTitle} 
                                            onSave={v => updateColumn(sIdx, cIdx, { columnTitle: v })} 
                                            isAdminPreview={isAdminPreview} 
                                            placeholder="Column Title"
                                        />
                                    </h3>
                                )}
                                
                                <div className="flex flex-col gap-4">
                                    {(col.blocks || []).map((block, bIdx) => (
                                        <BlockRenderer 
                                            key={block.id} 
                                            block={block} 
                                            onChange={updater => updateBlock(sIdx, cIdx, bIdx, updater)} 
                                            onDelete={() => removeBlock(sIdx, cIdx, bIdx)}
                                            isAdminPreview={isAdminPreview} 
                                            projectId={projectId}
                                        />
                                    ))}
                                </div>

                                {isAdminPreview && (
                                    <div className="mt-6 pt-4 border-t border-dashed border-black/10 flex flex-nowrap overflow-x-auto gap-2 pb-2">
                                        {BLOCK_TYPES.map(bt => (
                                            <button 
                                                key={bt.type}
                                                onClick={() => addBlock(sIdx, cIdx, bt.type)}
                                                className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                                    isLight ? 'bg-black/5 hover:bg-black/10 text-black/60' : 'bg-white/5 hover:bg-white/10 text-white/60'
                                                }`}
                                            >
                                                + {bt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {/* Add Section Button */}
            {isAdminPreview && (
                <div className="cs-shell pb-12">
                    <button 
                        onClick={() => setShowPicker(true)} 
                        className={`w-full py-6 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all text-sm font-mono uppercase tracking-widest ${
                            isLight 
                                ? 'bg-black/5 border-black/10 text-black/40 hover:border-black/30 hover:bg-black/10 hover:text-black/80' 
                                : 'bg-white/5 border-white/10 text-white/30 hover:border-[#c8ff3e]/40 hover:text-[#c8ff3e] hover:bg-white/10'
                        }`}
                    >
                        <FiPlus size={20} /> Add New Section
                    </button>
                </div>
            )}

            {showPicker && <LayoutPicker onSelect={addSection} onCancel={() => setShowPicker(false)} />}
        </div>
    );
};
