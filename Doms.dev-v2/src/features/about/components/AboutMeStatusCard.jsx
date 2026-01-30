import { Link } from 'react-router-dom';

const AboutMeStatusCard = () => {
    return (
        <div
            className="
                h-66 flex items-center justify-center
                md:col-span-2 md:h-50
                lg:col-span-3 lg:aspect-square lg:h-auto
                rounded-2xl border p-6
                border-white/5 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <Link to="/feed">
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-semibold" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                    Go to Feed
                </button>
            </Link>
        </div>
    );
};

export default AboutMeStatusCard;
