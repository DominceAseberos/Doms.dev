import React, { useState, useEffect } from 'react';
import umtcLogo from '../../../assets/umtc-logopng.webp';
import { fetchAboutData } from '../../../shared/aboutService';
import aboutDataDefault from '../../../data/aboutData.json';
import './EducationSection.css';

const EducationSection = () => {

    const [education, setEducation] = useState(
        () => aboutDataDefault.education || []
    );

    useEffect(() => {
        fetchAboutData()
            .then(d => setEducation(d.education || []))
            .catch(() => {});
    }, []);



    if (!education.length) return null;

    return (
        <section className="education-section relative w-full bg-transparent flex items-center justify-center z-10 py-16">
            <div className="relative z-10 text-white px-6 md:px-16 w-full max-w-[1400px] flex flex-col items-start gap-10">
                <div className="lit-content-block lit-transparent">
                    <h2
                        className="font-bold uppercase tracking-tight text-[var(--accent)] ns-reveal"
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', lineHeight: 1.15 }}
                    >
                        <span className="es-heading-name">Educational</span> Background
                    </h2>
                    <p className="ui-sub-label mt-1 ns-reveal">Academic Foundation</p>
                </div>

                {education.map((entry, i) => (
                    <div key={i} className="w-full grid grid-cols-1 lg:grid-cols-[minmax(280px,480px)_1fr] gap-8 lg:gap-14 items-center lit-content-block lit-transparent">
                        {/* Logo / visual */}
                        <div className="es-logo-card w-full rounded-3xl p-5 md:p-6 ns-reveal">
                            <img
                                src={umtcLogo}
                                alt={entry.institution}
                                className="es-logo-img w-full rounded-xl"
                            />
                        </div>

                        {/* Info */}
                        <div className="w-full flex flex-col items-start justify-center text-left">
                            <div className="space-y-3 max-w-2xl">
                                <h3 className="es-institution-name text-lg md:text-2xl font-bold tracking-tight ns-reveal">
                                    {entry.institution}
                                </h3>
                                <p className="es-degree-text text-xs uppercase tracking-[0.12em] font-medium ns-reveal">
                                    {entry.degree}
                                </p>
                                {entry.period && (
                                    <p className="ui-sub-label text-[10px] ns-reveal">{entry.period}</p>
                                )}
                                {(entry.skills || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1 ns-reveal">
                                        {entry.skills.map((skill) => (
                                            <span key={skill} className="ui-pill px-3 py-1 rounded-full text-[10px] md:text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EducationSection;
