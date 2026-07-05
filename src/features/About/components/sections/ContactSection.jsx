import React from 'react';
import { GithubIcon, LinkedInIcon } from '../../utils/techIcons';
import ContactSquiggles from '../ui/ContactSquiggles';
import landingData from '../../../../data/landingData.json';

export default function ContactSection({ contact = {}, theme }) {
    return (
        <section className="ns-contact-section" id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
            <ContactSquiggles />
            <div className="ns-contact-header lit-content-block lit-transparent" style={{ position: 'relative', zIndex: 1 }}>
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

            <footer style={{ padding: '2rem', textAlign: 'center', opacity: 0.7, fontSize: '0.85rem', marginTop: '4rem' }} suppressHydrationWarning>
                © {new Date().getFullYear()} Domince Aseberos. Designed & Built in Davao, Philippines.
            </footer>
        </section>
    );
}
