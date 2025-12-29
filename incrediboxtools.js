// I made this with gemini since i suck at js:sob:

(function(Scratch) {
  'use strict';

  class IncrediboxEngine {
    constructor() {
      // Internal state management
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
            allowDropAnywhere: true,
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
            allowDropAnywhere: true,
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'outfit' }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Character Events'
          },
          {
            opcode: 'whenCharacterPlaced',
            blockType: Scratch.BlockType.HAT,
            text: 'when character [NAME] is placed',
            isEdgeActivated: false,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' }
            }
          },
          {
            opcode: 'whenCharacterRemoved',
            blockType: Scratch.BlockType.HAT,
            text: 'when character [NAME] is removed',
            isEdgeActivated: false,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' }
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
          },
          {
            opcode: 'removeCharacterByName',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove character [NAME] from a polo',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Definitions & Categories'
          },
          {
            opcode: 'addCharacter',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add character with name [NAME] in category [CATEGORY]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' },
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beats' }
            }
          },
          {
            opcode: 'getCharactersByCategory',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get characters in category [CATEGORY]',
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beats' }
            }
          },
          {
            opcode: 'getCurrentCategories',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current categories'
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
        this.polos[id].muted = (id !== targetId);
      }
    }

    unsoloAll() {
      this.currentSolo = "none";
      for (const id in this.polos) {
        this.polos[id].muted = false;
      }
    }

    getCurrentSolo() { return this.currentSolo; }

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

    addCharacter(args) {
      const exists = this.characters.some(c => c.name === args.NAME && c.category === args.CATEGORY);
      if (!exists) {
        this.characters.push({ name: args.NAME, category: args.CATEGORY });
      }
    }

    getCharactersByCategory(args) {
      return JSON.stringify(this.characters.filter(c => c.category === args.CATEGORY).map(c => c.name));
    }

    getCurrentCategories() {
      return JSON.stringify([...new Set(this.characters.map(c => c.category))]);
    }

    placeCharacter(args, util) {
      const id = String(args.POLO_ID);
      if (this.polos[id]) {
        this.polos[id].character = args.NAME;
        if (util && util.startHats) util.startHats('incrediboxEngine_whenCharacterPlaced', { NAME: args.NAME });
      }
    }

    removeCharacterByName(args, util) {
      for (const id in this.polos) {
        if (this.polos[id].character === args.NAME) {
          this.polos[id].character = null;
          if (util && util.startHats) util.startHats('incrediboxEngine_whenCharacterRemoved', { NAME: args.NAME });
        }
      }
    }

    addPolo(args) {
      const id = String(args.ID);
      if (!this.polos[id]) {
        this.polos[id] = { character: null, volume: 100, muted: false, position: 0, custom: {} };
      }
    }

    setLoopId(args) { this.currentLoopId = String(args.ID); }
    getLoopId() { return this.currentLoopId; }
    whenLoopStarted() { return false; }
    playLoopWithData(args, util) {
      if (args.DATA && args.DATA.startsWith('{')) {
        this.currentLoopData = args.DATA;
        if (util && util.startHats) util.startHats('incrediboxEngine_whenLoopStarted');
      }
    }
  }

  Scratch.extensions.register(new IncrediboxEngine());
})(Scratch);
