
const AboutMe = () => {

return (
     <>
    
      <div className="flex flex-col gap-2 rounded-2xl p-5 h-full w-full"  
      style={{
                    background: `linear-gradient(
                        to bottom,
                         rgba(var(--box-Linear-1-rgb))  ,
                         rgba(var(--box-Linear-2-rgb))  
                    )`
                    }}>
           <h1 className="text-2xl ">Domince A. Aseberos</h1>
           <p className="text-xs tracking-wideest">Hello, welcome to my portfolio! In here, I’m showcasing my personal projects, school projects, mini audio visualizers, chatbots, small apps, landing pages, and even a banana leaf detection project. I’m also exploring new technologies and experimenting with creative ideas.</p>

           <div className="w-full flex flex-row justify-end">
              <button className="rounded-2xl underline transition-all duration-200 active:scale-110 ">
                About Me
              </button>
           </div>

      </div>
    </>
  );
};
export default AboutMe;