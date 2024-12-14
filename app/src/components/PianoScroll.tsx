import React, { useState, useEffect } from 'react';
import '@/styles/PianoScroll.css';

interface PianoScrollProps {
    pressedKeys: Set<number>; // MIDI note numbers for currently pressed keys
}

const PianoScroll: React.FC<PianoScrollProps> = ({ pressedKeys }) => {
    const [columnWidth, setColumnWidth] = useState<number>(10);

    const keys = Array.from({ length: 88 }, (_, i) => i);

    // Define positions of white and black keys within an octave (starting from C)
    const whiteKeyPositions = [0, 2, 3, 5, 7, 8, 10];
    const blackKeyPositions = [1, 4, 6, 9, 11];

    // Create arrays for white and black keys
    const whiteKeys = keys.filter(key => whiteKeyPositions.includes(key % 12));
    const blackKeys = keys.filter(key => blackKeyPositions.includes(key % 12));

    const calculateColumnWidth = () => {
        const screenWidth = window.innerWidth; // Get screen width
        const columnWidth = screenWidth / (52 * 4);

        setColumnWidth(columnWidth); // Update the state with the new column width
    };

    useEffect(() => {
        calculateColumnWidth();
        window.addEventListener('resize', calculateColumnWidth); // Recalculate on window resize

        return () => {
            window.removeEventListener('resize', calculateColumnWidth);
        };
    }, []);

    const isPressed = (keyIndex: number) => {
        return pressedKeys.has(keyIndex);
    };

    return (
        <div className="piano-scroll">
            {/* Bottom Layer: White Lanes */}
            <div className="white-lanes">
                {whiteKeys.map((keyIndex, i) => {
                    const leftOffset = i * 4 * columnWidth;
                    const left = Math.round(leftOffset);
                    const width = Math.round(columnWidth * 4);
                    return (
                        <div
                            key={keyIndex}
                            className={`white-lane ${isPressed(keyIndex) ? 'pressed' : ''}`}
                            style={{
                                left: `${left}px`, // Position based on column width
                                width: `${width}px`, // 4 columns per white key
                            }}
                        ></div>
                    );
                })}
            </div>

            {/* Top Layer: Black Lanes */}
            <div className="black-lanes">
                {blackKeys.map((keyIndex, i) => {
                    const leftOffset = keyIndex * 2 * columnWidth;
                    const interOctaveOffset = Math.floor((i) / 5) * 4 * columnWidth;
                    const intraOctaveOffset = ([1, 3, 3, 5, 5][i % 5]) * columnWidth;
                    const left = Math.round(leftOffset + intraOctaveOffset + interOctaveOffset);
                    const width = Math.round(columnWidth * 2);
                    return (
                        <div
                            key={keyIndex}
                            className={`black-lane ${isPressed(keyIndex) ? 'pressed' : ''}`}
                            style={{
                                left: `${left}px`, // Position based on column width
                                width: `${width}px`, // 2 columns per white lane
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default PianoScroll;
