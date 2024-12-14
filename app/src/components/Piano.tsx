import React, { useState, useEffect } from 'react';
import '@/styles/Piano.css';

interface PianoProps {
    pressedKeys: Set<number>; // MIDI note numbers for currently pressed keys
    onKeyPress: (keyIndex: number) => void;
    onKeyRelease: (keyIndex: number) => void;
}

const Piano: React.FC<PianoProps> = ({ pressedKeys, onKeyPress, onKeyRelease }) => {
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

    const handleMouseDown = (keyIndex: number) => {
        onKeyPress(keyIndex); // Notify the parent that the key is pressed
    };

    const handleMouseUp = (keyIndex: number) => {
        onKeyRelease(keyIndex); // Notify the parent that the key is released
    };

    const handleMouseLeave = (keyIndex: number) => {
        onKeyRelease(keyIndex); // If the mouse leaves, treat it as a release
    };

    return (
        <div className="piano">
            {/* Bottom Layer: White Keys */}
            <div className="white-keys">
                {whiteKeys.map((keyIndex, i) => {
                    const leftOffset = i * 4 * columnWidth;
                    const left = Math.round(leftOffset);
                    const width = Math.round(columnWidth * 4);
                    return (<div
                        key={keyIndex}
                        onClick={() => console.log(keyIndex, i)}
                        onMouseDown={() => handleMouseDown(keyIndex)}
                        onMouseUp={() => handleMouseUp(keyIndex)}
                        onMouseLeave={() => handleMouseLeave(keyIndex)} // Optional, handles mouse leaving key
                        className={`white-key ${isPressed(keyIndex) ? 'pressed' : ''}`}
                        style={{
                            left: `${left}px`, // Position based on column width
                            width: `${width}px`, // 4 columns per white key
                        }}
                    ></div>);
                })}
            </div>

            {/* Top Layer: Black Keys */}
            <div className="black-keys">
                {blackKeys.map((keyIndex, i) => {
                    const leftOffset = keyIndex * 2 * columnWidth;
                    const interOctaveOffset = Math.floor((i) / 5) * 4 * columnWidth;
                    const intraOctaveOffset = ([1, 3, 3, 5, 5][i % 5]) * columnWidth;
                    const left = Math.round(leftOffset + intraOctaveOffset + interOctaveOffset);
                    const width = Math.round(columnWidth * 2);
                    return (
                        <div
                            key={keyIndex}
                            onClick={() => console.log(keyIndex, i)}
                            onMouseDown={() => handleMouseDown(keyIndex)}
                            onMouseUp={() => handleMouseUp(keyIndex)}
                            onMouseLeave={() => handleMouseLeave(keyIndex)} // Optional, handles mouse leaving key
                            className={`black-key ${isPressed(keyIndex) ? 'pressed' : ''}`}
                            style={{
                                left: `${left}px`, // Position based on column width
                                width: `${width}px`, // 2 columns per white key
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default Piano;
