import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, FileText, Check, ImagePlus } from 'lucide-react';
import mediaService from '../services/mediaService';
import { compressImage } from '../utils/imageUtils';

const MediaPickerModal = ({ isOpen, onClose, onSelect, multiple = false }) => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchFiles();
            setSelectedFiles([]);
        }
    }, [isOpen]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await mediaService.getFiles();
            setFiles(data.filter(f => f.type === 'image'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploading(true);
        try {
            let uploadFile = file;
            try {
                uploadFile = await compressImage(file);
            } catch (compErr) {
                console.warn('Compression failed, using original', compErr);
            }

            const uploadedFile = await mediaService.uploadFile(uploadFile);
            await fetchFiles(); // Refresh list
            // Optionally auto-select the uploaded file? 
            // For now just refreshing is enough, user can see it first in list (we sort desc).
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed inside picker.');
        } finally {
            setUploading(false);
        }
    };

    const toggleSelection = (file) => {
        if (multiple) {
            if (selectedFiles.some(f => f.name === file.name)) {
                setSelectedFiles(selectedFiles.filter(f => f.name !== file.name));
            } else {
                setSelectedFiles([...selectedFiles, file]);
            }
        } else {
            onSelect(file.url);
            onClose();
        }
    };

    const handleConfirm = () => {
        onSelect(selectedFiles.map(f => f.url));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-4xl h-[80vh] bg-[#0a0a0a] rounded-3xl border border-white/10 flex flex-col admin-modal-gradient">
                <header className="flex justify-between items-center p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black tracking-tighter text-white">SELECT ASSETS</h2>
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                            <ImagePlus size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{uploading ? 'Uploading...' : 'Upload New'}</span>
                        </label>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {files.map(file => {
                                const isSelected = selectedFiles.some(f => f.name === file.name);
                                return (
                                    <div
                                        key={file.name}
                                        onClick={() => toggleSelection(file)}
                                        className={`group relative aspect-square rounded-xl bg-[#0f0f0f] border overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-white/5 hover:border-primary/40'
                                            }`}
                                    >
                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="bg-primary text-black rounded-full p-1">
                                                    <Check size={16} strokeWidth={4} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-[9px] truncate px-3">
                                            {file.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {multiple && (
                    <footer className="p-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-3 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-95"
                        >
                            Confirm Selection ({selectedFiles.length})
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default MediaPickerModal;
