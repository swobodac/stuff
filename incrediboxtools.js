// I made this with gemini since i suck at js:sob:

(function(Scratch) {
  'use strict';

  class IncrediboxEngine {
    constructor() {
      this.currentLoopData = ""; 
      this.currentLoopId = "none";
      this.polos = {}; 
      this.characters = []; 
      this.currentSolo = "none";
      
      if (Scratch.vm) {
        Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
          this.currentLoopData = "";
          this.currentLoopId = "none";
          this.polos = {};
          this.currentSolo = "none";
        });
      }
    }

    getInfo() {
      return {
        id: 'incrediboxEngine',
        name: 'Incrediengine Tools',
        color1: '#7A7A7A',
        color2: '#666666',
        color3: '#555555',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "I made this using Google Gemini,"
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "im not good at using javascript."
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Loop System'
          },
          {
            opcode: 'whenLoopStarted',
            blockType: Scratch.BlockType.HAT,
            text: 'when a loop has started',
            isEdgeActivated: false
          },
          {
            opcode: 'generateLoopData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'generate loop data using BPM: [BPM] bars: [BARS] beats per bar: [BPB]',
            arguments: {
              BPM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 },
              BARS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              BPB: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          {
            opcode: 'setLoopId',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loop id to [ID]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'beat1' }
            }
          },
          {
            opcode: 'getLoopId',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current loop id'
          },
          {
            opcode: 'playLoopWithData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play loop with data [DATA]',
            arguments: {
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Polo Properties (Vector Support)'
          },
          {
            opcode: 'addPolo',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add polo with id [ID]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          {
            opcode: 'setPoloProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set polo [ID] [PROP] to [VALUE]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: 'poloProps',
                defaultValue: 'position'
              },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
            }
          },
          {
            opcode: 'getPoloProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get polo [ID] [PROP]',
            // --- CRITICAL FIX FOR VECTOR BLOCKS ---
            allowDropAnywhere: true, 
            // --------------------------------------
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: 'poloProps',
                defaultValue: 'position'
              }
            }
          },
          {
            opcode: 'soloPolo',
            blockType: Scratch.BlockType.COMMAND,
            text: 'solo polo [ID]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Custom Data & Characters'
          },
          {
            opcode: 'setCustomProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set custom property [PROP] on polo [ID] to [VALUE]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'outfit' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'classic' }
            }
          },
          {
            opcode: 'getCustomProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get custom property [PROP] from polo [ID]',
            // --- CRITICAL FIX FOR VECTOR BLOCKS ---
            allowDropAnywhere: true,
            // --------------------------------------
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'outfit' }
            }
          },
          {
            opcode: 'placeCharacter',
            blockType: Scratch.BlockType.COMMAND,
            text: 'place [NAME] on polo [POLO_ID]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' },
              POLO_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          }
        ],
        menus: {
          poloProps: {
            acceptReporters: true,
            items: ['volume', 'muted', 'position', 'character']
          }
        }
      };
    }

    // --- Vector Logic ---
    setPoloProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) {
        let val = args.VALUE;
        // Handle incoming objects/vectors
        if (typeof val === 'string' && val.startsWith('{')) {
          try { val = JSON.parse(val); } catch (e) {}
        }
        if (args.PROP === 'volume' && typeof val !== 'object') val = Number(val);
        if (args.PROP === 'muted') val = (val === 'true' || val === true);
        this.polos[id][args.PROP] = val;
      }
    }

    getPoloProperty(args) {
      const id = String(args.ID);
      return (this.polos[id]) ? this.polos[id][args.PROP] : "";
    }

    setCustomProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) {
        let val = args.VALUE;
        if (typeof val === 'string' && val.startsWith('{')) {
          try { val = JSON.parse(val); } catch (e) {}
        }
        this.polos[id].custom[args.PROP] = val;
      }
    }

    getCustomProperty(args) {
      const id = String(args.ID);
      if (this.polos[id] && this.polos[id].custom[args.PROP] !== undefined) {
        return this.polos[id].custom[args.PROP];
      }
      return "";
    }

    // --- Core Logic ---
    setLoopId(args) { this.currentLoopId = String(args.ID); }
    getLoopId() { return this.currentLoopId; }
    whenLoopStarted() { return false; }
    soloPolo(args) {
      const targetId = String(args.ID);
      this.currentSolo = targetId;
      for (const id in this.polos) {
        this.polos[id].muted = (id !== targetId);
      }
    }
    generateLoopData(args) {
      return JSON.stringify({ bpm: Number(args.BPM) || 120, bars: Number(args.BARS) || 4, bpb: Number(args.BPB) || 4 });
    }
    playLoopWithData(args, util) {
      if (args.DATA && args.DATA.startsWith('{')) {
        this.currentLoopData = args.DATA;
        if (util && util.startHats) util.startHats('incrediboxEngine_whenLoopStarted');
      }
    }
    addPolo(args) {
      const id = String(args.ID);
      if (!this.polos[id]) {
        this.polos[id] = { character: null, volume: 100, muted: false, position: 0, custom: {} };
      }
    }
    placeCharacter(args) {
      const id = String(args.POLO_ID);
      if (this.polos[id]) this.polos[id].character = args.NAME;
    }
  }

  Scratch.extensions.register(new IncrediboxEngine());
})(Scratch);
