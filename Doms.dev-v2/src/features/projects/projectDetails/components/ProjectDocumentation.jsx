import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * ProjectDocumentation component - displays documentation with markdown support and file downloads
 */
const ProjectDocumentation = ({ documentation, documentationFiles = [] }) => {
    const buttonsRef = useRef([]);
    const containerRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const handleHover = contextSafe((target) => {
        gsap.to(target, {
            rotation: -2,
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    const handleLeave = contextSafe((target) => {
        gsap.to(target, {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    return (
        <div ref={containerRef} className="project-card md:col-span-12">
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

                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ node, ...props }) => <p className="doc-paragraph mb-4 leading-relaxed" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                h2: ({ node, ...props }) => <h2 className="doc-paragraph text-xl font-playfair font-bold mt-8 mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                h3: ({ node, ...props }) => <h3 className="doc-paragraph text-lg font-playfair font-bold mt-6 mb-3" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                ul: ({ node, ...props }) => <ul className="doc-paragraph list-disc ml-6 mb-4 space-y-2" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                ol: ({ node, ...props }) => <ol className="doc-paragraph list-decimal ml-6 mb-4 space-y-2" style={{ color: 'rgba(var(--contrast-rgb), 0.8)' }} {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold" style={{ color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                code: ({ node, ...props }) => <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: 'rgba(var(--contrast-rgb), 0.1)', color: 'rgb(var(--contrast-rgb))' }} {...props} />,
                                pre: ({ node, ...props }) => (
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
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto mb-4">
                                        <table
                                            className="min-w-full text-sm"
                                            style={{
                                                color: 'rgba(var(--contrast-rgb), 0.9)',
                                                borderCollapse: 'collapse'
                                            }}
                                            {...props}
                                        />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => (
                                    <thead
                                        style={{
                                            borderBottom: '2px solid rgba(var(--contrast-rgb), 0.2)'
                                        }}
                                        {...props}
                                    />
                                ),
                                th: ({ node, ...props }) => (
                                    <th
                                        className="px-4 py-2 text-left font-bold"
                                        style={{
                                            color: 'rgb(var(--contrast-rgb))'
                                        }}
                                        {...props}
                                    />
                                ),
                                td: ({ node, ...props }) => (
                                    <td
                                        className="px-4 py-2"
                                        style={{
                                            borderTop: '1px solid rgba(var(--contrast-rgb), 0.1)'
                                        }}
                                        {...props}
                                    />
                                )
                            }}
                        >
                            {documentation}
                        </ReactMarkdown>
                    </div>

                    {/* Download Buttons */}
                    {documentationFiles && documentationFiles.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-[rgba(var(--contrast-rgb),0.1)]">
                            <h3 className="text-lg font-playfair font-bold mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                                Project Files
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {documentationFiles.map((file, idx) => (
                                    <a
                                        key={idx}
                                        ref={(el) => (buttonsRef.current[idx] = el)}
                                        href={file.path}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onMouseEnter={() => handleHover(buttonsRef.current[idx])}
                                        onMouseLeave={() => handleLeave(buttonsRef.current[idx])}
                                        onTouchStart={() => handleHover(buttonsRef.current[idx])}
                                        onTouchEnd={() => handleLeave(buttonsRef.current[idx])}
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
