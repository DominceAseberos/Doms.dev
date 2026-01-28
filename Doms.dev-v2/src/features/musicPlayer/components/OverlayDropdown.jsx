import { memo } from 'react';

export const OverlayDropdown = memo(({
  currentMood,
  availableMoods,
  onMoodChange,
  isOpenModal,
  dropdownRef,
}) => {
  return (
    <div ref={dropdownRef}
      className={`
        absolute -translate-y-12 border flex justify-between h-max  bottom-0 overflow-y-scroll  border-[rgb(var(--contrast-rgb))] rounded-xl shadow-xl 
        transition-all duration-300 
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
          onClick={() => {
            onMoodChange(option.id);
          }}
          className={`rounded-xl  w-full px-4 py-2 label-font uppercase text-center font-bold tracking-wide 
            transition-all duration-300
            ${currentMood === option.id
              ? 'bg-[rgb(var(--contrast-rgb))] text-black'
              : 'text-white hover:bg-white/20'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});
