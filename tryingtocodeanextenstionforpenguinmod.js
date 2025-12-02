(function (Scratch)) {
'use strict';
  class ImLearningOK {
    getInfo(){
      return{
        id: "ImLearningOK",
        name: "My First Coded Extenstion",
        docsURI: 'https://tenor.com/view/homers-guide-homer-homer-forehead-gif-8646990802834571000',
        color1:"#F54927",
        color2:"#FC826A",
        color3:"#591000",
        blocks:[
  {
    opcode: 'logToConsole',
    text: 'log to console'
  }
]
      };
    }
  }
    LogToConsole(){
    console.log('homer, ding, homer, ding, homer, ding, homer.... ALERT ALERT');
  }
}
  Scratch.extenstions.register(new ImLearningOK());
})(Scratch);
