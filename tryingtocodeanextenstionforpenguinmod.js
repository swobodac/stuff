(function(Scratch) {
  'use strict';
  class Extension {
    getInfo() {
      return {
        id: "johnMyExtension",
        name: "My Extension",
        blocks: [
          {
            opcode: 'logToConsole',
            text: 'log to console',
            blockType: Scratch.BlockType.COMMAND
          },
          {
            opcode: 'hi',
            text: 'say, hi',
            blockType: Scratch.BlockType.REPORTER,
            disableMonintor: true,
            allowDropAnywhere: true
          }
        ]
      };
    }

    logToConsole() {
      console.log('Hello world!');
    }
        hi() {
      return "hi";
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
