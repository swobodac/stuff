/*
   This extension was made with DinoBuilder!
   https://dinobuilder.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }

    const ExtForge_Utils = {
        // from https://jwklong.github.io/extforge
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        }
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/jpeg;base64,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",
                "id": "IncrediboxTools",
                "name": "Incredibox Engine Tools",
                "color1": "#1a5fb4",
                "color2": "#3584e4",
                "color3": "#002873",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Polo Data`,
    });


    blocks.push({
        opcode: `polodataarraygen`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Generate Polo Data as an Array, Polo Name: [poloname] Polo Category: [polocategory]`,
        arguments: {
            "poloname": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Array Polo',
            },
            "polocategory": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Beats',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`polodataarraygen`] = async (args, util) => {
        return '["' + args["poloname"] + '", "' + args["polocategory"] + '"]'
    };

    blocks.push({
        opcode: `polodataobjectgen`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Generate Polo Data as JSON/Objects, Polo Name: [poloname] Polo Category: [polocategory]`,
        arguments: {
            "poloname": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'JSON Polo',
            },
            "polocategory": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Effects',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`polodataobjectgen`] = async (args, util) => {
        return '{"PoloName":"' + args["poloname"] + '","PoloCategory":"' + args["polocategory"] + '"}'
    };

    blocks.push({
        opcode: `arraypiecedatagen`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Create Polo Piece Data as an Array, Piece Name: [name] Piece X Offest: [x] Piece Y Offset: [y]  Piece Direction Offset: [direction] Piece Size Offset: [size]`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Array Head',
            },
            "x": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "y": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "direction": {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: 0,
            },
            "size": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`arraypiecedatagen`] = async (args, util) => {
        return '["' + args["name"] + '","' + args["x"] + '","' + args["y"] + '","' + args["direction"] + '","' + args["size"] + '"]'
    };

    blocks.push({
        opcode: `jsonpiecedatagen`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Create Polo Piece Data as JSON/Objects, Piece Name: [name] Piece X Offest: [x] Piece Y Offset: [y]  Piece Direction Offset: [direction] Piece Size Offset: [size]`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'JSON Body',
            },
            "x": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "y": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "direction": {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: 90,
            },
            "size": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`jsonpiecedatagen`] = async (args, util) => {
        return '{"PieceName":"' + args["name"] + '","PieceXOffset":' + args["x"] + ',"PieceYOffset":' + args["y"] + ',"PieceDirectionOffset":' + args["direction"] + ',"PieceSizeOffset":' + args["size"] + '}'
    };

    blocks.push({
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Math Calculators & Detectors`,
    });


    blocks.push({
        opcode: `objectcenter`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Centered Object Positions, Object Amount: [cenamount] Object Distance: [cendistance] Object ID: [cenid]`,
        filter: [Scratch.TargetType.SPRITE],
        arguments: {
            "cenamount": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 7,
            },
            "cendistance": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 65,
            },
            "cenid": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`objectcenter`] = async (args, util) => {
        return ((args["cendistance"] * (0.5 - (0.5 * args["cenamount"]))) + (args["cendistance"] * (args["cenid"] - 1)))
    };

    blocks.push({
        opcode: `distanceonobjectset`,
        blockType: Scratch.BlockType.BOOLEAN,
        hideFromPalette: false,
        text: `Distance on Object is set by mouse x, Object Amount: [amount] Object Distance: [distance]`,
        filter: [Scratch.TargetType.SPRITE],
        arguments: {
            "amount": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 7,
            },
            "distance": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 65,
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`distanceonobjectset`] = async (args, util) => {
        return ((Scratch.vm.runtime.ioDevices.mouse.getScratchX() > ((util.target !== undefined ? util.target.x : 0) - (args["distance"] / (args["amount"] * 0.256)))) && (Scratch.vm.runtime.ioDevices.mouse.getScratchX() < ((util.target !== undefined ? util.target.x : 0) + (args["distance"] / (args["amount"] * 0.256)))))
    };

    blocks.push({
        opcode: `calculatebpm`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Calculate the Loop Time of BPM: [bpm]`,
        arguments: {
            "bpm": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 120,
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`calculatebpm`] = async (args, util) => {
        return (Math.floor((((60 / args["bpm"]) * 16) * 20)) / 20)
    };

    blocks.push({
        opcode: `idplusphase`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Loop ID + Phase, Loop ID: [loop] Phase: [phase]`,
        arguments: {
            "loop": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
            "phase": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`idplusphase`] = async (args, util) => {
        return (args["loop"] + ((args["phase"] - 1) * 2))
    };

    blocks.push({
        opcode: `sidechainingcalculation`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Audio Sidechaining Calculations via Loop Time, Current Audio Time: [time] Loop Time: [looptime] Additional Time: [addedtime]`,
        arguments: {
            "time": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
            "looptime": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8,
            },
            "addedtime": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`sidechainingcalculation`] = async (args, util) => {
        return (((args["time"] + args["addedtime"]) / (args["looptime"] / 16)) % 1)
    };

    blocks.push({
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `Reset Button Tools`,
    });


    blocks.push({
        opcode: `id`,
        blockType: Scratch.BlockType.REPORTER,
        hideFromPalette: false,
        text: `Generate Reset Button SVG Data, Progress: [progress] Color 1: [color1] Color 2: [color2]`,
        arguments: {
            "progress": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '50',
            },
            "color1": {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#808080',
            },
            "color2": {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`id`] = async (args, util) => {
        variables['resetskindatamaththingy'] = (2 * (3.141592653589793 * 20))
        return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="20" fill="none" stroke="' + args["color1"] + '" stroke-width="5"/><circle cx="30" cy="30" r="20" fill="none" stroke="' + args["color1"] + '" stroke-width="5"/><circle cx="30" cy="30" r="20" fill="none" stroke="' + args["color2"] + '" stroke-width="5" stroke-dasharray="125.66370614359172" stroke-dashoffset="' + (variables['resetskindatamaththingy'] - ((args["progress"] / 100) * variables['resetskindatamaththingy'])) + '" transform="rotate(-90 30 30)"/></svg>'
    };

    blocks.push({
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `External Tools (Opens in new Tab)`,
    });


    blocks.push({
        opcode: `johnnysequencer`,
        blockType: Scratch.BlockType.BUTTON,
        hideFromPalette: false,
        text: `Open Johnny Sequencer (Value Animator)`,
    });
    Extension.prototype[`johnnysequencer`] = async (args, util) => {
        eval('window.open("https://server.johnnycodes.blog/sequencer/")')
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
