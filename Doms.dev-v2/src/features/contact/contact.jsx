import React, { useRef, useState } from "react";
import { SiLinkedin, SiGithub, SiFacebook, SiGmail } from "react-icons/si";
import { gsap } from "gsap";

const Contacts = () => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const email = "daseberos@gmail.com";

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
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* Social Grid - Standard Links */}
      <div className="grid grid-cols-2 gap-2 relative z-10 ">
        {[
          { icon: <SiLinkedin size={14} />, href: "https://linkedin.com/in/domincee/" },
          { icon: <SiGithub size={14} />, href: "https://facebook.com/domince.aseberos" },
          { icon: <SiFacebook size={14} />, href: "#" },
          { icon: <SiGmail size={14} />, action: copyToClipboard }
        ].map((item, idx) => (
          item.action ? (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer 
               active:-rotate-3 hover:-rotate-3
             "
            >
              {item.icon}
            </button>
          ) : (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer
               active:rotate-3 hover:rotate-3
              
              "

            >
              {item.icon}
            </a>
          )
        ))}
      </div>
      {/* Label */}
      <p className="text-[8px] text-gray-100 font-mono uppercase mt-2 italic opacity-50 ">
        {copied ? "Email Copied" : "Let's Talk"}
      </p>
    </div>
  );
};

export default Contacts;