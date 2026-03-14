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
            <div className="about-social-footer__inner">
                <div className="about-social-footer__copy">
                    <p className="ui-sub-label">Let’s Connect</p>
                    <h3 className="about-social-footer__title">
                        If you have something in mind, let’s talk.
                    </h3>
                    <p className="about-social-footer__text ui-body-copy">
                        If you have an idea, a question, or something you want to build, I’m always open to meaningful conversations and thoughtful digital work.
                    </p>
                </div>

                <div className="about-social-footer__actions">
                    <Link to="/contact" className="about-social-footer__cta">
                        Start a Conversation
                    </Link>

                    <div className="about-social-footer__links">
                        {socialItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="about-social-footer__link"
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
