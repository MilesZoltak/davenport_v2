import React, { useState, useEffect } from 'react';
import KeyEvent from './KeyEvent.tsx';
import '@/styles/PianoScroll.css';

interface PianoScrollProps {
    pianoEvents: Map<number, KeyEvent[]>; // Map of key index to [(pressTime, releaseTime)]
}

const PianoScroll: React.FC<PianoScrollProps> = ({ pianoEvents }) => {
    const [columnWidth, setColumnWidth] = useState<number>(10);
    const [currentTime, setCurrentTime] = useState<number>(performance.now()); // Track current time for animations

    const PIANO_HEIGHT = window.innerWidth / 52 * 6;
    const SCROLL_SPEED = 0.1; // Pixels per millisecond

    const keys = Array.from({ length: 88 }, (_, i) => i);

    // Define positions of white and black keys within an octave (starting from C)
    const whiteKeyPositions = [0, 2, 3, 5, 7, 8, 10];
    const blackKeyPositions = [1, 4, 6, 9, 11];

    const whiteKeys = keys.filter(key => whiteKeyPositions.includes(key % 12));
    const blackKeys = keys.filter(key => blackKeyPositions.includes(key % 12));

    const calculateColumnWidth = () => {
        const screenWidth = window.innerWidth; // Get screen width
        const columnWidth = screenWidth / (52 * 4);
        setColumnWidth(columnWidth);
    };

    useEffect(() => {
        calculateColumnWidth();
        window.addEventListener('resize', calculateColumnWidth);

        return () => {
            window.removeEventListener('resize', calculateColumnWidth);
        };
    }, []);

    useEffect(() => {
        // Animation loop to update `currentTime`
        let animationFrameId: number;

        const update = () => {
            setCurrentTime(performance.now()); // Update time to trigger re-renders
            animationFrameId = requestAnimationFrame(update); // Schedule next frame
        };

        update(); // Start the animation loop

        return () => {
            cancelAnimationFrame(animationFrameId); // Clean up animation loop on unmount
        };
    }, []);

    return (
        <div className="piano-scroll">
            {/* Bottom Layer: White Lanes */}
            <div className="white-lanes">
                {whiteKeys.map((keyIndex, i) => {
                    const leftOffset = i * 4 * columnWidth;
                    const left = Math.round(leftOffset);
                    const width = Math.round(columnWidth * 4);

                    const keyEvents = pianoEvents.get(keyIndex)?.filter(pe => {
                        const endPress = pe.endTime ?? currentTime;
                        const scrollPosition = window.innerHeight - (currentTime - pe.startTime) * SCROLL_SPEED;
                        return scrollPosition + (endPress - pe.startTime) * SCROLL_SPEED > 0;
                    });

                    return (
                        <div
                            key={keyIndex}
                            className={`white-lane`}
                            style={{
                                left: `${left}px`,
                                width: `${width}px`,
                            }}
                        >
                            {keyEvents?.map((ev, i) => {
                                const PIANO_HEIGHT = window.innerWidth / 52 * 6;
                                const topPosition = window.innerHeight - PIANO_HEIGHT - (currentTime - ev.startTime) * SCROLL_SPEED;
                                const duration = (ev.endTime ?? currentTime) - ev.startTime;

                                return (
                                    <div
                                        key={i}
                                        className="scrolling-note"
                                        style={{
                                            position: 'absolute',
                                            top: `${topPosition}px`,
                                            height: `${duration * SCROLL_SPEED}px`,
                                            backgroundColor: 'rgba(0, 0, 255, 0.5)',
                                            width: '100%',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Top Layer: Black Lanes */}
            <div className="black-lanes">
                {blackKeys.map((keyIndex, i) => {
                    const leftOffset = keyIndex * 2 * columnWidth;
                    const interOctaveOffset = Math.floor(i / 5) * 4 * columnWidth;
                    const intraOctaveOffset = [1, 3, 3, 5, 5][i % 5] * columnWidth;
                    const left = Math.round(leftOffset + intraOctaveOffset + interOctaveOffset);
                    const width = Math.round(columnWidth * 2);

                    const keyEvents = pianoEvents.get(keyIndex)?.filter(pe => {
                        const endPress = pe.endTime ?? currentTime;
                        const scrollPosition = window.innerHeight - (currentTime - pe.startTime) * SCROLL_SPEED;
                        return scrollPosition + (endPress - pe.startTime) * SCROLL_SPEED > 0;
                    });

                    return (
                        <div
                            key={keyIndex}
                            className="black-lane"
                            style={{
                                left: `${left}px`,
                                width: `${width}px`,
                            }}
                        >
                            {keyEvents?.map((ev, i) => {
                                const topPosition = window.innerHeight - PIANO_HEIGHT - (currentTime - ev.startTime) * SCROLL_SPEED;
                                const duration = (ev.endTime ?? currentTime) - ev.startTime;

                                return (
                                    <div
                                        key={i}
                                        className="scrolling-note"
                                        style={{
                                            position: 'absolute',
                                            top: `${topPosition}px`,
                                            height: `${duration * SCROLL_SPEED}px`,
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            width: '100%',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PianoScroll;
