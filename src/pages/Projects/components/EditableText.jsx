import React, { useState, useEffect, useRef } from 'react';
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
    const [localValue, setLocalValue] = useState(value);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!isEditing) {
            setLocalValue(value);
        }
    }, [value, isEditing]);

    if (!isAdminPreview) {
        if (multiline && value) {
            return (
                <div className={`prose-custom ${className}`} style={style}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            );
        }
        return <span className={className} style={style}>{value || ""}</span>;
    }
    
    if (multiline) {
        if (!isEditing) {
            return (
                <div 
                    className={`prose-custom cursor-text ${className} ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'} rounded transition-colors min-h-[1.5rem] admin-editable`}
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
                        <span className="opacity-40">{placeholder}</span>
                    )}
                </div>
            );
        }

        return (
            <textarea
                ref={(el) => {
                    textareaRef.current = el;
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
                onBlur={(e) => {
                    setIsEditing(false);
                    const textVal = e.target.value.trim();
                    if (textVal !== value) onSave(textVal);
                    if (onBlur) onBlur(e);
                }}
                onFocus={onFocus}
                placeholder={placeholder}
            />
        );
    }

    const Tag = 'span';
    
    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            onFocus={onFocus}
            onBlur={(e) => {
                const textVal = e.target.innerText.trim();
                if (textVal !== value) onSave(textVal);
                if (onBlur) onBlur(e);
            }}
            className={`${className} cursor-text ${isLight ? 'hover:bg-black/5 focus:bg-black/10' : 'hover:bg-white/5 focus:bg-white/10'} px-2 -mx-2 rounded transition-colors outline-none min-w-[50px] inline-block admin-editable`}
            data-placeholder={placeholder}
            style={style}
        >
            {value}
        </Tag>
    );
};
