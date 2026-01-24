
const AboutMe = () => {

  return (
    <>

      <div className="flex flex-col gap-2 rounded-2xl p-5 md:p-3 h-full w-full"
        style={{
          background: `linear-gradient(
                        to bottom,
                         rgba(var(--box-Linear-1-rgb))  ,
                         rgba(var(--box-Linear-2-rgb))  
                    )`
        }}>
        <h1 className="text-2xl md:text-xl">Domince A. Aseberos</h1>
        <p className="text-xs tracking-wideest ">Hello, welcome to my portfolio! In here, I’m showcasing my personal projects, school projects, small apps,  and experimental projects. I’m also exploring new technologies and experimenting with creative ideas.
          <a
            href=""
            className="inline-block ml-2 text-[14px] underline transition-all duration-200 hover:scale-110 active:scale-110"
          >
            About Me
          </a>
        </p>





      </div>
    </>
  );
};
export default AboutMe;