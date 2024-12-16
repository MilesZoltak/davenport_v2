// src/services/MidiService.ts
import * as Tone from 'tone';

class MidiService {
    private synth: Tone.Synth | null = null;
    private initialized: boolean = false;

    constructor() {
        this.synth = new Tone.Synth().toDestination();
    }

    async initialize() {
        if (!this.initialized) {
            await Tone.start();
            this.initialized = true;
        }
    }

    keyIndexToNotation(keyIndex: number) {
        const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
        const note = notes[keyIndex % notes.length];
        const octave = Math.floor((keyIndex + 9) / 12);
        return `${note}${octave}`
    }

    playNote(keyIndex: number) {
        const note = this.keyIndexToNotation(keyIndex);
        if (this.synth) {
            this.synth.triggerAttack(note);
        }
    }

    releaseNote(keyIndex: number) {
        const note = this.keyIndexToNotation(keyIndex);
        if (this.synth) {
            this.synth.triggerAttack(note, "0", 0);
        }
    }
}

export default MidiService; // Default export
