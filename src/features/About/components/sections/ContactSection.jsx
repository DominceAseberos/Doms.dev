import React from 'react';
import { GithubIcon, LinkedInIcon } from '../../utils/techIcons';

export default function ContactSection({ contact = {}, theme }) {
    return (
        <section className="ns-contact-section" id="contact">
            <div className="ns-contact-header lit-content-block lit-transparent">
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Contact</p>
                <h2 className="ns-section-heading ns-reveal">{contact.heading || "Open to Opportunities"}</h2>
                {contact.subtext && (
                    <p className="ui-body-copy ns-contact-sub ns-reveal" suppressHydrationWarning>{contact.subtext}</p>
                )}
                <div className="ns-contact-cta-wrapper ns-reveal" style={{ position: 'relative', display: 'inline-block', marginTop: '10rem' }}>
                    <img
                        src="/assets/GIF/tobe-sleep.gif"
                        alt="toby sleeping"
                        className="ns-cat-sleep-vid"
                        style={{ opacity: theme === 'dark' ? 1 : 0 }}
                    />
                    <img
                        src="/assets/GIF/tobe-peek.gif"
                        alt="cat peeking"
                        className="ns-cat-peek"
                        style={{ opacity: theme === 'light' ? 1 : 0 }}
                    />
                    <a href="/contact" className="btn-primary ns-contact-cta" style={{ margin: 0, position: 'relative', zIndex: 2 }}>
                        Start a Conversation
                    </a>
                </div>
            </div>

            <footer className="ns-footer lit-content-block">
                <div className="ns-footer-content">
                    <p className="ui-body-copy ns-footer-copy" suppressHydrationWarning>
                        © {new Date().getFullYear()} Domince Aseberos. All rights reserved.
                    </p>
                    <div className="ns-footer-links">
                        <a href="https://github.com/DominceAseberos" target="_blank" rel="noopener noreferrer" className="ns-footer-link" aria-label="GitHub">
                            <GithubIcon />
                        </a>
                        <a href="https://linkedin.com/in/dominceaseberos" target="_blank" rel="noopener noreferrer" className="ns-footer-link" aria-label="LinkedIn">
                            <LinkedInIcon />
                        </a>
                    </div>
                </div>
            </footer>
        </section>
    );
}
