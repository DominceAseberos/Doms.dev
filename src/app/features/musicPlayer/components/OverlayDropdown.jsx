import { memo, useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const OverlayDropdown = memo(({
  currentMood,
  availableMoods,
  onMoodChange,
  isOpenModal,
  dropdownRef,
}) => {
  const { contextSafe } = useGSAP({ scope: dropdownRef });

  const onEnter = contextSafe((e) => {
    if (e.currentTarget.dataset.active !== "true") {
      gsap.to(e.currentTarget, { backgroundColor: "rgba(255, 255, 255, 0.2)", duration: 0.3 });
    }
  });

  const onLeave = contextSafe((e) => {
    if (e.currentTarget.dataset.active !== "true") {
      gsap.to(e.currentTarget, { backgroundColor: "rgba(255, 255, 255, 0)", duration: 0.3 });
    }
  });

  return (
    <div ref={dropdownRef}
      className={`
        absolute -translate-y-12 border flex justify-between h-max bottom-0 overflow-y-scroll border-[rgb(var(--contrast-rgb))] rounded-xl shadow-xl 
      ${isOpenModal ? `w-full opacity-100` : `w-0 opacity-0`}
      `}
      style={{
        scrollbarWidth: `thin`,
        scrollbarColor: `rgb(var(--contrast-rgb)) rgb(var(--contrast-rgb))`,
        background: `linear-gradient(
          to bottom,
          rgba(var(--box-Linear-1-rgb)),
          rgba(var(--box-Linear-2-rgb))
        )`,
      }}
    >
      {availableMoods?.map((option) => (
        <button
          key={option.id}
          data-active={currentMood === option.id}
          onClick={() => {
            onMoodChange(option.id);
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className={`rounded-xl w-full px-4 py-2 label-font uppercase text-center font-bold tracking-wide cursor-pointer
            ${currentMood === option.id
              ? 'bg-[rgb(var(--contrast-rgb))] text-black'
              : 'text-white'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});
