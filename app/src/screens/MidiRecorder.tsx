import React, { useState } from 'react';
import '@/styles/MidiRecorder.css';
import Piano from '../components/Piano';
import PianoScroll from '../components/PianoScroll';

const MidiRecorder: React.FC = () => {
    const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

    const handleKeyPress = (keyIndex: number) => {
        setPressedKeys((prev) => new Set(prev).add(keyIndex));
    };

    const handleKeyRelease = (keyIndex: number) => {
        setPressedKeys((prev) => {
            const newPressedKeys = new Set(prev);
            newPressedKeys.delete(keyIndex);
            return newPressedKeys;
        });
    };

    return (
        <div className="midi-recorder">
            <PianoScroll pressedKeys={pressedKeys} />
            <Piano 
                pressedKeys={pressedKeys} 
                onKeyPress={handleKeyPress} 
                onKeyRelease={handleKeyRelease} 
            />
        </div>
    );
};

export default MidiRecorder;
