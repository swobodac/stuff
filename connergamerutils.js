/*
   Created with ExtForge
   https://jwklong.github.io/extforge
*/
(async function(Scratch) {
    const variables = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    const ExtForge = {
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
        },

        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },

        Vector: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            static from(v) {
                if (v instanceof ExtForge.Vector) return v
                if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
                if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
                return new ExtForge.Vector()
            }

            add(v) {
                return new Vector(this.x + v.x, this.y + v.y);
            }

            set(x, y) {
                return new Vector(x ?? this.x, y ?? this.y)
            }
        },

        Utils: {
            setList: (list, index, value) => {
                [...list][index] = value;
                return list;
            },
            lists_foreach: {
                index: [0],
                value: [null],
                depth: 0
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }

    class Extension {
        getInfo() {
            return {
                "id": "cgu",
                "name": "Conner Gamer Utils",
                "color1": "#0000ff",
                "blocks": [{
                    "opcode": "block_f35242c85dedabdb",
                    "text": "Generate Rest Button SVG Data: Progress: [6d84d8c789dcf405] Non Lit Color: [465e5f3eac21d7f6] Lit Color: [efe5e5d7b65423a7] Swapped: [25bd28a11d56f6d8]",
                    "blockType": "reporter",
                    "arguments": {
                        "6d84d8c789dcf405": {
                            "type": "number",
                            "defaultValue": 50
                        },
                        "465e5f3eac21d7f6": {
                            "type": "string",
                            "defaultValue": "#808080"
                        },
                        "efe5e5d7b65423a7": {
                            "type": "string",
                            "defaultValue": "#ffffff"
                        },
                        "25bd28a11d56f6d8": {
                            "type": "number",
                            "defaultValue": 0
                        }
                    }
                }]
            }
        }
        async block_f35242c85dedabdb(args) {
            ExtForge.Variables.set("radius thingy", ((2) * ((3.141592653589793) * (20))))
            if ((args["25bd28a11d56f6d8"] == ("1"))) {
                return (String.prototype.concat(String("<svg viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["efe5e5d7b65423a7"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\" stroke-dasharray=\"125.66370614359172\" stroke-dashoffset=\""), String.prototype.concat(Scratch.Cast.toString((ExtForge.Variables.get("radius thingy") -
                    ((args["6d84d8c789dcf405"] / (100)) * ExtForge.Variables.get("radius thingy")))), String("\" transform=\"rotate(-90 30 30)\"/></svg>"))))))))))
            } else {
                return (String.prototype.concat(String("<svg viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["efe5e5d7b65423a7"], String.prototype.concat(String("\" stroke-width=\"5\" stroke-dasharray=\"125.66370614359172\" stroke-dashoffset=\""), String.prototype.concat(Scratch.Cast.toString((ExtForge.Variables.get("radius thingy") -
                    ((args["6d84d8c789dcf405"] / (100)) * ExtForge.Variables.get("radius thingy")))), String("\" transform=\"rotate(-90 30 30)\"/></svg>"))))))))))
            };
        }
    }

    let extension = new Extension();
    // code compiled from extforge

    Scratch.extensions.register(extension);
})(Scratch);
