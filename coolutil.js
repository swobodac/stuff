//ts has a lot of crap stolen from other pm extenstions like looks expanded, runtime, etc because i kinda suck at js:sob:
//managed to figure out some functions using dinobuilder & other pm extenstions :)

(function(Scratch) {
  'use strict';

  class CoolUtil {

    getInfo() {
      return {
        id: "coolstuff",
        name: "Cool Utilies",
        menuIconURI: "data:image/jpeg;base64,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",
    color1: "#0077ff",
    color2: "#0063d4",
        blocks: [
                        {
        opcode: `creditsModal`,
        blockType: Scratch.BlockType.BUTTON,
        hideFromPalette: false,
        text: `Credits`,
            },
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
            hideFromPalette: true,//disabled since ts is just constrain but i dont want to break crap
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
            allowDropAnywhere: true,
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
                      opcode: 'uninterpolate',
            text: 'uninterpolate [VAL] min [MIN] max [MAX]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        VAL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
        },
                MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
        },
                        MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
        }
    }
          },
    {
            opcode: 'makewidthheightresizeable',
            text: 'make [VAL] resizeable using size [SIZE]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        VAL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 64,
        },
                SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
        }
    }
          },
    {
            opcode: 'getleft',
            text: 'get left from [WIDTH] while at x position [X]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 64,
        },
                X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
    {
            opcode: 'getright',
            text: 'get right from [WIDTH] while at x position [X]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 64,
        },
                X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
    {
            opcode: 'gettop',
            text: 'get top from [HEIGHT] while at y position [Y]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 32,
        },
                Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
    {
            opcode: 'getbottom',
            text: 'get bottom from [HEIGHT] while at y position [Y]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 32,
        },
                Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
    {
            opcode: 'newlinetoarray',
            text: 'convert each new line in [TEXT] to an array',
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            disableMonitor: true,
            arguments: {
        TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
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
            opcode: 'xdistancesetbymousecustomizeable',
            text: 'is my x distance [DIST] while at [X] set by mouse x',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        DIST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 75,
        },
        X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
                    {
            opcode: 'xdistancesetbymousecustomizeable',
            text: 'is my y distance [DIST] while at [Y] set by mouse y',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        DIST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 75,
        },
        Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
        }
    }
          },
                      {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Costume & Sound Data`,
    },
            {
            opcode: 'svgtimer',
            text: 'generate svg data for radical timer with progress [PROGRESS] radius [RADIUS] thickness [THICKNESS] blank color [COLOR1] lit color [COLOR2]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        PROGRESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
        },
                RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 18,
        },
                THICKNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
        },
                COLOR1: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#808080",
        },
                COLOR2: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#ffffff",
        },
    }
          },
            {
            opcode: 'graidentsvgtimer',
            text: 'generate svg data for radical timer (with graident) with progress [PROGRESS] radius [RADIUS] thickness [THICKNESS] blank color 1 [COLOR1]  blank color 2 [COLOR2] lit color 1 [COLOR3] lit color 2 [COLOR4]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
        PROGRESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
        },
                RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 18,
        },
                THICKNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
        },
                COLOR1: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#808080",
        },
                COLOR2: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#4d4d4d",
        },
                COLOR3: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#ffffff",
        },
                COLOR4: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#cccccc",
        },
    }
          },
     {
            opcode: 'getcostumeid',
            text: 'get name of [ID] from this sprites costumes/backdrops',
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
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
            allowDropAnywhere: true,
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
            opcode: 'costumeexists',
            text: 'does costume/backdrop [COSTUME] exist in this sprite?',
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            arguments: {
        COSTUME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "costume1",

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
            allowDropAnywhere: true,
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
            allowDropAnywhere: true,
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
            opcode: 'getsounddata',
            text: 'get [MENU] of [SOUND]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
        arguments: {
        SOUND: {
                type: Scratch.ArgumentType.SOUND,
        },
            MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: 'soundmenu'
            },
    }
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
          },
        {   
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Random Blocks (Kinda Useless)`,
    },
               {
            opcode: 'rawcostumedata',
            text: 'get raw costume/backdrop data (Array & Objects)',
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            disableMonitor: true,
          },
                         {
            opcode: 'rawsounddata',
            text: 'get raw sound data (Array & Objects)',
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            disableMonitor: true,
          },
        ],
        menus:
{
 soundmenu: {
            acceptReporters: true,
            items: ['format', 'sample rate', 'sample count']
          }
}
      };
    }

//i had to take ts from storage + since penguinmod ext api so confusing:sob:
            async creditsModal() {
            const modalText = 
`Penguinmod Team - Most Functions from base extenstions
DinoBuilder Team - Some Functions
Prismatic - Some Updated Math Functions & Uninterpolate block idea & functions.
Draker - Some Block Ideas & SVG Timer Data (that i modified a tiny bit)
Johnny - Radical SVG Timer idea.

yah alot of this uses penguinmod base extesntions code😭`;

            if (ScratchBlocks.customPrompt) {
                const modal = await ScratchBlocks.customPrompt({
                        title: "Credits"
                    }, {
                        content: {
                            width: "500px"
                        }
                    },
                    [    { name: "OK", role: "ok", callback: () => console.log("Confirmed") },]
                );

                const p = document.createElement("p");
                p.innerHTML = modalText.replace(/\n/g, "<br>");
                modal.appendChild(p);
            } else {
                alert(modalText);
            }
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
    return ((bars * bpb) * 60) / bpm;
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
        return args["MINOUT"] + ((args["MAXOUT"] - args["MINOUT"]) * (args["VAL"] - args["MININ"]) / (args["MAXIN"] - args["MININ"]));
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

    //remade from draker mild util since thats the only good svg timer i have :)
    svgtimer(args, util)
    {
    const progress = args["PROGRESS"];
    const thickness = args["THICKNESS"];
    const radius = args["RADIUS"];
    const blankcolor = args["COLOR1"];
    const litcolor = args["COLOR2"];

    const dasharray = 2 * Math.PI * radius;
    const dashoffset = dasharray - (progress / 100) * dasharray;
      const size = (radius + thickness) * (2 + 10);
      const centerpos = (size / 2);

    const result = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${centerpos}" cy="${centerpos}" r="${radius}" fill="none" stroke="${blankcolor}" stroke-width="${thickness}"/><circle cx="${centerpos}" cy="${centerpos}" r="${radius}" fill="none" stroke="${litcolor}" stroke-width="${thickness}" stroke-dasharray="${dasharray}" stroke-dashoffset="${dashoffset}" transform="rotate(-90 ${centerpos} ${centerpos})"/></svg>`;
return result;
    }
    graidentsvgtimer(args, util)
    {
    const progress = args["PROGRESS"];
    const thickness = args["THICKNESS"];
    const radius = args["RADIUS"];
    const blankcolor = args["COLOR1"];
 const blankcolor2 = args["COLOR2"];
    const litcolor = args["COLOR3"];
    const litcolor2 = args["COLOR4"];

    const dasharray = 2 * Math.PI * radius;
    const dashoffset = dasharray - (progress / 100) * dasharray;
      const size = (radius + thickness) * (2 + 10);
      const centerpos = (size / 2);

    const result = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><linearGradient id="blank" gradientTransform="rotate(90)"><stop offset="5%" stop-color="${blankcolor}" /><stop offset="95%" stop-color="${blankcolor2}" /></linearGradient><linearGradient id="lit" gradientTransform="rotate(0)"><stop offset="5%" stop-color="${litcolor2}" /><stop offset="95%" stop-color="${litcolor}" /></linearGradient><circle cx="${centerpos}" cy="${centerpos}" r="${radius}" fill="none" stroke="url('#blank')" stroke-width="${thickness}"/><circle cx="${centerpos}" cy="${centerpos}" r="${radius}" fill="none" stroke="url('#lit')" stroke-width="${thickness}" stroke-dasharray="${dasharray}" stroke-dashoffset="${dashoffset}" transform="rotate(-90 ${centerpos} ${centerpos})"/></svg>`;
return result;
    }
    //thanks to prismatic for showing me how this works
    uninterpolate(args)
    {
    const val = args["VAL"]
    const min = args["MIN"]
    const max = args["MAX"]

    return (val - min) / (max - min);
    }
    getleft(args)
    {
    return (args["X"] - (args["WIDTH"] / 2)) + 4;
    }
        getright(args)
    {
    return (args["X"] + (args["WIDTH"] / 2)) - 4;
    }
        gettop(args)
    {
    return (args["Y"] + (args["HEIGHT"] / 2)) - 4;
    }
        getbottom(args)
    {
    return (args["Y"] - (args["HEIGHT"] / 2)) + 4;
    }

        costumeexists(args, util)
    {
        const costumes = util.target.getCostumes();
    const index = util.target.getCostumeIndexByName(args["COSTUME"]);
    if (!costumes[index]) 
    {
    return "false";
    }
    else
    {
    return "true";
    }
    }
    getsounddata(args, util)
    {
            const sounds = util.target.getSounds();
        let index = 0;
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i].name === args.SOUND) index = i + 1;
        }
if (!sounds[index -1]) return "";
                const sound = sounds[index -1];
    switch (args.MENU) {
    case 'format':
return sound.dataFormat;
    case 'sample rate':
return sound.rate;
    case 'sample count':
return sound.sampleCount;
}
    }
newlinetoarray(args, util)
    {
        const text = args["TEXT"];
      const newlinereplace = text.replace(/\n/g, '","');
return '["' + newlinereplace + '"]';
    }
makewidthheightresizeable(args)
{
return args["VAL"] * (args["SIZE"]/100);
}
    xdistancesetbymousecustomizeable(args, util){
    const mouse = Scratch.vm.runtime.ioDevices.mouse.getScratchX();
    const distance = args["DIST"];
    const x = args["X"];
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
    ydistancesetbymousecustomizeable(args, util){
    const mouse = Scratch.vm.runtime.ioDevices.mouse.getScratchY();
    const distance = args["DIST"];
    const y = args["Y"];
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
  }

  Scratch.extensions.register(new CoolUtil());
})(Scratch);
