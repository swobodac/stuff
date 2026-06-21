(function(Scratch) {
  'use strict';
  class generator {
    getInfo() {
      return {
        id: "generator",
        name: "incredible generator",
        blocks: [
          {
            opcode: 'generate',
            text: 'generate me a powerful engine',
            blockType: Scratch.BlockType.COMMAND
          },
                  {
            opcode: 'generateBoring',
            text: 'generate me a boring engine',
            blockType: Scratch.BlockType.COMMAND
          },
                            {
            opcode: 'generateLaggy',
            text: 'generate me a laggy  engine',
            blockType: Scratch.BlockType.COMMAND
          },
                                                {
            opcode: 'generatePeak',
            text: 'generate me a peak mod (might take a bit)',
            blockType: Scratch.BlockType.COMMAND
          },
                                      {
            opcode: 'generateSlop',
            text: 'generate me a oc slop mod (might take a bit)',
            blockType: Scratch.BlockType.COMMAND
          },
                                                {
            opcode: 'generateRealisticSlop',
            text: 'generate me a realistic "realm" mod (might take a bit)',
            blockType: Scratch.BlockType.COMMAND
          },
        ]
      };
    }

    loadPMPFromURL(pmpLink)
    {
          const open = `https://studio.penguinmod.com/editor.html?project_url=${pmpLink}`;
     (window.location.href =  open) || Scratch.redirect(open);
    }

    generate() {
      this.loadPMPFromURL('https://ks4.dev/pmp/ks4-engine-v0.561.pmp')
    }
        generateBoring() {
      this.loadPMPFromURL('https://files.catbox.moe/b41v67.sb3')
    }
            generateLaggy() {
      this.loadPMPFromURL('https://files.catbox.moe/ohtdds.pmp')
    }
    generateSlop()
    {
this.loadPMPFromURL('https://files.catbox.moe/rmt6ox.sb3')
    }
    generatePeak()
  {
  this.loadPMPFromURL('https://files.catbox.moe/e7y2xj.pmp')
  }
  generateRealisticSlop()
  {
  this.loadPMPFromURL('https://files.catbox.moe/uwvtim.sb3')
  }
  }

  Scratch.extensions.register(new generator());
})(Scratch);
