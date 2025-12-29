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
            blockType: Scratch.BlockType.LABEL,
            text: 'Solo & Mute Controls'
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
            opcode: 'unsoloPolo',
            blockType: Scratch.BlockType.COMMAND,
            text: 'unsolo polo [ID]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          {
            opcode: 'unsoloAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'unsolo all polos'
          },
          {
            opcode: 'getCurrentSolo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'currently soloed polo'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Polo Properties'
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
            allowDropAnywhere: true,
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: 'poloProps',
                defaultValue: 'position'
              }
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

    // --- Solo/Unsolo Logic ---
    soloPolo(args) {
      const targetId = String(args.ID);
      this.currentSolo = targetId;
      for (const id in this.polos) {
        this.polos[id].muted = (id !== targetId);
      }
    }

    unsoloPolo(args) {
      const targetId = String(args.ID);
      // Only trigger unsolo logic if this polo was actually the one soloed
      if (this.currentSolo === targetId) {
        this.unsoloAll();
      }
    }

    unsoloAll() {
      this.currentSolo = "none";
      for (const id in this.polos) {
        this.polos[id].muted = false;
      }
    }

    getCurrentSolo() {
      return this.currentSolo;
    }

    // --- Property Logic ---
    setPoloProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) {
        let val = args.VALUE;
        if (typeof val === 'string' && val.startsWith('{')) {
          try { val = JSON.parse(val); } catch (e) {}
        }
        if (args.PROP === 'volume' && typeof val !== 'object') val = Number(val);
        if (args.PROP === 'muted') {
          val = (val === 'true' || val === true);
          // If manually unmuting a polo that wasn't soloed, we break the solo state
          if (val === false && this.currentSolo !== "none" && id !== this.currentSolo) {
            this.currentSolo = "none";
          }
        }
        this.polos[id][args.PROP] = val;
      }
    }

    getPoloProperty(args) {
      const id = String(args.ID);
      return (this.polos[id]) ? this.polos[id][args.PROP] : "";
    }

    addPolo(args) {
      const id = String(args.ID);
      if (!this.polos[id]) {
        this.polos[id] = { character: null, volume: 100, muted: false, position: 0, custom: {} };
      }
    }

    // --- Rest of Core Logic ---
    setLoopId(args) { this.currentLoopId = String(args.ID); }
    getLoopId() { return this.currentLoopId; }
    whenLoopStarted() { return false; }
    generateLoopData(args) {
      return JSON.stringify({ bpm: Number(args.BPM) || 120, bars: Number(args.BARS) || 4, bpb: Number(args.BPB) || 4 });
    }
  }

  Scratch.extensions.register(new IncrediboxEngine());
})(Scratch);
