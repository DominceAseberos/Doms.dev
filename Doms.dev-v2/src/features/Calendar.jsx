
const Calendar = () => {

  return (
    <>
      <div className="rounded-2xl w-full h-full p-4 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(
                         to bottom,
                          rgba(var(--box-Linear-1-rgb))  ,
                          rgba(var(--box-Linear-2-rgb))  
                     )`
        }}>
        <p className="font-playfair font-black text-2xl tracking-tight text-white/90 animate-item text-center">EMPTY</p>
      </div>
    </>
  );
};
export default Calendar;