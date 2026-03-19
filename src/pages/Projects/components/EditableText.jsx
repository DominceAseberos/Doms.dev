import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useThemeStore from '../../../store/useThemeStore';

export const EditableText = ({ 
    value, 
    onSave, 
    isAdminPreview = false, 
    className = "", 
    multiline = false, 
    placeholder = "Click to edit..." 
}) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    if (!isAdminPreview) {
        if (multiline && value) {
            return (
                <div className={`prose-custom ${className}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            );
        }
        return <span className={className}>{value || ""}</span>;
    }
    
    const Tag = multiline ? 'div' : 'span';
    
    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
                const nextValue = e.target.innerText.trim();
                const textVal = multiline ? e.target.innerText : nextValue;
                if (textVal !== value) onSave(textVal);
            }}
            className={`${className} cursor-text ${isLight ? 'hover:bg-black/5 focus:bg-black/10' : 'hover:bg-white/5 focus:bg-white/10'} px-2 -mx-2 rounded transition-colors outline-none min-w-[50px] ${multiline ? 'block whitespace-pre-wrap' : 'inline-block'} admin-editable`}
            data-placeholder={placeholder}
        >
            {value}
        </Tag>
    );
};
