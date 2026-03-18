import React, { useState } from 'react';
import portfolioDataDefault from '../../data/portfolioData.json';

const STORAGE_KEY = 'portfolioData';

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : portfolioDataDefault;
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
    // Handle main image
    const handleMainImageChange = (url) => {
        setNewProject({ ...newProject, mainImage: url });
    };
    // Handle gallery images
    const handleAddGalleryImage = (url) => {
        setNewProject({ ...newProject, galleryImages: [...newProject.galleryImages, url] });
    };
    const handleRemoveGalleryImage = (imgIdx) => {
        setNewProject({ ...newProject, galleryImages: newProject.galleryImages.filter((_, i) => i !== imgIdx) });
    };
    // Handle asset ZIP uploads
    const handleAssetZipChange = (type, file) => {
        setNewProject({ ...newProject, assets: { ...newProject.assets, [type]: file } });
    };
        // State for new project form
        const [showNewProjectForm, setShowNewProjectForm] = useState(false);
        const [newProject, setNewProject] = useState({
            title: '',
            shortDescription: '',
            images: [],
            projectType: '',
        });

        // Add image to new project
        const handleAddNewProjectImage = (url) => {
            setNewProject({ ...newProject, images: [...newProject.images, url] });
        };
        // Remove image from new project
        const handleRemoveNewProjectImage = (imgIdx) => {
            setNewProject({ ...newProject, images: newProject.images.filter((_, i) => i !== imgIdx) });
        };
        // Save new project
        const handleSaveNewProject = (feedbackFn) => {
            const project = {
                id: `project-${Date.now()}`,
                ...newProject,
            };
            const newData = { ...data, projects: [...data.projects, project] };
            setData(newData);
            setShowNewProjectForm(false);
            setNewProject({ title: '', shortDescription: '', images: [], projectType: '' });
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            } catch (e) {
                showToast('Failed to save!');
            }
            if (feedbackFn) feedbackFn();
            showToast('Project added!');
        };
    const [data, setData] = useState(getStoredData);
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    };

    // Edit project title
    const handleProjectTitleChange = (index, value, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].title = value;
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    // Edit project description
    const handleProjectDescChange = (index, value, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].shortDescription = value;
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
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
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    // Remove project
    const handleRemoveProject = (index, feedbackFn) => {
        const newData = { ...data, projects: data.projects.filter((_, i) => i !== index) };
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    // Add image to project
    const handleAddImage = (index, url, feedbackFn) => {
        const newData = { ...data };
        newData.projects[index].images = [...(newData.projects[index].images || []), url];
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    // Remove image from project
    const handleRemoveImage = (projIdx, imgIdx, feedbackFn) => {
        const newData = { ...data };
        newData.projects[projIdx].images = newData.projects[projIdx].images.filter((_, i) => i !== imgIdx);
        setData(newData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    // Auto-detect categories
    const categories = Array.from(new Set(data.projects.map(p => p.projectType || 'uncategorized')));
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
                {/* New Project Form */}
                {showNewProjectForm && (
                    <div>
                        {/* Landing page template fields if selected */}
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
                        {/* ...existing code for other project types or fields... */}
                    </div>
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
                    <Section title="Add New Project">
                        {(triggerFeedback) => (
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
                                    <textarea
                                        value={newProject.shortDescription}
                                        onChange={e => setNewProject({ ...newProject, shortDescription: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />
                                </div>
                                {/* Images */}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Images</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {newProject.images.map((img, imgIdx) => (
                                            <div key={imgIdx} className="relative">
                                                <img src={img} alt="Project" className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                                                <button
                                                    onClick={() => handleRemoveNewProjectImage(imgIdx)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL"
                                            className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                            id="new-project-img-input"
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('new-project-img-input');
                                                if (input.value.trim()) {
                                                    handleAddNewProjectImage(input.value.trim());
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                        >Add Image</button>
                                    </div>
                                </div>
                                {/* Project Type (Category) */}
                                <label className="block text-sm mb-1">Category</label>
                                <input
                                    type="text"
                                    value={newProject.projectType}
                                    onChange={e => setNewProject({ ...newProject, projectType: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                />
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
                        )}
                    </Section>
                )}
                {/* Category Filter */}
                <div className="flex gap-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg ${activeCategory === 'all' ? 'bg-[#c8ff3e] text-black' : 'bg-[#252525] text-white'}`}
                        onClick={() => setActiveCategory('all')}
                    >All</button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-lg ${activeCategory === cat ? 'bg-[#c8ff3e] text-black' : 'bg-[#252525] text-white'}`}
                            onClick={() => setActiveCategory(cat)}
                        >{cat}</button>
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
                                    <textarea
                                        value={project.shortDescription}
                                        onChange={e => handleProjectDescChange(i, e.target.value, triggerFeedback)}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />
                                    {/* Images */}
                                    <div className="mb-2">
                                        <label className="block text-sm mb-1">Images</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(project.images || []).map((img, imgIdx) => (
                                                <div key={imgIdx} className="relative">
                                                    <img src={img} alt="Project" className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                                                    <button
                                                        onClick={() => handleRemoveImage(i, imgIdx, triggerFeedback)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                                id={`img-input-${project.id}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById(`img-input-${project.id}`);
                                                    if (input.value.trim()) {
                                                        handleAddImage(i, input.value.trim(), triggerFeedback);
                                                        input.value = '';
                                                        showToast('Image added!');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                            >Add Image</button>
                                        </div>
                                    </div>
                                    {/* Project Type (Category) */}
                                    <label className="block text-sm mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={project.projectType || ''}
                                        onChange={e => {
                                            const newData = { ...data };
                                            newData.projects[i].projectType = e.target.value;
                                            setData(newData);
                                            try {
                                                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
                                            } catch (e) {
                                                showToast('Failed to save!');
                                            }
                                            triggerFeedback();
                                        }}
                                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none mb-2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>
        </div>
    );
};

export default ProjectEditor;
