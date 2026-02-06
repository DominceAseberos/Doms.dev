/**
 * Asset Preloader Utility
 * Preloads fonts and critical images for Phase 1 of loading
 */

export const preloadAssets = (onProgress) => {
    return new Promise((resolve) => {
        const assets = [
            // Fonts to preload
            { type: 'font', name: 'Orbitron', family: 'Orbitron' },
            { type: 'font', name: 'Audiowide', family: 'Audiowide' },
            { type: 'font', name: 'Bebas Neue', family: 'Bebas Neue' },
            { type: 'font', name: 'Rajdhani', family: 'Rajdhani' },
            { type: 'font', name: 'Playfair Display', family: 'Playfair Display' },
        ];

        let loaded = 0;
        const total = assets.length;

        const checkFont = async (font) => {
            try {
                // Use CSS Font Loading API to check if font is loaded
                await document.fonts.load(`16px "${font.family}"`);
                return true;
            } catch (e) {
                if (import.meta.env.DEV) console.warn(`Failed to load font: ${font.family}`, e);
                return false;
            }
        };

        const loadAsset = async (asset) => {
            if (asset.type === 'font') {
                await checkFont(asset);
            }

            loaded++;
            onProgress?.(loaded, total, asset);

            if (loaded === total) {
                resolve();
            }
        };

        // Load all assets
        assets.forEach(asset => loadAsset(asset));
    });
};
