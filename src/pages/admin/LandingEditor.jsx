import React, { useState, useEffect } from 'react';
import landingData from '../../data/landingData.json';

const STORAGE_KEY = 'landingData';

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : landingData;
};

const LandingEditor = () => {
    const [data, setData] = useState(getStoredData);
    const [saved, setSaved] = useState(true);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaved(true);
    }, [data]);

    const handleChange = (path, value) => {
        const keys = path.split('.');
        const newData = { ...data };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    const handleArrayChange = (parent, index, field, value) => {
        const newData = { ...data };
        newData[parent][index] = { ...newData[parent][index], [field]: value };
        setData(newData);
    };

    const handleTagAdd = (field, tag) => {
        if (tag && !data[field].includes(tag)) {
            handleChange(field, [...data[field], tag]);
        }
    };

    const handleTagRemove = (field, index) => {
        const newTags = data[field].filter((_, i) => i !== index);
        handleChange(field, newTags);
    };

    const resetToDefault = () => {
        if (confirm('Reset all to default?')) {
            localStorage.removeItem(STORAGE_KEY);
            setData(landingData);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Landing Page Editor</h1>
                        <p className="text-gray-400">Changes apply instantly to the site</p>
                    </div>
                    <button
                        onClick={resetToDefault}
                        className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors text-sm"
                    >
                        Reset to Default
                    </button>
                </div>

                {saved && (
                    <div className="mb-6 px-4 py-2 bg-green-900/30 border border-green-800 rounded-lg text-green-400 text-sm">
                        ✓ Changes saved and live on site!
                    </div>
                )}

                {/* Marquee */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Marquee Words</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {data.hero.marquee.map((word, i) => (
                            <span key={i} className="px-3 py-1 bg-[#c8ff3e] text-black rounded-full text-sm flex items-center gap-2">
                                {word}
                                <button onClick={() => {
                                    const newMarquee = data.hero.marquee.filter((_, idx) => idx !== i);
                                    handleChange('hero.marquee', newMarquee);
                                }} className="hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Add marquee word + Enter"
                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                                handleTagAdd('hero.marquee', e.target.value.trim());
                                e.target.value = '';
                            }
                        }}
                    />
                </section>

                {/* Kicker */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Hero Kicker</h2>
                    <input
                        type="text"
                        value={data.hero.kicker}
                        onChange={(e) => handleChange('hero.kicker', e.target.value)}
                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                    />
                </section>

                {/* Display Kicker */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Display Kicker (Portfolio — Selected Work)</h2>
                    <input
                        type="text"
                        value={data.hero.displayKicker}
                        onChange={(e) => handleChange('hero.displayKicker', e.target.value)}
                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                    />
                </section>

                {/* Bio */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Bio</h2>
                    <textarea
                        value={data.hero.bio}
                        onChange={(e) => handleChange('hero.bio', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                    />
                </section>

                {/* Buttons */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Buttons</h2>
                    {data.hero.buttons.map((btn, i) => (
                        <div key={i} className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={btn.label}
                                onChange={(e) => handleArrayChange('hero.buttons', i, 'label', e.target.value)}
                                placeholder="Label"
                                className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                            />
                            <input
                                type="text"
                                value={btn.link}
                                onChange={(e) => handleArrayChange('hero.buttons', i, 'link', e.target.value)}
                                placeholder="Link"
                                className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                            />
                        </div>
                    ))}
                </section>

                {/* Tags Grid */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Tags Grid</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {data.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#333] border border-gray-600 rounded-full text-sm flex items-center gap-2">
                                {tag}
                                <button onClick={() => handleTagRemove('tags', i)} className="hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Add tag + Enter"
                        className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                                handleTagAdd('tags', e.target.value.trim().toUpperCase());
                                e.target.value = '';
                            }
                        }}
                    />
                </section>

                {/* Metrics */}
                <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Metrics</h2>
                    {data.metrics.map((metric, i) => (
                        <div key={i} className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => handleArrayChange('metrics', i, 'value', e.target.value)}
                                placeholder="Value"
                                className="w-24 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                            />
                            <input
                                type="text"
                                value={metric.unit}
                                onChange={(e) => handleArrayChange('metrics', i, 'unit', e.target.value)}
                                placeholder="Unit"
                                className="w-24 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                            />
                            <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => handleArrayChange('metrics', i, 'label', e.target.value)}
                                placeholder="Label"
                                className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                            />
                        </div>
                    ))}
                </section>

                <p className="mt-8 text-gray-500 text-sm">
                    Changes are saved automatically and applied instantly to the site.
                </p>
            </div>
        </div>
    );
};

export default LandingEditor;
