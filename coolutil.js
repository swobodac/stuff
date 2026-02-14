//ts has a lot of crap stolen from other pm extenstions like looks expanded, runtime, etc because i kinda suck at js:sob:
//managed to figure out some functions using dinobuilder & other pm extenstions :)

(function(Scratch) {
  'use strict';

  class CoolUtil {

    getInfo() {
      return {
        id: "coolstuff",
        name: "Cool Utilies",
    color1: "#0077ff",
    color2: "#0063d4",
        blocks: [
            {
        opcode: `txtconvertbutton`,
        blockType: Scratch.BlockType.BUTTON,
        hideFromPalette: false,
        text: `Open TXT Seqence to JSON Converter`,
            },
                    {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Calculations & Runtime`,
    },
     {
            opcode: 'clamp',
            text: 'clamp [VAL] from [MIN] to [MAX]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        VAL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
        },
                MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        },
                        MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
        }
    }
          },
                {
            opcode: 'mapVal',
            text: 'map [VAL] from [MININ] to [MAXIN] as [MINOUT] to [MAXOUT]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        VAL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
        },
                MININ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        },
                        MAXIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
        },
                        MINOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        },
                        MAXOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
        }
    }
          },
            {
            opcode: 'spriteName',
            text: 'get sprite name',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: false,
          },
                    {
            opcode: 'removeFolderName',
            text: 'get sprite name without folder name',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: false,
          },
                                                  {
            opcode: 'checkpackaged',
            text: 'check if i am packaged',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: false,
          },
            {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Positioning & Distance Checks`,
    },
            {
            opcode: 'centerusingdistance',
            text: 'get centered start x using [AMOUNT] amount of items far apart by [DIST]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        AMOUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8,
        },
                DIST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 75,
        }
    }
          },
                      {
            opcode: 'centerusingstartx',
            text: 'get distance using [AMOUNT] amount of items starting at [STARTX]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        AMOUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8,
        },
                STARTX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 270,
        }
    }
          },
          {
            opcode: 'xdistancesetbymouse',
            text: 'is my x distance [DIST] set by mouse x',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        DIST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 75,
        }
    }
          },
                    {
            opcode: 'ydistancesetbymouse',
            text: 'is my y distance [DIST] set by mouse y',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        DIST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 75,
        }
    }
          },
                      {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Timesavers & Data`,
    },
     {
            opcode: 'getcostumeid',
            text: 'get name of [ID] from this sprites costumes/backdrops',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
        }
    }
          },
            {
            opcode: 'getcostumenametoid',
            text: 'get id of costume/backdrop [COSTUME]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        COSTUME: {
                type: Scratch.ArgumentType.COSTUME,
        }
    }
          },
                                          {
            opcode: 'getcostumecontent',
            text: 'get svg data/content of costume/backdrop [COSTUME]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        COSTUME: {
                type: Scratch.ArgumentType.COSTUME,
        }
    }
          },
                      {
            opcode: 'getcostumedataurl',
            text: 'get data url of costume/backdrop [COSTUME]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        COSTUME: {
                type: Scratch.ArgumentType.COSTUME,
        }
    }
          },
                                {
            opcode: 'checksvg',
            text: 'is [COSTUME] a vector',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        COSTUME: {
                type: Scratch.ArgumentType.COSTUME,
        }
    }
          },
                         {
            opcode: 'getsoundid',
            text: 'get name of [ID] from this sprites sounds',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
        }
    }
          },
                      {
            opcode: 'getsoundnametoid',
            text: 'get id of sound [SOUND]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        SOUND: {
                type: Scratch.ArgumentType.SOUND,
        }
    }
          },
                                {
            opcode: 'getsounddataurl',
            text: 'get data url of sound [SOUND]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        SOUND: {
                type: Scratch.ArgumentType.SOUND,
        }
    }
          },
               {
            opcode: 'rawcostumedata',
            text: 'get raw costume/backdrop data (Array & Objects)',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
          },
                         {
            opcode: 'rawsounddata',
            text: 'get raw sound data (Array & Objects)',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
          },
        {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Incredimodding`,
    },
                              {
            opcode: 'simplegetlooptimeusingbpm',
            text: 'simple get loop time using bpm [BPM]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        BPM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 120,
        }
    }
          },
                      {
            opcode: 'simplebeatlength',
            text: 'simple get beat length from loop time [LOOPTIME]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        LOOPTIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8,
        }
    }
          },
                          {
            opcode: 'getlooptimeusingbpmbarsbpb',
            text: 'get loop time using bpm [BPM] beats per bar [BPB] & bars [BARS]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        BPM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 120,
        },
                BPB: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4,
        },
                        BARS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4,
        }
    }
          },
            {
            opcode: 'beatlength',
            text: 'get beat length from loop time [LOOPTIME] with [BPB] beats per bar & [BARS] bars',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        LOOPTIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8,
        },
                BPB: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4,
        },
                        BARS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4,
        }
    }
          },
                      {
            opcode: 'phasecalc',
            text: 'get loop id [VAL] + phase [PHASE] * [LOOPS] normal loops',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        VAL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
        },
                PHASE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
        },
                        LOOPS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
        }
    }
          },
        {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Devtools Console`,
    },
                        {
            opcode: 'logtxt',
            text: 'log [LOG] to console',
            blockType: Scratch.BlockType.COMMAND,
            disableMonitor: true,
            arguments: {
        LOG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello World!",
        }
    }
          },
                                  {
            opcode: 'logerrortxt',
            text: 'log error [ERROR] to console',
            blockType: Scratch.BlockType.COMMAND,
            disableMonitor: true,
            arguments: {
        ERROR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Error!",
        }
    }
          }
        ]
      };
    }

    //Block Functions yay
    centerusingdistance(args){
    const amountofitems = args["AMOUNT"];
    const distance = args["DIST"];
        return distance * (0.5 - 0.5 * amountofitems);
    }
    centerusingstartx(args){
    const amountofitems = args["AMOUNT"];
    const start = args["STARTX"];
        return (start * 2) / (amountofitems - 1);
    }
    xdistancesetbymouse(args, util){
    const mouse = Scratch.vm.runtime.ioDevices.mouse.getScratchX();
    const distance = args["DIST"];
    const x = (util.target !== undefined ? util.target.x : 0);
    const result = (mouse > x - (distance / 1.85)) & (mouse < x + (distance / 1.85))
if (result)
{
return "true";
}
else
{
return "false";
}
    }
    ydistancesetbymouse(args, util){
    const mouse = Scratch.vm.runtime.ioDevices.mouse.getScratchY();
    const distance = args["DIST"];
    const y = (util.target !== undefined ? util.target.y : 0);
    const result = (mouse > y - (distance / 1.85)) & (mouse < y + (distance / 1.85))
if (result)
{
return "true";
}
else
{
return "false";
}
    }
    getlooptimeusingbpmbarsbpb(args){
    const bpm = args["BPM"];
    const bpb = args["BPB"];
    const bars = args["BARS"];
    return (bars * bpb) * (60 / bpm);
    }
    simplegetlooptimeusingbpm(args){
    return (960 / args["BPM"]);
    }
    beatlength(args)
    {
    const looptime = args["LOOPTIME"];
    const bpb = args["BPB"];
    const bars = args["BARS"];
    return looptime / (bars * bpb);
    }
    simplebeatlength(args)
    {
    return (args["LOOPTIME"] / 16);
    }
    logtxt(args)
    {
        console.log(args["LOG"]);
    }
        logerrortxt(args)
    {
        console.error(args["ERROR"]);
    }
    txtconvertbutton(args, util)
    {
    window.open('https://connergamer.neocities.org/textsequenceconvert', '_blank');
    }
    //ts is just text after from operators expanded but it returns the folder name of a sprite without the folders name
    removeFolderName(args, util)
    {
    const base = util.target.getName();
    const idx = base.indexOf('//');
    if (base.indexOf('//') > -1) {
    return base.substring(idx + 2);
} else {
    return base;
}
    }
    spriteName(args, util)
    {
    return util.target.getName();
    }
    //pretty much that one block from draker mild utils
    mapVal(args)
    {
    if ((args["MAXIN"]) == args["MININ"])
    {
    return args["MINOUT"]
    }
    else
    {
    return ((args["VAL"]) - (args["MININ"])) * ((args["MAXOUT"]) - (args["MINOUT"])) / ((args["MAXIN"]) - (args["MININ"])) + (args["MINOUT"])
    }
    }
    clamp(args, util)
    {
    return Math.max(args["MIN"], Math.min(args["VAL"], args["MAX"]));
    }
    phasecalc(args)
    {
    return args["VAL"] + ((args["PHASE"] - 1) * args["LOOPS"]);
    }
    getcostumeid(args, util)
    {
        const costumes = util.target.getCostumes();
        const costumesArray = costumes.map(costume => costume.name);
        return costumesArray[args["ID"] -1];
    }
        getsoundid(args, util)
    {
        const sounds = util.target.getSounds();
        const soundsArray = sounds.map(sound => sound.name);
        return soundsArray[args["ID"] -1];
    }
        getcostumenametoid(args, util)
    {
        const costumes = util.target.getCostumes();
        const costumesArray = costumes.map(costume => costume.name);
        return (costumesArray.indexOf(args["COSTUME"]) + 1);
    }
        getsoundnametoid(args, util)
    {
        const sounds = util.target.getSounds();
        const soundsArray = sounds.map(sound => sound.name);
        return (soundsArray.indexOf(args["SOUND"]) + 1);
    }
    checkpackaged(util)
    {
     if (typeof ScratchBlocks !== "undefined") {
        return false;
     }
     else
     {
            return true;
     }
    }
    getcostumedataurl(args, util)
    {
    const costumes = util.target.getCostumes();
    const index = util.target.getCostumeIndexByName(args["COSTUME"]);
    if (!costumes[index]) return "";
    const costume = costumes[index];
    return costume.asset.encodeDataURI();
    }
    getcostumecontent(args, util)
    {
        const costumes = util.target.getCostumes();
    const index = util.target.getCostumeIndexByName(args["COSTUME"]);
    if (!costumes[index]) return "";
    const costume = costumes[index];
    const skin = Scratch.vm.renderer._allSkins[costume.skinId];
return  decodeURIComponent(skin._svgImage.src.split(",")[1]);
    }
        getsounddataurl(args, util)
    {
        const sounds = util.target.getSounds();
        let index = 0;
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i].name === args.NAME) index = i + 1;
        }
if (!sounds[index]) return "";
                const sound = sounds[index];
                return sound.asset.encodeDataURI();
    }
        rawcostumedata(args, util)
    {
            const costumes = util.target.getCostumes();
            return costumes;
    }
    rawsounddata(args, util)
    {
            const sounds = util.target.getSounds();
            return sounds;
    }
    checksvg(args, util)
    {
        const costumes = util.target.getCostumes();
    const index = util.target.getCostumeIndexByName(args["COSTUME"]);
    if (!costumes[index]) return "false";
    const costume = costumes[index];
    if (costume.dataFormat == 'svg')
    {
    return "true";
    }
    else
    {
        return "false";
    }
    }
  }

  Scratch.extensions.register(new CoolUtil());
})(Scratch);