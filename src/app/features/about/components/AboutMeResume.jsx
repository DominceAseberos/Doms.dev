import { FileText } from 'lucide-react';



const AboutMeResume = ({ resumeCardRef, onExpand, profile }) => {
    return (
        <div
            ref={resumeCardRef}
            className="h-full w-full 
                 px-2 py-2
                 rounded-2xl
                "
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                className="scroll-reveal h-full rounded-xl 
            
               cursor-pointer transition-transform duration-300"
                onClick={() => onExpand('resume')}
                style={{
                    background: 'rgba(var(--contrast-rgb), 0.05)',
                    borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                }}
            >
                {profile?.cvImg ? (
                    <img src={profile.cvImg} alt="Resume  Preview" className="w-full h-full   rounded-xl opacity-50 
                    transition-all duration-300 ease-in-out hover:opacity-100" />
                ) : (
                    profile?.cv && (profile.cv.endsWith('.jpg') || profile.cv.endsWith('.png')) ? (
                        <img src={profile.cv} alt="Resume Preview" className="w-full h-full object-cover rounded-xl opacity-80" />
                    ) : (
                        <FileText
                            size={48}
                            style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }}
                        />
                    )
                )}
            </div>


        </div>
    );
};

export default AboutMeResume;
