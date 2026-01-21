import React, { useState, useEffect } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";

const Whiteboard = () => {
    return (
        <div className="h-full w-full bg-white">
            <Excalidraw
                theme="light"
                langCode="pt-PT"
                initialData={{
                    appState: { viewBackgroundColor: "#ffffff" }
                }}
            />
        </div>
    );
};

export default Whiteboard;
