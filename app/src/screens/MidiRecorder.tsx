import React, { useEffect, useState } from 'react';
import KeyEvent from '@/components/KeyEvent.tsx'
import '@/styles/MidiRecorder.css';
import Piano from '@/components/Piano';
import PianoScroll from '@/components/PianoScroll';
import MidiService from '@/services/MidiService'; 

const MidiRecorder: React.FC = () => {
    const [midiService, setMidiService] = useState<MidiService | null>(null);
    const [pianoEvents, setPianoEvents] = useState<Map<number, KeyEvent[]>>(new Map());

    const handleKeyPress = (keyIndex: number, pressTime: number) => {
        setPianoEvents((prev) => {
            const newPressedKeys = new Map(prev);
    
            // If the key doesn't exist, initialize it with an empty array
            if (!newPressedKeys.has(keyIndex)) {
                newPressedKeys.set(keyIndex, []);
            }
    
            // Add the press event as a tuple with the release time set to -1 (indicating it's still pressed)
            const keyEvents = newPressedKeys.get(keyIndex) as KeyEvent[];
            keyEvents.push(new KeyEvent(keyIndex, pressTime, undefined));
    
            return newPressedKeys;
        });
        midiService?.playNote(keyIndex);
    };
    
    const handleKeyRelease = (keyIndex: number, releaseTime: number) => {
        setPianoEvents((prev) => {
            const newPianoEvents = new Map(prev);
    
            // If the key exists, update the last tuple with the release time
            if (newPianoEvents.has(keyIndex)) {
                const keyEvents = newPianoEvents.get(keyIndex) as KeyEvent[];
                // Find the last event where release time is still -1 and update it
                for (let i = keyEvents.length - 1; i >= 0; i--) {
                    if (keyEvents[i].endTime === undefined) {
                        keyEvents[i].endTime = releaseTime;
                        break;
                    }
                }
            }
                return newPianoEvents;
        });
        midiService?.releaseNote(keyIndex);
    };

    useEffect(() => {
        const initializeMidiService = async () => {
            const service = new MidiService();
            await service.initialize();
            setMidiService(service); // Set initialized service
        };

        initializeMidiService();
    }, []);

    if (!midiService) {
        return <div>Loading...</div>; // Show a loading state until initialized
    }

    return (
        <div className="midi-recorder">
            <PianoScroll pianoEvents={pianoEvents} />
            <Piano
                pianoEvents={pianoEvents} 
                onKeyPress={handleKeyPress} 
                onKeyRelease={handleKeyRelease} 
            />
        </div>
    );
};

export default MidiRecorder;
