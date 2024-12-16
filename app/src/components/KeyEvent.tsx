class KeyEvent {
    constructor(
        public keyIndex: number,
        public startTime: number,
        public endTime: number | undefined = undefined
    ) {}
}

export default KeyEvent;
