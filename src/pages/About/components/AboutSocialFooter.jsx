import React from 'react';
import { Link } from 'react-router-dom';
import './AboutSocialFooter.css';

const socialItems = [
    {
        label: 'Facebook',
        href: 'https://facebook.com',
        external: true
    },
    {
        label: 'Instagram',
        href: 'https://instagram.com',
        external: true
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com',
        external: true
    },
    {
        label: 'X',
        href: 'https://x.com',
        external: true
    },
    {
        label: 'Telegram',
        href: 'https://telegram.org',
        external: true
    }
];

const AboutSocialFooter = () => {
    return (
        <footer className="about-social-footer">
                <div className="about-social-footer-inner">
                <div className="about-social-footer-copy">
                    <p className="ui-sub-label">Let’s Connect</p>
                    <h3 className="about-social-footer-title">
                        If you have something in mind, let’s talk.
                    </h3>
                    <p className="about-social-footer-text ui-body-copy">
                        If you have an idea, a question, or something you want to build, I’m always open to meaningful conversations and thoughtful digital work.
                    </p>
                </div>

                <div className="about-social-footer-actions">
                    <Link to="/contact" className="about-social-footer-cta">
                        Start a Conversation
                    </Link>

                    <div className="about-social-footer-links">
                        {socialItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="about-social-footer-link"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AboutSocialFooter;
