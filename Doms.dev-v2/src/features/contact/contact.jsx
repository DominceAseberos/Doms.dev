import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { getIconByName } from "../../utils/IconRegistry";

const Contacts = () => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const { contacts } = usePortfolioData();

  // Find email for clipboard copy
  const emailContact = Array.isArray(contacts) ? contacts.find(c => c.platform.toLowerCase() === 'email') : null;
  const email = emailContact ? emailContact.url.replace('mailto:', '') : '';

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    // Return to original size
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const copyToClipboard = (e) => {
    e.preventDefault();
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter} // Mobile scale support
      onTouchEnd={handleMouseLeave}   // Mobile reset support
      className="rounded-2xl w-full h-full py-5 px-4 flex flex-col justify-between overflow-hidden border border-white/5 shadow-xl transition-colors hover:border-white/20"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center pointer-events-none">
        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Connect</span>
        <div className={`h-1.5 w-1.5 rounded-full ${copied ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-white/20'} transition-all duration-500`} />
      </div>

      {/* Social Grid - Dynamic */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        {Array.isArray(contacts) && contacts.map((contact, idx) => {
          const Icon = getIconByName(contact.icon || 'Link');
          const isEmail = contact.platform.toLowerCase() === 'email';
          const rotate = idx % 2 === 0 ? 3 : -3;

          const onEnter = (e) => {
            gsap.to(e.currentTarget, {
              rotate: rotate,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out"
            });
          };

          const onLeave = (e) => {
            gsap.to(e.currentTarget, {
              rotate: 0,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "rgba(255, 255, 255, 0.5)",
              duration: 0.3,
              ease: "power2.out"
            });
          };

          if (isEmail) {
            return (
              <button
                key={idx}
                onClick={copyToClipboard}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-pointer"
                title="Copy Email"
              >
                <Icon size={14} />
              </button>
            );
          }

          return (
            <a
              key={idx}
              href={contact.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-pointer"
            >
              <Icon size={14} />
            </a>
          );
        })}
      </div>
      {/* Label */}
      <p className="text-[8px] text-gray-100 font-mono uppercase mt-2 italic opacity-50 ">
        {copied ? "Email Copied" : "Let's Talk"}
      </p>
    </div>
  );
};

export default Contacts;