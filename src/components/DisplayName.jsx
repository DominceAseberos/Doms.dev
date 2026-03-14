import React from 'react';

const DisplayName = ({
    as: Tag = 'h1',
    showKicker = false,
    kickerText = 'Portfolio — Selected Work',
    centered = false,
    staticMode = false,
    className = '',
}) => {
    const wrapperClasses = centered ? 'text-center' : '';
    const headingClasses = [
        'hero-name',
        staticMode ? 'hero-name-static' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {showKicker && (
                <div className="ui-sub-label text-sm mb-6">
                    {kickerText}
                </div>
            )}

            <Tag className={headingClasses}>
                Domince
                <br />
                <span className="line2">Aseberos</span>
            </Tag>
        </div>
    );
};

export default DisplayName;
