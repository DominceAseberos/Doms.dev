import React, { useState, useEffect, useRef } from 'react';
import landingDataDefault from '../../data/landingData.json';

const STORAGE_KEY = 'landingData';

const AVAILABLE_LINKS = [
    { value: '/projects', label: 'Projects Page' },
    { value: '/about', label: 'About Page' },
    { value: '/contact', label: 'Contact Page' },
    { value: '/lab', label: 'Lab Page' },
];

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : landingDataDefault;
};

const Section = ({ title, children, onFeedback }) => {
    const [showCheck, setShowCheck] = useState(false);
    const timeoutRef = useRef(null);

    const triggerFeedback = () => {
        setShowCheck(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowCheck(false), 1500);
    };

    useEffect(() => {
        if (onFeedback) {
            const orig = onFeedback;
            onFeedback = () => {
                orig();
                triggerFeedback();
            };
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <section className="mb-8 p-6 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className={`text-green-400 text-sm transition-opacity duration-300 ${showCheck ? 'opacity-100' : 'opacity-0'}`}>
                    ✓ Saved
                </span>
            </div>
            {children(triggerFeedback)}
        </section>
    );
};

const LandingEditor = () => {
    const [data, setData] = useState(getStoredData);
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    };

    const handleChange = (path, value, feedbackFn) => {
        const keys = path.split('.');
        const newData = { ...data };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
        // Update localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    const handleArrayChange = (parent, index, field, value, feedbackFn) => {
        const newData = { ...data };
        newData[parent][index] = { ...newData[parent][index], [field]: value };
        setData(newData);
        // Update localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            showToast('Failed to save!');
        }
        if (feedbackFn) feedbackFn();
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handleTagAdd = (field, tag, feedbackFn) => {
        const currentArray = getNestedValue(data, field);
        if (tag && currentArray && !currentArray.includes(tag)) {
            handleChange(field, [...currentArray, tag], feedbackFn);
            return true;
        }
        return false;
    };

    const handleTagRemove = (field, index, feedbackFn) => {
        const currentArray = getNestedValue(data, field);
        if (currentArray) {
            const newTags = currentArray.filter((_, i) => i !== index);
            handleChange(field, newTags, feedbackFn);
        }
    };

    const resetToDefault = () => {
        if (confirm('Reset all to default?')) {
            localStorage.removeItem(STORAGE_KEY);
            setData(landingDataDefault);
            showToast('Reset to default!');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            {/* Toast */}
            <div className={`fixed top-4 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg transition-opacity duration-300 z-50 ${toast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                ✓ {toast}
            </div>

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

                {/* Marquee */}
                <Section title="Marquee Words">
                    {(triggerFeedback) => {
                        const [marqueeInput, setMarqueeInput] = useState('');
                        return (
                            <>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {data.hero.marquee.map((word, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#c8ff3e] text-black rounded-full text-sm flex items-center gap-2">
                                            {word}
                                            <button onClick={() => handleTagRemove('hero.marquee', i, triggerFeedback)} className="hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={marqueeInput}
                                        onChange={e => setMarqueeInput(e.target.value)}
                                        placeholder="Add marquee word"
                                        className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            if (marqueeInput.trim() && handleTagAdd('hero.marquee', marqueeInput.trim(), triggerFeedback)) {
                                                setMarqueeInput('');
                                                showToast('Marquee word added!');
                                            }
                                        }}
                                        className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </>
                        );
                    }}
                </Section>

                {/* Kicker */}
                <Section title="Hero Kicker">
                    {(triggerFeedback) => {
                        const [kickerInput, setKickerInput] = useState(data.hero.kicker);
                        return (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={kickerInput}
                                    onChange={e => setKickerInput(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                />
                                <button
                                    onClick={() => {
                                        handleChange('hero.kicker', kickerInput, triggerFeedback);
                                        showToast('Kicker updated!');
                                    }}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        );
                    }}
                </Section>

                {/* Display Kicker */}
                <Section title="Display Kicker">
                    {(triggerFeedback) => {
                        const [displayKickerInput, setDisplayKickerInput] = useState(data.hero.displayKicker);
                        return (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={displayKickerInput}
                                    onChange={e => setDisplayKickerInput(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                />
                                <button
                                    onClick={() => {
                                        handleChange('hero.displayKicker', displayKickerInput, triggerFeedback);
                                        showToast('Display Kicker updated!');
                                    }}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        );
                    }}
                </Section>

                {/* Bio */}
                <Section title="Bio">
                    {(triggerFeedback) => {
                        const [bioInput, setBioInput] = useState(data.hero.bio);
                        return (
                            <div className="flex gap-2">
                                <textarea
                                    value={bioInput}
                                    onChange={e => setBioInput(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                />
                                <button
                                    onClick={() => {
                                        handleChange('hero.bio', bioInput, triggerFeedback);
                                        showToast('Bio updated!');
                                    }}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        );
                    }}
                </Section>

                {/* Buttons */}
                <Section title="Buttons">
                    {(triggerFeedback) => {
                        const [buttonInputs, setButtonInputs] = useState(data.hero.buttons.map(btn => ({ label: btn.label, link: btn.link })));
                        return (
                            <>
                                {buttonInputs.map((btn, i) => (
                                    <div key={i} className="flex gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={btn.label}
                                            onChange={e => {
                                                const updated = [...buttonInputs];
                                                updated[i].label = e.target.value;
                                                setButtonInputs(updated);
                                            }}
                                            placeholder="Label"
                                            className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                        />
                                        <select
                                            value={btn.link}
                                            onChange={e => {
                                                const updated = [...buttonInputs];
                                                updated[i].link = e.target.value;
                                                setButtonInputs(updated);
                                            }}
                                            className="px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                        >
                                            <option value="">Select page...</option>
                                            {AVAILABLE_LINKS.map(link => (
                                                <option key={link.value} value={link.value}>{link.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                // Update both label and link in one go
                                                const updatedBtn = {
                                                    ...data.hero.buttons[i],
                                                    label: buttonInputs[i].label,
                                                    link: buttonInputs[i].link
                                                };
                                                const newButtons = [...data.hero.buttons];
                                                newButtons[i] = updatedBtn;
                                                handleChange('hero.buttons', newButtons, triggerFeedback);
                                                showToast('Button updated!');
                                            }}
                                            className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                        >
                                            Update
                                        </button>
                                    </div>
                                ))}
                            </>
                        );
                    }}
                </Section>

                {/* Tags Grid */}
                <Section title="Tags Grid">
                    {(triggerFeedback) => (
                        <>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {data.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#333] border border-gray-600 rounded-full text-sm flex items-center gap-2">
                                        {tag}
                                        <button onClick={() => handleTagRemove('tags', i, triggerFeedback)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="tags-input"
                                    placeholder="Add tag"
                                    className="flex-1 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            if (handleTagAdd('tags', e.target.value.trim().toUpperCase(), triggerFeedback)) {
                                                e.target.value = '';
                                                showToast('Tag added!');
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('tags-input');
                                        if (input.value.trim() && handleTagAdd('tags', input.value.trim().toUpperCase(), triggerFeedback)) {
                                            input.value = '';
                                            showToast('Tag added!');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </>
                    )}
                </Section>

                {/* Metrics */}
                <Section title="Metrics">
                    {(triggerFeedback) => {
                        const [metricInputs, setMetricInputs] = useState(data.metrics.map(metric => ({ value: metric.value, unit: metric.unit, label: metric.label })));
                        return (
                            <>
                                {metricInputs.map((metric, i) => (
                                    <div key={i} className="flex gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={metric.value}
                                            onChange={e => {
                                                const updated = [...metricInputs];
                                                updated[i].value = e.target.value;
                                                setMetricInputs(updated);
                                            }}
                                            placeholder="Value"
                                            className="w-24 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={metric.unit}
                                            onChange={e => {
                                                const updated = [...metricInputs];
                                                updated[i].unit = e.target.value;
                                                setMetricInputs(updated);
                                            }}
                                            placeholder="Unit"
                                            className="w-24 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={metric.label}
                                            onChange={e => {
                                                const updated = [...metricInputs];
                                                updated[i].label = e.target.value;
                                                setMetricInputs(updated);
                                            }}
                                            placeholder="Label"
                                            className="w-24 px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg focus:border-[#c8ff3e] outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                handleArrayChange('metrics', i, 'value', metricInputs[i].value, triggerFeedback);
                                                handleArrayChange('metrics', i, 'unit', metricInputs[i].unit, triggerFeedback);
                                                handleArrayChange('metrics', i, 'label', metricInputs[i].label, triggerFeedback);
                                                showToast('Metric updated!');
                                            }}
                                            className="px-4 py-2 bg-[#c8ff3e] text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                        >
                                            Update
                                        </button>
                                    </div>
                                ))}
                            </>
                        );
                    }}
                </Section>

                <p className="mt-8 text-gray-500 text-sm">
                    Changes are saved automatically and applied instantly to the site.
                </p>
            </div>
        </div>
    );
};

export default LandingEditor;
