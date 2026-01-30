import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download } from 'lucide-react';
import { useButtonMotion } from '../../../../hooks/useButtonMotion';

/**
 * FileDownloadButton component - specific button with motion hook
 */
const FileDownloadButton = ({ file }) => {
    const { ref, onEnter, onLeave, onTap } = useButtonMotion();
    return (
        <a
            ref={ref}
            href={file.path}
            download={file.type === 'file'}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onClick={onTap}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-shadow cursor-pointer shadow-sm"
            style={{
                background: 'rgb(var(--contrast-rgb))',
                color: 'rgb(0,0,0)',
                border: 'none'
            }}
        >
            <Download size={16} />
            <span>{file.label}</span>
        </a>
    );
};

/**
 * ProjectDocumentation component - displays documentation with markdown support and file downloads
 */
const ProjectDocumentation = ({ documentation, documentationFiles = [] }) => {
    // If no documentation and no files, return null or empty
    if (!documentation && (!documentationFiles || documentationFiles.length === 0)) {
        return null;
    }

    return (
        <div className="project-card">
            <div
                className="rounded-2xl p-6 md:p-8"
                style={{
                    background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                    border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                }}
            >
                <div className="card-content max-w-4xl">
                    <h2
                        className="text-2xl font-playfair font-bold mb-6"
                        style={{ color: 'rgb(var(--contrast-rgb))' }}
                    >
                        Documentation
                    </h2>

                    {documentation && (
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ ...props }) => <p className="doc-paragraph mb-4 leading-relaxed" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                    h2: ({ ...props }) => <h2 className="doc-paragraph text-xl font-playfair font-bold mt-8 mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                    h3: ({ ...props }) => <h3 className="doc-paragraph text-lg font-playfair font-bold mt-6 mb-3" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                    ul: ({ ...props }) => <ul className="doc-paragraph list-disc ml-6 mb-4 space-y-2" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                    ol: ({ ...props }) => <ol className="doc-paragraph list-decimal ml-6 mb-4 space-y-2" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                    strong: ({ ...props }) => <strong className="font-bold" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                    code: ({ ...props }) => <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: 'rgba(var(--contrast-rgb), 0.1)', color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                    pre: ({ ...props }) => (
                                        <pre
                                            className="doc-paragraph mb-4 p-4 rounded-lg overflow-x-auto text-sm"
                                            style={{
                                                background: 'rgba(var(--contrast-rgb), 0.05)',
                                                border: '1px solid rgba(var(--contrast-rgb), 0.1)',
                                                maxWidth: '100%'
                                            }}
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {documentation}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Download Buttons / Project Files */}
                    {documentationFiles && documentationFiles.length > 0 && (
                        <div className={`${documentation ? 'mt-12 pt-8 border-t border-[rgba(var(--contrast-rgb),0.1)]' : ''}`}>
                            <h3 className="text-lg font-playfair font-bold mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                                Project Files & Links
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {documentationFiles.map((file, idx) => (
                                    <FileDownloadButton key={idx} file={file} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDocumentation;
