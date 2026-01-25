import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../features/projects/data/dataProjects.json';

gsap.registerPlugin(ScrollTrigger);

// Stack icons mapping (reused from ProjectCard)
const stackIcons = {
    'React': '⚛️',
    'Python': '🐍',
    'Flask': '🌶️',
    'OpenCV': '👁️',
    'Tailwind CSS': '🎨',
    'Tailwind': '🎨',
    'GSAP': '🎬',
    'Supabase': '🔥',
    'Lucide': '🔷',
    'Vite': '⚡',
    'NLP': '🧠',
    'API': '🔌'
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projectData.find(p => p.id === id);

    const containerRef = useRef(null);
    const carouselRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // SEO - Dynamic Meta Tags
    useEffect(() => {
        if (project) {
            document.title = `${project.title} | Domince A. Aseberos`;

            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', project.shortDescription);
            }
        }

        // Cleanup on unmount
        return () => {
            document.title = 'Domince A. Aseberos - Portfolio';
        };
    }, [project]);

    // GSAP Animations
    useGSAP(() => {
        if (!containerRef.current) return;

        // 1. Staggered card entrance
        gsap.from(".project-card", {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
                document.querySelectorAll('.project-card').forEach(el => {
                    el.classList.add('animation-complete');
                });
            }
        });

        // 2. Internal content delay
        gsap.from(".card-content", {
            opacity: 0,
            y: 15,
            delay: 0.4,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        });

        // 3. ScrollTrigger for documentation paragraphs
        gsap.utils.toArray(".doc-paragraph").forEach(p => {
            gsap.from(p, {
                scrollTrigger: {
                    trigger: p,
                    start: "top 85%",
                    once: true
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        });

    }, { scope: containerRef, dependencies: [id] });

    // Carousel navigation
    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1
        );
    };

    // Handle swipe gestures
    useEffect(() => {
        if (!carouselRef.current || !project?.images || project.images.length <= 1) return;

        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            if (touchStartX - touchEndX > 50) {
                nextImage();
            }
            if (touchEndX - touchStartX > 50) {
                prevImage();
            }
        };

        const carousel = carouselRef.current;
        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchmove', handleTouchMove);
        carousel.addEventListener('touchend', handleTouchEnd);

        return () => {
            carousel?.removeEventListener('touchstart', handleTouchStart);
            carousel?.removeEventListener('touchmove', handleTouchMove);
            carousel?.removeEventListener('touchend', handleTouchEnd);
        };
    }, [project, currentImageIndex]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--body-Linear-rgb))' }}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        Project Not Found
                    </h1>
                    <Link to="/" className="text-blue-400 hover:text-blue-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full py-8 px-4 md:px-12"
            style={{ background: 'rgb(var(--body-Linear-rgb))' }}
        >
            {/* Header with Back Button */}
            <div className="max-w-7xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-inter font-medium transition-colors mb-6 cursor-pointer group"
                    style={{ color: 'rgb(var(--contrast-rgb) / 0.6)' }}
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="group-hover:text-[rgb(var(--contrast-rgb))]">Back to Dashboard</span>
                </button>
            </div>

            {/* Bento Grid Container */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Image Carousel - Full width on mobile, 8 cols on desktop */}
                <div className="project-card md:col-span-8">
                    <div
                        className="rounded-2xl overflow-hidden p-6"
                        style={{
                            background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                            border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                        }}
                    >
                        <div className="card-content">
                            {/* Carousel with aspect ratio lock */}
                            <div
                                ref={carouselRef}
                                className="aspect-video w-full rounded-xl overflow-hidden relative group bg-black/20"
                            >
                                <img
                                    src={project.images[currentImageIndex]}
                                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop';
                                    }}
                                />

                                {/* Navigation Buttons */}
                                {project.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ background: 'rgba(var(--contrast-rgb), 0.9)' }}
                                        >
                                            <ArrowLeft size={20} style={{ color: 'rgb(var(--body-Linear-rgb))' }} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rotate-180"
                                            style={{ background: 'rgba(var(--contrast-rgb), 0.9)' }}
                                        >
                                            <ArrowLeft size={20} style={{ color: 'rgb(var(--body-Linear-rgb))' }} />
                                        </button>

                                        {/* Pagination Counter */}
                                        <div
                                            className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                background: 'rgba(var(--contrast-rgb), 0.9)',
                                                color: 'rgb(var(--body-Linear-rgb))'
                                            }}
                                        >
                                            {currentImageIndex + 1} / {project.images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadata Card - Full width on mobile, 4 cols on desktop */}
                <div className="project-card md:col-span-4">
                    <div
                        className="rounded-2xl p-6 h-full"
                        style={{
                            background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                            border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                        }}
                    >
                        <div className="card-content space-y-4">
                            <h1
                                className="text-[clamp(1.5rem,4vw,2.5rem)] font-playfair font-black leading-tight"
                                style={{ color: 'rgb(var(--contrast-rgb))' }}
                            >
                                {project.title}
                            </h1>

                            {/* Date & Type */}
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2" style={{ color: 'rgba(var(--contrast-rgb), 0.7)' }}>
                                    <Calendar size={16} />
                                    <span className="font-inter">{new Date(project.dateCreated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2" style={{ color: 'rgba(var(--contrast-rgb), 0.7)' }}>
                                    <Tag size={16} />
                                    <span className="font-inter font-medium">{project.projectType}</span>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="text-sm font-inter font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(var(--contrast-rgb), 0.5)' }}>
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.stacks.map((stack, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-1.5 rounded-lg text-sm font-inter font-medium flex items-center gap-1.5"
                                            style={{
                                                background: 'rgba(var(--contrast-rgb), 0.1)',
                                                color: 'rgb(var(--contrast-rgb))',
                                                border: '1px solid rgba(var(--contrast-rgb), 0.2)'
                                            }}
                                        >
                                            <span>{stackIcons[stack] || '💻'}</span>
                                            <span>{stack}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documentation Card - Full width */}
                <div className="project-card md:col-span-12">
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
                                        code: ({ node, ...props }) => <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: 'rgba(var(--contrast-rgb), 0.1)', color: 'rgb(var(--contrast-rgb))' }} {...props} />
                                    }}
                                >
                                    {project.fullDocumentation}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* File Downloads Card - Conditional Rendering */}
                {project.documentationFiles && project.documentationFiles.length > 0 && (
                    <div className="project-card md:col-span-12">
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                                border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                            }}
                        >
                            <div className="card-content">
                                <h2
                                    className="text-xl font-playfair font-bold mb-4"
                                    style={{ color: 'rgb(var(--contrast-rgb))' }}
                                >
                                    Download Resources
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {project.documentationFiles.map((file, idx) => (
                                        <a
                                            key={idx}
                                            href={file.path}
                                            download
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter font-medium text-sm transition-transform hover:scale-105 active:scale-95"
                                            style={{
                                                background: 'rgb(var(--contrast-rgb))',
                                                color: 'rgb(var(--theme-rgb))'
                                            }}
                                        >
                                            <Download size={18} />
                                            <span>{file.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProjectDetails;
