import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiImage, FiSave, FiList, FiGrid, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { savePortfolioData, fetchPortfolioData } from '../../shared/portfolioService';
import portfolioDataDefault from '../../data/portfolioData.json';

const AutoResizeTextarea = ({ value, onChange, className, ...props }) => {
    const textareaRef = React.useRef(null);
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);
    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            className={`${className} overflow-hidden resize-none`}
            rows={1}
            {...props}
        />
    );
};

const Section = ({ title, children, onFeedback }) => {
    const [showCheck, setShowCheck] = useState(false);
    const triggerFeedback = () => {
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1500);
    };
    return (
        <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className={`text-green-400 text-sm transition-opacity duration-300 ${showCheck ? 'opacity-100' : 'opacity-0'}`}>✓ Saved</span>
            </div>
            {children(triggerFeedback)}
        </section>
    );
};

const ProjectEditor = () => {
    const [data, setData] = useState({ projects: [] });
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        shortDescription: '',
        images: [],
        projectType: '',
        mainImage: '',
        galleryImages: [],
        assets: { desktop: '', tablet: '', mobile: '' }
    });
    const [toast, setToast] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchPortfolioData();
                setData(fetchedData);
            } catch (err) {
                setData(portfolioDataDefault);
                showToast('Using local fallback data');
            }
        };
        loadData();
    }, []);

    const persistChanges = async (newData) => {
        try {
            setData(newData);
            await savePortfolioData(newData);
            showToast('Changes saved to disk');
        } catch (err) {
            showToast('Failed to save to disk!');
        }
    };

    // New project handlers
    const handleMainImageChange = (url) => {
        setNewProject({ ...newProject, mainImage: url });
    };
    const handleAddGalleryImage = (url) => {
        setNewProject({ ...newProject, galleryImages: [...newProject.galleryImages, url] });
    };
    const handleRemoveGalleryImage = (imgIdx) => {
        setNewProject({ ...newProject, galleryImages: newProject.galleryImages.filter((_, i) => i !== imgIdx) });
    };
    const handleAssetZipChange = (type, file) => {
        setNewProject({ ...newProject, assets: { ...newProject.assets, [type]: file } });
    };
    const handleAddNewProjectImage = (url) => {
        setNewProject({ ...newProject, images: [...newProject.images, url] });
    };
    const handleRemoveNewProjectImage = (imgIdx) => {
        setNewProject({ ...newProject, images: newProject.images.filter((_, i) => i !== imgIdx) });
    };

    const handleSaveNewProject = async (feedbackFn) => {
        const project = {
            id: `project-${Date.now()}`,
            ...newProject,
        };
        const newData = { ...data, projects: [...data.projects, project] };
        await persistChanges(newData);
        setShowNewProjectForm(false);
        setNewProject({ title: '', shortDescription: '', images: [], projectType: '', mainImage: '', galleryImages: [], assets: { desktop: '', tablet: '', mobile: '' } });
        if (feedbackFn) feedbackFn();
        showToast('Project added!');
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    };

    // Edit project title
    const handleProjectTitleChange = (index, value, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].title = value;
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Edit project description
    const handleProjectDescChange = (index, value, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].shortDescription = value;
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Add new project
    const handleAddProject = (feedbackFn) => {
        const newProject = {
            id: `project-${Date.now()}`,
            title: 'New Project',
            shortDescription: '',
            images: [],
            projectType: 'uncategorized',
        };
        const newData = { ...data, projects: [...data.projects, newProject] };
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Remove project
    const handleRemoveProject = (index, feedbackFn) => {
        const newData = { ...data, projects: data.projects.filter((_, i) => i !== index) };
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Add image to project
    const handleAddImage = (index, url, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].images = [...(newData.projects[index].images || []), url];
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Remove image from project
    const handleRemoveImage = (projIdx, imgIdx, feedbackFn) => {
        const newData = { ...data };
        newData.projects[projIdx].images = newData.projects[projIdx].images.filter((_, i) => i !== imgIdx);
        persistChanges(newData);
        if (feedbackFn) feedbackFn();
    };

    // Remove category
    const handleRemoveCategory = (catToRemove) => {
        const newData = { ...data };
        // Remove from customCategories
        if (newData.customCategories) {
            newData.customCategories = newData.customCategories.filter(c => c !== catToRemove);
        }
        // Blank it out from projects using it
        newData.projects = newData.projects.map(p => {
            if (p.projectType === catToRemove) {
                return { ...p, projectType: '' };
            }
            return p;
        });
        persistChanges(newData);
        if (activeCategory === catToRemove) {
            setActiveCategory('all');
        }
        showToast(`Category "${catToRemove}" removed!`);
    };

    // Auto-detect categories
    const categories = Array.from(new Set([
        ...(data.customCategories || []),
        ...data.projects.map(p => p.projectType || 'uncategorized')
    ]));
    const [activeCategory, setActiveCategory] = useState(categories[0] || 'all');

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            {/* Toast */}
            <div className={`fixed top-4 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg transition-opacity duration-300 z-50 ${toast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>✓ {toast}</div>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Project Page Editor</h1>
                        <p className="text-gray-400">Edit projects, images, and categories</p>
                    </div>
                    <button
                        onClick={() => setShowNewProjectForm(true)}
                        className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                    >
                        Add Project
                    </button>
                </div>
                {/* Editor Content Wrapper */}
                <>
                {/* New Project Form */}
                {showNewProjectForm && (
                    <Section title="Add New Project">
                        {(triggerFeedback) => (
                            <>
                                {newProject.projectType === 'landing page' && (
                            <div className="mb-8 p-4 bg-[#222] rounded-lg">
                                {/* Main Image */}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Main Image (URL)</label>
                                    <input
                                        type="text"
                                        value={newProject.mainImage}
                                        onChange={e => handleMainImageChange(e.target.value)}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />
                                </div>
                                {/* Gallery Images */}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Gallery Images</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {newProject.galleryImages.map((img, imgIdx) => (
                                            <div key={imgIdx} className="relative">
                                                <img src={img} alt="Gallery" className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                                                <button
                                                    onClick={() => handleRemoveGalleryImage(imgIdx)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Gallery Image URL"
                                            className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                            id="new-gallery-img-input"
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('new-gallery-img-input');
                                                if (input.value.trim()) {
                                                    handleAddGalleryImage(input.value.trim());
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                        >Add Gallery Image</button>
                                    </div>
                                </div>
                                {/* Asset ZIP Uploads */}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Assets (ZIP Upload)</label>
                                    <div className="mb-2">
                                        <label>Desktop Assets ZIP</label>
                                        <input
                                            type="file"
                                            accept="application/zip"
                                            onChange={e => handleAssetZipChange('desktop', e.target.files[0])}
                                        />
                                        {newProject.assets.desktop && (
                                            <button className="ml-2 px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg">Download Desktop ZIP</button>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <label>Tablet Assets ZIP</label>
                                        <input
                                            type="file"
                                            accept="application/zip"
                                            onChange={e => handleAssetZipChange('tablet', e.target.files[0])}
                                        />
                                        {newProject.assets.tablet && (
                                            <button className="ml-2 px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg">Download Tablet ZIP</button>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <label>Mobile Assets ZIP</label>
                                        <input
                                            type="file"
                                            accept="application/zip"
                                            onChange={e => handleAssetZipChange('mobile', e.target.files[0])}
                                        />
                                        {newProject.assets.mobile && (
                                            <button className="ml-2 px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg">Download Mobile ZIP</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mb-8 p-4 bg-[#222] rounded-lg">
                            <div className="mb-2">
                                <label className="block text-sm mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newProject.title}
                                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Short Description</label>
                                <AutoResizeTextarea
                                    value={newProject.shortDescription}
                                    onChange={e => setNewProject({ ...newProject, shortDescription: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                />
                            </div>

                            <label className="block text-sm mb-1">Category</label>
                            <div className="flex gap-2 mb-4">
                                <select
                                    value={newProject.projectType}
                                    onChange={e => setNewProject({ ...newProject, projectType: e.target.value })}
                                    className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none appearance-none"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="New Category..."
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                />
                                <button
                                    onClick={() => {
                                        if (newCategoryName.trim()) {
                                            const newCat = newCategoryName.trim();
                                            const newData = { ...data, customCategories: [...(data.customCategories || []), newCat] };
                                            persistChanges(newData);
                                            setNewProject({ ...newProject, projectType: newCat });
                                            setNewCategoryName('');
                                            triggerFeedback();
                                            showToast('Category added!');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >Add</button>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleSaveNewProject(triggerFeedback)}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >Save Project</button>
                                <button
                                    onClick={() => { setShowNewProjectForm(false); setNewProject({ title: '', shortDescription: '', images: [], projectType: '' }); }}
                                    className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors"
                                >Cancel</button>
                            </div>
                        </div>
                    </>
                )}
            </Section>
        )}

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg ${activeCategory === 'all' ? 'bg-[#c8ff3e] text-black' : 'bg-[#252525] text-white'}`}
                        onClick={() => setActiveCategory('all')}
                    >All</button>
                    {categories.map(cat => (
                        <div key={cat} className="relative group">
                            <button
                                className={`px-4 py-2 pr-8 rounded-lg ${activeCategory === cat ? 'bg-[#c8ff3e] text-black' : 'bg-[#252525] text-white'}`}
                                onClick={() => setActiveCategory(cat)}
                            >{cat}</button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to completely remove the category "${cat}"?`)) {
                                        handleRemoveCategory(cat);
                                    }
                                }}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 ${
                                    activeCategory === cat 
                                    ? 'bg-black text-[#c8ff3e] hover:bg-red-500 hover:text-white' 
                                    : 'bg-white/10 text-white hover:bg-red-500'
                                }`}
                                title="Remove Category"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <Section title="Projects">
                    {(triggerFeedback) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(activeCategory === 'all' ? data.projects : data.projects.filter(p => p.projectType === activeCategory)).map((project, i) => (
                                <div key={project.id} className="mb-6 p-4 bg-[#222] rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm mb-1">Title</label>
                                        <button
                                            onClick={() => handleRemoveProject(i, triggerFeedback)}
                                            className="text-red-500 hover:text-red-700 text-xs"
                                        >Remove</button>
                                    </div>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={e => handleProjectTitleChange(i, e.target.value, triggerFeedback)}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />
                                    <label className="block text-sm mb-1">Short Description</label>
                                    <AutoResizeTextarea
                                        value={project.shortDescription}
                                        onChange={e => handleProjectDescChange(i, e.target.value, triggerFeedback)}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />

                                    {/* Project Type (Category) */}
                                    <label className="block text-sm mb-1">Category</label>
                                        <select
                                            value={project.projectType || ''}
                                            onChange={e => {
                                                const newData = { ...data };
                                                newData.projects[i].projectType = e.target.value;
                                                persistChanges(newData);
                                                triggerFeedback();
                                            }}
                                            className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-4 appearance-none"
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="pt-2 border-t border-gray-700/50 flex justify-end">
                                            <Link 
                                                to={`/admin/projects/${project.id}`}
                                                className="text-xs font-bold text-[#c8ff3e] hover:underline"
                                            >
                                                View Details ↗
                                            </Link>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </Section>
                </>
            </div>
        </div>
    );
};

export default ProjectEditor;
