//i made this using google gemini since im not great a js, please dont kill me for this:sob:

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
          // --- RESTORED CREDITS ---
          { blockType: Scratch.BlockType.LABEL, text: "I made this using Google Gemini," },
          { blockType: Scratch.BlockType.LABEL, text: "im not good at using javascript." },
          
          { blockType: Scratch.BlockType.LABEL, text: '--- Loop System ---' },
          { opcode: 'whenLoopStarted', blockType: Scratch.BlockType.HAT, text: 'when a loop has started' },
          {
            opcode: 'generateLoopData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'generate loop data BPM: [BPM] Bars: [BARS] BPB: [BPB]',
            arguments: {
              BPM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 },
              BARS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              BPB: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          { opcode: 'playLoopWithData', blockType: Scratch.BlockType.COMMAND, text: 'play loop with data [DATA]', arguments: { DATA: { type: Scratch.ArgumentType.STRING, defaultValue: '' } } },
          { opcode: 'setLoopId', blockType: Scratch.BlockType.COMMAND, text: 'set loop id to [ID]', arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'beat1' } } },
          { opcode: 'getLoopId', blockType: Scratch.BlockType.REPORTER, text: 'current loop id' },

          { blockType: Scratch.BlockType.LABEL, text: '--- Solo & Mute ---' },
          { opcode: 'soloPolo', blockType: Scratch.BlockType.COMMAND, text: 'solo polo [ID]', arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' } } },
          { opcode: 'unsoloAll', blockType: Scratch.BlockType.COMMAND, text: 'unsolo all polos' },
          { opcode: 'getCurrentSolo', blockType: Scratch.BlockType.REPORTER, text: 'currently soloed polo' },

          { blockType: Scratch.BlockType.LABEL, text: '--- Character Actions ---' },
          { opcode: 'placeCharacter', blockType: Scratch.BlockType.COMMAND, text: 'place [NAME] on polo [POLO_ID]', arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' }, POLO_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' } } },
          { opcode: 'removeCharacterByName', blockType: Scratch.BlockType.COMMAND, text: 'remove character [NAME] from a polo', arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' } } },
          { opcode: 'removeAllCharacters', blockType: Scratch.BlockType.COMMAND, text: 'remove all characters' },
          { opcode: 'isSpecificCharacterPlaced', blockType: Scratch.BlockType.BOOLEAN, text: 'is character [NAME] placed?', arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' } } },
          { opcode: 'getCharacterCount', blockType: Scratch.BlockType.REPORTER, text: 'total characters placed' },

          { blockType: Scratch.BlockType.LABEL, text: '--- Polo Properties ---' },
          { opcode: 'addPolo', blockType: Scratch.BlockType.COMMAND, text: 'add polo with id [ID]', arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' } } },
          {
            opcode: 'setPoloProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set polo [ID] [PROP] to [VALUE]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              PROP: { type: Scratch.ArgumentType.STRING, menu: 'poloProps', defaultValue: 'position' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
            }
          },
          { opcode: 'getPoloProperty', blockType: Scratch.BlockType.REPORTER, text: 'get polo [ID] [PROP]', allowDropAnywhere: true, arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }, PROP: { type: Scratch.ArgumentType.STRING, menu: 'poloProps', defaultValue: 'character' } } },
          { opcode: 'setCustomProperty', blockType: Scratch.BlockType.COMMAND, text: 'set custom property [PROP] on polo [ID] to [VALUE]', arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }, PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'outfit' }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'classic' } } },
          { opcode: 'getCustomProperty', blockType: Scratch.BlockType.REPORTER, text: 'get custom property [PROP] from polo [ID]', allowDropAnywhere: true, arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }, PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'outfit' } } },

          { blockType: Scratch.BlockType.LABEL, text: '--- Definitions & Categories ---' },
          { opcode: 'addCharacter', blockType: Scratch.BlockType.COMMAND, text: 'add character [NAME] in category [CATEGORY]', arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' }, CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beats' } } },
          { opcode: 'deleteCharacterFromLibrary', blockType: Scratch.BlockType.COMMAND, text: 'delete character [NAME] from categories', arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beatboxer' } } },
          { opcode: 'getCharactersByCategory', blockType: Scratch.BlockType.REPORTER, text: 'get characters in category [CATEGORY]', arguments: { CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Beats' } } },
          { opcode: 'getCurrentCategories', blockType: Scratch.BlockType.REPORTER, text: 'current categories' }
        ],
        menus: {
          poloProps: { acceptReporters: true, items: ['volume', 'muted', 'position', 'character'] }
        }
      };
    }

    // Logic
    generateLoopData(args) { return JSON.stringify({ bpm: Number(args.BPM) || 120, bars: Number(args.BARS) || 4, bpb: Number(args.BPB) || 4 }); }
    
    setCustomProperty(args) { 
      const id = String(args.ID); 
      if (this.polos[id]) { 
        let val = args.VALUE; 
        if (typeof val === 'string' && val.startsWith('{')) { try { val = JSON.parse(val); } catch (e) {} }
        this.polos[id].custom[args.PROP] = val; 
      } 
    }

    getCustomProperty(args) { 
      const id = String(args.ID); 
      return (this.polos[id] && this.polos[id].custom[args.PROP] !== undefined) ? this.polos[id].custom[args.PROP] : ""; 
    }

    setPoloProperty(args) {
      const id = String(args.ID);
      if (this.polos[id]) {
        let val = args.VALUE;
        if (typeof val === 'string' && val.startsWith('{')) { try { val = JSON.parse(val); } catch (e) {} }
        if (args.PROP === 'volume') val = Number(val);
        if (args.PROP === 'muted') val = (val === 'true' || val === true);
        this.polos[id][args.PROP] = val;
      }
    }

    getPoloProperty(args) { const id = String(args.ID); return (this.polos[id]) ? this.polos[id][args.PROP] : ""; }
    
    addPolo(args) { 
      const id = String(args.ID); 
      if (!this.polos[id]) { this.polos[id] = { character: null, volume: 100, muted: false, position: 0, custom: {} }; } 
    }

    removeAllCharacters() { for (const id in this.polos) { this.polos[id].character = null; } }
    
    getCharacterCount() { return Object.values(this.polos).filter(p => p.character !== null).length; }
    
    isSpecificCharacterPlaced(args) { return Object.values(this.polos).some(p => p.character === args.NAME); }
    
    soloPolo(args) { 
      const targetId = String(args.ID); 
      this.currentSolo = targetId; 
      for (const id in this.polos) { this.polos[id].muted = (id !== targetId); } 
    }

    unsoloAll() { 
      this.currentSolo = "none"; 
      for (const id in this.polos) { this.polos[id].muted = false; } 
    }

    getCurrentSolo() { return this.currentSolo; }

    placeCharacter(args) { const id = String(args.POLO_ID); if (this.polos[id]) { this.polos[id].character = args.NAME; } }
    
    removeCharacterByName(args) { for (const id in this.polos) { if (this.polos[id].character === args.NAME) { this.polos[id].character = null; } } }
    
    addCharacter(args) { if (!this.characters.some(c => c.name === args.NAME)) { this.characters.push({ name: args.NAME, category: args.CATEGORY }); } }
    
    deleteCharacterFromLibrary(args) { this.characters = this.characters.filter(c => c.name !== args.NAME); }
    
    getCharactersByCategory(args) { return JSON.stringify(this.characters.filter(c => c.category === args.CATEGORY).map(c => c.name)); }
    
    getCurrentCategories() { return JSON.stringify([...new Set(this.characters.map(c => c.category))]); }
    
    setLoopId(args) { this.currentLoopId = String(args.ID); }
    getLoopId() { return this.currentLoopId; }
    
    whenLoopStarted() { return false; }
    
    playLoopWithData(args, util) { 
      if (args.DATA && util && util.startHats) util.startHats('incrediboxEngine_whenLoopStarted'); 
    }
  }

  Scratch.extensions.register(new IncrediboxEngine());
})(Scratch);
