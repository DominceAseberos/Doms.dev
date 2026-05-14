import React, { useState, useEffect, useRef } from 'react';
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
    { type: 'link', label: 'Button/Link' },
    { type: 'color-palette', label: 'Color Palette' },
    { type: 'font-preview', label: 'Font Preview' }
];

const getGridClass = (layout) => {
    switch (layout) {
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

const getFontStyle = (b) => {
    const styles = {};
    if (!b) return styles;
    if (b.fontSize) {
        const sizes = {
            'xs': '0.75rem',
            'sm': '0.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
        };
        styles.fontSize = sizes[b.fontSize] || b.fontSize;
    }
    if (b.fontWeight) styles.fontWeight = b.fontWeight;
    if (b.fontStyle) styles.fontStyle = b.fontStyle;
    if (b.color) styles.color = b.color;
    return styles;
};

const ToolbarWrapper = ({ children, block, onChange, onDelete, isAdminPreview, isLight, activeBlockId, id }) => {
    const [localColor, setLocalColor] = useState(block.color || (isLight ? '#000000' : '#ffffff'));
    const timeoutRef = useRef(null);

    useEffect(() => {
        setLocalColor(block.color || (isLight ? '#000000' : '#ffffff'));
    }, [block.color, isLight]);

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setLocalColor(newColor);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onChange({ color: newColor });
        }, 150);
    };

    const handleFormat = (type) => {
        if (window.__activeEditable && window.__activeEditable.formatSelection) {
            window.__activeEditable.formatSelection(type);
        } else {
            // Fallback to block-level styling
            if (type === 'bold') {
                onChange({ fontWeight: block.fontWeight === 'bold' ? 'normal' : 'bold' });
            } else if (type === 'italic') {
                onChange({ fontStyle: block.fontStyle === 'italic' ? 'normal' : 'italic' });
            }
        }
    };

    return (
        <div className="relative mb-4 last:mb-0 group/blockwrapper">
            {children}
            {isAdminPreview && (
                <>
                    <div className={`absolute -top-12 -right-2 flex items-center gap-1 transition-all z-30 ${activeBlockId === id ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-2'}`}>
                        {(block.type === 'heading' || block.type === 'text' || block.type === 'section-title' || block.type === 'column-title' || block.type === 'list') && (
                            <div className={`p-1.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-1.5 border-2 backdrop-blur-md ${isLight ? 'bg-white/90 border-black/10' : 'bg-[#1a1a1a]/90 border-white/20'}`}>
                                <select 
                                    value={block.fontSize || 'base'}
                                    onChange={(e) => onChange({ fontSize: e.target.value })}
                                    className="bg-transparent text-[10px] font-bold outline-none cursor-pointer px-1"
                                >
                                    <option value="xs">XS</option>
                                    <option value="sm">SM</option>
                                    <option value="base">BASE</option>
                                    <option value="lg">LG</option>
                                    <option value="xl">XL</option>
                                    <option value="2xl">2XL</option>
                                    <option value="3xl">3XL</option>
                                </select>
                                <div className={`w-px h-3 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
                                <button 
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }}
                                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-colors ${block.fontWeight === 'bold' ? (isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black') : 'hover:bg-black/5'}`}
                                >
                                    B
                                </button>
                                <button 
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }}
                                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] italic transition-colors ${block.fontStyle === 'italic' ? (isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black') : 'hover:bg-black/5'}`}
                                >
                                    I
                                </button>
                                <div className={`w-px h-3 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
                                <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                                    <input 
                                        type="color" 
                                        value={localColor}
                                        onChange={handleColorChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <div 
                                        className="w-4 h-4 rounded shadow-sm border border-black/10 pointer-events-none" 
                                        style={{ backgroundColor: localColor }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {onDelete && (
                        <button 
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="absolute right-0 top-0 -mt-4 -mr-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 hover:scale-110 transition-all z-[35] border-2 border-white/20"
                            title="Delete Block Entirely"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const BlockRenderer = ({ block, onChange, onDelete, isAdminPreview, projectId, activeBlockId, onFocus, onBlur }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    if (block.type === 'heading') {
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <h3 className="cs-heading-sm">
                    <EditableText 
                        value={block.content || ''} 
                        onSave={v => onChange({ content: v })} 
                        isAdminPreview={isAdminPreview} 
                        placeholder="Heading text..." 
                        style={getFontStyle(block)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </h3>
            </ToolbarWrapper>
        );
    }
    
    if (block.type === 'text') {
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <EditableText 
                    className="cs-detail-body block w-full" 
                    value={block.content || ''} 
                    onSave={v => onChange({ content: v })} 
                    isAdminPreview={isAdminPreview} 
                    multiline={true} 
                    placeholder="Type markdown or text here..." 
                    style={getFontStyle(block)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </ToolbarWrapper>
        );
    }

    if (block.type === 'list') {
        const items = block.items || [];
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <ul className={`list-disc pl-5 space-y-2 text-sm ${isLight ? 'text-black/70' : 'text-white/60'}`} style={getFontStyle(block)}>
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
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {isAdminPreview && (
                                <button 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onChange({ items: items.filter((_, idx) => idx !== i) }); }} 
                                    className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-20 group-hover/item:opacity-100 hover:scale-110 transition-all shadow-md z-[30]"
                                    title="Delete Item"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            )}
                        </li>
                    ))}
                    {isAdminPreview && (
                        <li className="list-none pt-2">
                            <button 
                                onClick={() => onChange({ items: [...items, "New Item"] })} 
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-2 border-dashed transition-all ${
                                    isLight ? 'border-black/10 text-black/40 hover:border-black/30 hover:text-black/60' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
                                }`}
                            >
                                + Add Point
                            </button>
                        </li>
                    )}
                </ul>
            </ToolbarWrapper>
        );
    }

    if (block.type === 'chips') {
        const items = block.items || [];
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <div className="cs-chip-wrap">
                    {items.map((item, i) => (
                        <div key={i} className="relative group/chip">
                            <span className="cs-chip px-4 py-2">
                                <EditableText value={item} onSave={v => { const next = [...items]; next[i] = v; onChange({ items: next }); }} isAdminPreview={isAdminPreview} />
                            </span>
                            {isAdminPreview && (
                                <button 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onChange({ items: items.filter((_, idx) => idx !== i) }); }} 
                                    className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-40 group-hover/chip:opacity-100 hover:scale-110 transition-all z-[30]"
                                    title="Remove Chip"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {isAdminPreview && (
                        <button 
                            onClick={() => onChange({ items: [...items, "New Tag"] })} 
                            className={`cs-chip px-4 py-2 border-2 border-dashed transition-all ${
                                isLight ? 'border-black/10 text-black/40 hover:border-black/30 hover:text-black/60' : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                            }`}
                        >
                            + Add Tech
                        </button>
                    )}
                </div>
            </ToolbarWrapper>
        );
    }

    if (block.type === 'metric') {
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <div className="flex flex-col">
                    <p className="cs-score-label mb-1">
                        <EditableText value={block.label || 'Label'} onSave={v => onChange({ label: v })} isAdminPreview={isAdminPreview} placeholder="Metric Label" />
                    </p>
                    <p className="cs-score-value text-3xl font-bold">
                        <EditableText value={block.value || '0'} onSave={v => onChange({ value: v })} isAdminPreview={isAdminPreview} placeholder="Value" />
                    </p>
                </div>
            </ToolbarWrapper>
        );
    }

    if (block.type === 'link') {
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
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
            </ToolbarWrapper>
        );
    }

    if (block.type === 'color-palette') {
        const colors = block.colors || [];
        const [copiedIdx, setCopiedIdx] = useState(null);

        const getTextColor = (hex) => {
            try {
                const c = hex.replace('#', '');
                const r = parseInt(c.substring(0, 2), 16);
                const g = parseInt(c.substring(2, 4), 16);
                const b = parseInt(c.substring(4, 6), 16);
                return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111111' : '#ffffff';
            } catch { return '#111111'; }
        };

        const handleCopy = (color, i) => {
            navigator.clipboard.writeText(color).then(() => {
                setCopiedIdx(i);
                setTimeout(() => setCopiedIdx(null), 1800);
            });
        };

        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <div className="w-full overflow-hidden rounded-xl border border-black/10">
                    {/* Swatch strips */}
                    <div className="flex w-full" style={{ minHeight: 140 }}>
                        {colors.map((color, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleCopy(color, i)}
                                className="relative flex-1 flex items-center justify-center transition-all duration-200 hover:flex-[1.2] group/sw"
                                style={{ backgroundColor: color, minHeight: 140 }}
                                title={`Click to copy ${color}`}
                            >
                                <span
                                    className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold tracking-widest uppercase transition-opacity duration-150 ${copiedIdx === i ? 'opacity-100' : 'opacity-0 group-hover/sw:opacity-50'}`}
                                    style={{ color: getTextColor(color), background: 'rgba(0,0,0,0.06)' }}
                                >
                                    {copiedIdx === i ? 'Copied!' : 'Copy'}
                                </span>
                                {isAdminPreview && (
                                    <button
                                        type="button"
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => { e.stopPropagation(); onChange({ colors: colors.filter((_, idx) => idx !== i) }); }}
                                        className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover/sw:opacity-100 transition-all z-10"
                                    >×</button>
                                )}
                            </button>
                        ))}
                        {isAdminPreview && (
                            <div className="relative flex-none w-12 flex items-center justify-center bg-black/5 border-l border-black/10 group/add">
                                <input
                                    type="color"
                                    defaultValue="#000000"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    onBlur={e => {
                                        const val = e.target.value;
                                        if (val) onChange({ colors: [...colors, val] });
                                    }}
                                    title="Pick color to add"
                                />
                                <span className="text-lg text-black/30 group-hover/add:text-black/60 pointer-events-none select-none">+</span>
                            </div>
                        )}
                    </div>
                    {/* Hex labels */}
                    <div className="flex w-full bg-white border-t border-black/8">
                        {colors.map((color, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleCopy(color, i)}
                                className="flex-1 py-2.5 px-1 text-center font-mono text-[11px] font-semibold tracking-wider text-[#111] hover:bg-black/5 transition-colors"
                                title="Click to copy"
                            >
                                {color.toUpperCase()}
                            </button>
                        ))}
                        {isAdminPreview && <div className="flex-none w-12" />}
                    </div>
                </div>
            </ToolbarWrapper>
        );
    }

    if (block.type === 'font-preview') {
        const fonts = block.fonts || [];
        const SAMPLE = 'Aa Bb Cc — The quick brown fox';
        return (
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
                <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-black/10 w-full">
                    {fonts.map((f, i) => (
                        <div
                            key={i}
                            className={`group/font relative flex flex-col gap-1 px-5 py-4 ${i > 0 ? 'border-t border-black/8' : ''}`}
                            style={{ backgroundColor: isLight ? '#fff' : '#111' }}
                        >
                            {/* Font name label */}
                            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50" style={{ color: isLight ? '#111' : '#fff' }}>
                                {f.name}
                            </span>
                            {/* Sample text rendered in the actual font */}
                            <span
                                className="leading-tight"
                                style={{ fontFamily: f.family, color: isLight ? '#111' : '#fff', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                            >
                                {f.sample || SAMPLE}
                            </span>
                            {/* Role / usage note */}
                            {f.role && (
                                <span className="font-mono text-[10px] opacity-40 mt-0.5" style={{ color: isLight ? '#111' : '#fff' }}>
                                    {f.role}
                                </span>
                            )}
                            {/* Admin controls */}
                            {isAdminPreview && (
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/font:opacity-100 transition-all">
                                    <button
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => { e.stopPropagation(); onChange({ fonts: fonts.filter((_, idx) => idx !== i) }); }}
                                        className="w-6 h-6 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
                                    >×</button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isAdminPreview && (
                        <div className={`p-3 border-t border-black/8 flex flex-col gap-2 ${isLight ? 'bg-black/3' : 'bg-white/3'}`}>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Add Font</p>
                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    id={`fn-name-${block.id}`}
                                    className={`px-2 py-1 text-xs rounded border ${isLight ? 'bg-white border-black/10 text-black' : 'bg-black/40 border-white/10 text-white'}`}
                                    placeholder="Name (e.g. Playfair Display)"
                                />
                                <input
                                    id={`fn-family-${block.id}`}
                                    className={`px-2 py-1 text-xs rounded border ${isLight ? 'bg-white border-black/10 text-black' : 'bg-black/40 border-white/10 text-white'}`}
                                    placeholder="CSS family (e.g. 'Playfair Display')"
                                />
                                <input
                                    id={`fn-role-${block.id}`}
                                    className={`px-2 py-1 text-xs rounded border ${isLight ? 'bg-white border-black/10 text-black' : 'bg-black/40 border-white/10 text-white'}`}
                                    placeholder="Usage (e.g. Display headings)"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const name   = document.getElementById(`fn-name-${block.id}`)?.value?.trim();
                                    const family = document.getElementById(`fn-family-${block.id}`)?.value?.trim();
                                    const role   = document.getElementById(`fn-role-${block.id}`)?.value?.trim();
                                    if (!name || !family) return;
                                    onChange({ fonts: [...fonts, { name, family, role }] });
                                    ['name','family','role'].forEach(k => { const el = document.getElementById(`fn-${k}-${block.id}`); if(el) el.value=''; });
                                }}
                                className={`self-start px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${isLight ? 'bg-black text-white hover:bg-black/80' : 'bg-[#c8ff3e] text-black hover:bg-white'}`}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            </ToolbarWrapper>
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
            <ToolbarWrapper block={block} onChange={onChange} onDelete={onDelete} id={block.id} isAdminPreview={isAdminPreview} isLight={isLight} activeBlockId={activeBlockId}>
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
            </ToolbarWrapper>
        );
    }

    return null;
};

export const ContentBuilder = ({ sections = [], onUpdateSections, isAdminPreview = false, projectId }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [showPicker, setShowPicker] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState(null);

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
                        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity z-10">
                            <button onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/10 text-black hover:bg-black/20 disabled:opacity-30"><FiArrowUp size={14}/></button>
                            <button onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/10 text-black hover:bg-black/20 disabled:opacity-30"><FiArrowDown size={14}/></button>
                            <div className="h-4" />
                            <button onClick={() => removeSection(sIdx)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200"><FiTrash2 size={14}/></button>
                        </div>
                    )}

                    {/* Section Title */}
                    <ToolbarWrapper 
                        id={`section-title-${section.id}`}
                        block={{ type: 'section-title', ...section.sectionTitleStyle }}
                        onChange={updater => updateSection(sIdx, { sectionTitleStyle: { ...(section.sectionTitleStyle || {}), ...updater } })}
                        isAdminPreview={isAdminPreview}
                        isLight={isLight}
                        activeBlockId={activeBlockId}
                    >
                        <h2 className="cs-heading mb-6">
                            <EditableText 
                                value={section.sectionTitle} 
                                onSave={v => updateSection(sIdx, { sectionTitle: v })} 
                                isAdminPreview={isAdminPreview} 
                                placeholder="Section Title"
                                onFocus={() => setActiveBlockId(`section-title-${section.id}`)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setActiveBlockId(prev => prev === `section-title-${section.id}` ? null : prev);
                                    }, 200);
                                }}
                                style={getFontStyle(section.sectionTitleStyle || {})}
                            />
                        </h2>
                    </ToolbarWrapper>

                    <div className={getGridClass(section.layout)}>
                        {(section.columns || []).map((col, cIdx) => (
                            <div key={col.id} className="cs-detail-col flex-1 flex flex-col">
                                {col.columnTitle && (
                                    <ToolbarWrapper 
                                        id={`column-title-${col.id}`}
                                        block={{ type: 'column-title', ...col.columnTitleStyle }}
                                        onChange={updater => updateColumn(sIdx, cIdx, { columnTitleStyle: { ...(col.columnTitleStyle || {}), ...updater } })}
                                        isAdminPreview={isAdminPreview}
                                        isLight={isLight}
                                        activeBlockId={activeBlockId}
                                    >
                                        <h3 className="cs-heading-sm mb-4">
                                            <EditableText 
                                                value={col.columnTitle} 
                                                onSave={v => updateColumn(sIdx, cIdx, { columnTitle: v })} 
                                                isAdminPreview={isAdminPreview} 
                                                placeholder="Column Title"
                                                onFocus={() => setActiveBlockId(`column-title-${col.id}`)}
                                                onBlur={() => {
                                                    setTimeout(() => {
                                                        setActiveBlockId(prev => prev === `column-title-${col.id}` ? null : prev);
                                                    }, 200);
                                                }}
                                                style={getFontStyle(col.columnTitleStyle || {})}
                                            />
                                        </h3>
                                    </ToolbarWrapper>
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
                                            activeBlockId={activeBlockId}
                                            onFocus={() => setActiveBlockId(block.id)}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    setActiveBlockId(prev => prev === block.id ? null : prev);
                                                }, 200);
                                            }}
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
