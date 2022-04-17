class Token {
    #state = []
    constructor(state = []) {
        if (state.length > 0) {
            this.#state = state
        }
    }

    toString() {
        return this.#state.toString();
    }
}

/**
 * Singleton syntax ingestor.
 * 
 * Once instantiated, no other instances can be created.
 * This is to ensure that there is only one. New instances will
 * only return the already created instance.
 * 
 * The ingestor contains a library of accepted tokens, represented
 * as a string of hex color codes, mapped to an instruction for the bit
 * tape. 
 */
class Ingestor {
    static #instance;
    #lib;
    constructor() {
        if (Ingestor.#instance) {
            return Ingestor.#instance
        }
        Ingestor.#instance = this;
        // Internal library of patterns
        this.#lib = {
            "#000000,#000000,#000000,#ffffff,#ffffff,#ffffff,#000000,#000000,#000000,#ffffff,#ffffff,#ffffff,#000000,#000000,#000000": "Backward",
            "#ff0000,#ff0000,#ff0000,#ff8c00,#ff8c00,#ff8c00,#ffff00,#ffff00,#ffff00,#008026,#008026,#008026,#0000ff,#0000ff,#0000ff": "Forward",
            "#80d9ff,#80d9ff,#80d9ff,#ffaec9,#ffaec9,#ffaec9,#ffffff,#ffffff,#ffffff,#ffaec9,#ffaec9,#ffaec9,#80d9ff,#80d9ff,#80d9ff": "Swap",
            "#000000,#000000,#000000,#a3a3a3,#a3a3a3,#a3a3a3,#ffffff,#ffffff,#ffffff,#800080,#800080,#800080,#800080,#800080,#800080": "Lock",
            "#d60270,#d60270,#d60270,#d60270,#d60270,#d60270,#9b4f96,#9b4f96,#9b4f96,#0038a8,#0038a8,#0038a8,#0038a8,#0038a8,#0038a8": "LShift",
            "#fcf434,#fcf434,#fcf434,#ffffff,#ffffff,#ffffff,#9c59d1,#9c59d1,#9c59d1,#000000,#000000,#000000,#000000,#000000,#000000": "RShift",
            "#000000,#000000,#000000,#d3d3d3,#d3d3d3,#d3d3d3,#b8f483,#b8f483,#b8f483,#d3d3d3,#d3d3d3,#d3d3d3,#000000,#000000,#000000": "Save" 
        }
    }

    /**
     * Ingests a token and returns instructions
     * @param {Token} token A token instance
     */
    ingest(token) {
        let key = token.toString();
        return this.#lib[key]
    }
}

/**
 * Singleton runtime environment
 */
class Environment {
    static #instance;
    /**
     * @type {[number, boolean][]}
     */
    #data;
    #head;
    #local;
    constructor() {
        if (Environment.#instance) {
            return Environment.#instance
        }
        Environment.#instance = this;
        this.#data = [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]];
        this.#head = 0;
        this.#local = [];
    }

    resetData() {
        this.#data = [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]];
        this.#head = 0;
    }

    run(cmd) {
        switch(cmd) {
            // Shifts the head backwards by one. Loops to 7 if head = 0
            case "Backward": {
                this.#head = (this.#head + 7) % 8;
            }
            // Shifts the head forward by one. Loops to 0 if head = 7
            case "Forward": {
                this.#head = (this.#head + 1) % 8;
            }
            // Swaps a bit with its opposite unless locked. 0 --> 1, 1 --> 0
            case "Swap": {
                if (!this.#data[this.#head][1]) {
                    this.#data[this.#head][0] = (this.#data[this.#head][0] + 1) % 2; 
                }
            }
            // Lock/Unlock a bit. Locking a bit prevents the Swap operation
            case "Lock": {
                this.#data[this.#head][1] = !this.#data[this.#head][1];
            }
            // Left-shifts the bit elements
            // Locked elements do not lose their lock, but their position will change.
            case "LShift": {
                this.#data.push([0, false]);
                this.#data.shift();
            }
            // Right-shifts the bit elements.
            // Locked elements do not lose their lock, but their position will change.
            case "RShift": {
                this.#data.unshift([0, false]);
                this.#data.pop();
            }
            // Converts the 8-bit string into its corresponding character and stores it.
            case "Save": {
                let s = ``;
                this.#data.forEach(v => {
                    s += `${v[0]}`
                })
                this.#local.push(String.fromCharCode(Number.parseInt(s, 2)))
                this.resetData();
            }
            default: {
                break;
            }
        }
    }

    update(cmd) {
        this.run(cmd);
        let bits = document.getElementById('bit-root');
        let head = document.getElementById('bit-head');
        if (bits.childNodes.length === 0) {
            this.#data.forEach(v => {
                let bitDiv = document.createElement('div');
                bitDiv.classList.add('bit');
                if (v[1]) {
                    bitDiv.classList.add('locked');
                }
                bitDiv.innerText = v[0]
                bits.append(bitDiv);
            })
        } else {
            Array.from(bits.children).forEach((v, i) => {
                v.innerText = this.#data[i][0];
                if (this.#data[i][1]) {
                    v.classList.add('locked')
                } else {
                    v.classList.remove('locked');
                }
            })
        }

        head.className = `at-${this.#head}`;
    }

    print() {
        console.log(this.#local.join(''))
    }
}
