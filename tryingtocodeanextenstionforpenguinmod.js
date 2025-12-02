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
            text: 'log [TEXT] to console',
            blockType: Scratch.BlockType.COMMAND
			  arguments: {
		  TEXT:{}
			  }
          },
          {
            opcode: 'testReporter',
            text: 'testing!',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
	    allowDropAnywhere: true
          },
			          {
            opcode: 'random',
            text: 'randomize true & false yay',
            blockType: Scratch.BlockType.BOOLEAN,
			disableMonitor: true
          }
        ]
      };
    }

    logToConsole() {
      console.log('Hello world!');
    }
    testReporter() {
      return "Hello world!";
    }
	      random() {
      return Math.round(Math.random()) === 1;
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
