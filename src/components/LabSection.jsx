import React from 'react';

const LabSection = () => {
    return (
        <section className="relative min-h-screen bg-[#f2ede6] text-[#0a0a08] flex items-center justify-center pt-32 pb-32 z-20">
            <div className="container max-w-6xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-[#0a0a08]">The Lab</h2>
                    <p className="text-lg text-[#5a5654] max-w-2xl">Smaller experiments, prototypes, and open source contributions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 font-mono text-sm">Preview Image</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">WebGPU Compute</h3>
                        <p className="text-sm text-gray-500 mb-6">Fluid simulation running natively in the browser using WebGPU.</p>
                        <a href="#" className="font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3e] px-4 py-2 rounded-full hover:bg-black hover:text-[#c8ff3e] transition-colors">View Code ↗</a>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 font-mono text-sm">Preview Image</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">CSS 3D Engine</h3>
                        <p className="text-sm text-gray-500 mb-6">A simple 3D rendering engine built without WebGL, using only CSS transforms.</p>
                        <a href="#" className="font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3e] px-4 py-2 rounded-full hover:bg-black hover:text-[#c8ff3e] transition-colors">View Code ↗</a>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 font-mono text-sm">Preview Image</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Rust Wasm Parser</h3>
                        <p className="text-sm text-gray-500 mb-6">High-performance markdown parser compiled to WebAssembly from Rust.</p>
                        <a href="#" className="font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3e] px-4 py-2 rounded-full hover:bg-black hover:text-[#c8ff3e] transition-colors">View Code ↗</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LabSection;
