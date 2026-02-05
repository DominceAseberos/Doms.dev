import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { getIconByName } from "@shared/utils/IconRegistry";

const AdminProjectCard = ({ project, onEdit, onDelete }) => {

    const IconWrapper = ({ name, className }) => {
        const Icon = getIconByName(name);
        return <Icon size={12} className={className || "text-primary opacity-80"} />;
    };

    return (
        <div
            className="project-card-admin rounded-2xl border border-white/5 bg-[#0f0f0f] overflow-hidden group hover:border-primary/20 transition-all flex flex-col shadow-2xl"
        >
            <div className="aspect-video w-full bg-black/40 relative group overflow-hidden">
                <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-baseline">
                    <span className="text-[9px] uppercase font-black tracking-widest px-2.5 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-white">
                        {project.project_type}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">{project.title}</h3>
                        <span className="text-[10px] font-mono opacity-20">#{project.display_order}</span>
                    </div>
                    <p className="text-[10px] opacity-40 font-mono uppercase tracking-wider">{project.date_created}</p>
                </div>

                <p className="text-xs opacity-50 line-clamp-2 leading-relaxed font-inter">
                    {project.short_description}
                </p>

                <div className="flex flex-wrap gap-1.5 opacity-80">
                    {project.stacks?.slice(0, 4).map(s => (
                        <div key={s} className="w-6 h-6 rounded bg-white/5 flex items-center justify-center border border-white/5 hover:border-primary/30 transition-colors" title={s}>
                            <IconWrapper name={s} />
                        </div>
                    ))}
                    {project.stacks?.length > 4 && <span className="text-[8px] self-end opacity-40">+{project.stacks.length - 4}</span>}
                </div>

                <div className="mt-auto pt-5 flex gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-[0.15em] transition-all active:scale-95 cursor-pointer"
                    >
                        <Edit2 size={12} /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95 cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProjectCard;
