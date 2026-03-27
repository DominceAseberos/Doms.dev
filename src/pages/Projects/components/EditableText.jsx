import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useThemeStore from '../../../store/useThemeStore';

export const EditableText = ({ 
    value, 
    onSave, 
    isAdminPreview = false, 
    className = "", 
    multiline = false, 
    placeholder = "Click to edit...",
    style = {},
    onFocus = null,
    onBlur = null
}) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");
    const inputRef = useRef(null);

    useEffect(() => {
        if (!isEditing) {
            setLocalValue(value || "");
        }
    }, [value, isEditing]);

    const valueRef = useRef(value || "");
    useEffect(() => {
        valueRef.current = localValue;
    }, [localValue]);

    const formatSelection = useCallback((type) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentText = valueRef.current;
        
        const selectedText = currentText.substring(start, end);
        const tag = type === 'bold' ? '**' : '*';
        const wrapped = `${tag}${selectedText}${tag}`;
        const newValue = currentText.substring(0, start) + wrapped + currentText.substring(end);
        
        setLocalValue(newValue);
        onSave(newValue);
        
        // Restore focus and selection
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(start + tag.length, end + tag.length);
            }
        }, 10);
    }, [onSave]);

    useEffect(() => {
        if (isEditing && window.__activeEditable) {
            window.__activeEditable.formatSelection = formatSelection;
        }
    }, [isEditing, formatSelection]);

    const handleFocus = (e) => {
        window.__activeEditable = { formatSelection };
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        // Only clear if it's OURS
        if (window.__activeEditable && window.__activeEditable.formatSelection === formatSelection) {
            // Delay clearing to allow toolbar button clicks
            setTimeout(() => {
                if (window.__activeEditable && window.__activeEditable.formatSelection === formatSelection) {
                    window.__activeEditable = null;
                }
            }, 300);
        }
        setIsEditing(false);
        const textVal = e.target.value.trim();
        if (textVal !== value) onSave(textVal);
        if (onBlur) onBlur(e);
    };

    // Public / Non-Admin view
    if (!isAdminPreview) {
        return (
            <div className={`prose-custom inline-block ${className}`} style={style}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value || ""}
                </ReactMarkdown>
            </div>
        );
    }
    
    // Admin Preview (Not editing)
    if (!isEditing) {
        return (
            <div 
                className={`prose-custom cursor-text ${className} ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'} rounded transition-shadow min-h-[1.5rem] admin-editable inline-block w-full`}
                style={style}
                onClick={() => {
                    setIsEditing(true);
                    setLocalValue(value || "");
                    if (onFocus) onFocus();
                }}
            >
                {value ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                ) : (
                    <span className="opacity-40 italic">{placeholder}</span>
                )}
            </div>
        );
    }

    // Admin Edit (Active)
    if (multiline) {
        return (
            <textarea
                ref={(el) => {
                    inputRef.current = el;
                    if (el) {
                        el.style.height = 'auto';
                        el.style.height = el.scrollHeight + 'px';
                    }
                }}
                autoFocus
                className={`${className} cursor-text bg-transparent border-none outline-none resize-none w-full whitespace-pre-wrap outline focus:outline-2 ${isLight ? 'focus:outline-black/20 focus:bg-black/5' : 'focus:outline-white/20 focus:bg-white/5'} px-2 -mx-2 min-h-[1.5rem] rounded`}
                style={{ ...style, minHeight: '50px' }}
                value={localValue}
                onChange={(e) => {
                    setLocalValue(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
            />
        );
    }

    return (
        <input
            ref={inputRef}
            autoFocus
            type="text"
            className={`${className} cursor-text bg-transparent border-none outline-none w-full outline focus:outline-2 ${isLight ? 'focus:outline-black/20 focus:bg-black/5' : 'focus:outline-white/20 focus:bg-white/5'} px-2 -mx-2 rounded`}
            style={style}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={(e) => {
                if (e.key === 'Enter') e.target.blur();
            }}
            placeholder={placeholder}
        />
    );
};
