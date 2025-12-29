// I made this with gemini since i suck at js:sob:

(function(Scratch) {
  'use strict';

  class IncrediboxEngine {
    constructor() {
      // Internal state management
      this.currentLoopData = ""; 
      this.polos = {}; 
      this.currentSolo = "none";
      
      if (Scratch.vm) {
        Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
          this.currentLoopData = "";
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
          // Credits Labels
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
            opcode: 'playLoopWithData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play loop with data [DATA]',
            arguments: {
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Polo Solo & Mute'
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
                defaultValue: 'volume'
              },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '100' }
            }
          },
          {
            opcode: 'getPoloProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get polo [ID] [PROP]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: 'poloProps',
                defaultValue: 'volume'
              }
            }
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

    // --- Logic ---
    soloPolo(args) {
      const targetId = String(args.ID);
      this.currentSolo = targetId;

      for (const id in this.polos) {
        // Mute everyone else, unmute the solo target
        this.polos[id].muted = (id !== targetId);
      }
    }

    getCurrentSolo() {
      return this.currentSolo;
    }

    whenLoopStarted() { return false; }

    generateLoopData(args) {
      return JSON.stringify({
        bpm: Number(args.BPM) || 120,
        bars: Number(args.BARS) || 4,
        bpb: Number(args.BPB) || 4
      });
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
        this.polos[id] = {
          character: null,
          volume: 100,
          muted: false,
          position: 0,
          custom: {}
        };
      }
    }

    placeCharacter(args) {
      const id = String(args.POLO_ID);
      if (this.polos[id]) this.polos[id].character = args.NAME;
    }

    setPoloProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) {
        let val = args.VALUE;
        if (args.PROP === 'volume' || args.PROP === 'position') val = Number(val);
        if (args.PROP === 'muted') {
          val = (val === 'true' || val === true);
          // If manually unmuting a polo while another is soloed, clear the solo state
          if (val === false && this.currentSolo !== "none" && id !== this.currentSolo) {
            this.currentSolo = "none";
          }
        }
        this.polos[id][args.PROP] = val;
      }
    }

    getPoloProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) return this.polos[id][args.PROP];
      return "";
    }

    setCustomProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) this.polos[id].custom[args.PROP] = args.VALUE;
    }

    getCustomProperty(args) {
      const id = String(args.ID);
      if (this.polos[id] && this.polos[id].custom[args.PROP] !== undefined) {
        return this.polos[id].custom[args.PROP];
      }
      return "";
    }
  }

  Scratch.extensions.register(new IncrediboxEngine());
})(Scratch);
