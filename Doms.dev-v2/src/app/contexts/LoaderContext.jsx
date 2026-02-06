import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

/**
 * Hook to access loader state
 */
export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within LoaderProvider');
    }
    return context;
};

/**
 * Provider component to manage loader state globally
 */
export const LoaderProvider = ({ children }) => {
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const markInitialLoadComplete = () => {
        setInitialLoadComplete(true);
    };

    const resetInitialLoad = () => {
        setInitialLoadComplete(false);
    };

    return (
        <LoaderContext.Provider
            value={{
                initialLoadComplete,
                markInitialLoadComplete,
                resetInitialLoad,
            }}
        >
            {children}
        </LoaderContext.Provider>
    );
};
