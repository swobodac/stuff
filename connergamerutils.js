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
                "color1": "#1c71d8",
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
                }, {
                    "opcode": "block_61e3a096dba768f3",
                    "text": "Generate Loop Name, Polo Name [789e0bbae97ea983] [f5bfc71ba7914c4f]",
                    "blockType": "reporter",
                    "arguments": {
                        "789e0bbae97ea983": {
                            "type": "string",
                            "defaultValue": "Polo"
                        },
                        "f5bfc71ba7914c4f": {
                            "type": "number",
                            "defaultValue": 1
                        }
                    }
                }, {
                    "opcode": "block_65033c2e911bf1b2",
                    "text": "Loop Number + Phases, Loop ID [f8a3eff0fa75b157] Phase: [4eb811af31944866]",
                    "blockType": "reporter",
                    "arguments": {
                        "f8a3eff0fa75b157": {
                            "type": "number",
                            "defaultValue": 1
                        },
                        "4eb811af31944866": {
                            "type": "number",
                            "defaultValue": 2
                        }
                    }
                }, {
                    "opcode": "block_b55988a7a0a88e8b",
                    "text": "Object Centering Math, Object Amount [26aebb6378b15dff] Object Distance [e3e6927eabb55526] Object ID [8c33068a2cb70acf]",
                    "blockType": "reporter",
                    "arguments": {
                        "26aebb6378b15dff": {
                            "type": "number",
                            "defaultValue": 7
                        },
                        "e3e6927eabb55526": {
                            "type": "number",
                            "defaultValue": 65
                        },
                        "8c33068a2cb70acf": {
                            "type": "number",
                            "defaultValue": 1
                        }
                    }
                }, {
                    "opcode": "block_2a796064978379ad",
                    "text": "Check if the Mouse X Distance On Object is Set, X Position: [6afb6140bef85e51] Object Amount: [d4e9aed6d08340bd] Object Distance: [c7484c39e6969f76]",
                    "blockType": "Boolean",
                    "arguments": {
                        "6afb6140bef85e51": {
                            "type": "number",
                            "defaultValue": 0
                        },
                        "d4e9aed6d08340bd": {
                            "type": "number",
                            "defaultValue": 7
                        },
                        "c7484c39e6969f76": {
                            "type": "number",
                            "defaultValue": 65
                        }
                    }
                }, {
                    "opcode": "block_86dc1e0d8d458fe0",
                    "text": "Calculate Loop Time, BPM: [a1244500d3871998]",
                    "blockType": "reporter",
                    "arguments": {
                        "a1244500d3871998": {
                            "type": "number",
                            "defaultValue": 120
                        }
                    }
                }, {
                    "opcode": "block_e55d2ca6b757b633",
                    "text": "Check if something is set to a certain thing while another something is not set to something, 1st Value: [de6451c1750e1273] 1st Values's Value: [43da465d6af16a45] 2nd Value: [69e75c67f240afd0] 2nd Value's Value: [374aaa080303ae1e]",
                    "blockType": "Boolean",
                    "arguments": {
                        "de6451c1750e1273": {
                            "type": "string",
                            "defaultValue": "Something"
                        },
                        "43da465d6af16a45": {
                            "type": "string",
                            "defaultValue": "Another Something"
                        },
                        "69e75c67f240afd0": {
                            "type": "string",
                            "defaultValue": "Something Again"
                        },
                        "374aaa080303ae1e": {
                            "type": "string",
                            "defaultValue": "Another Something Again"
                        }
                    }
                }]
            }
        }
        async block_f35242c85dedabdb(args) {
            ExtForge.Variables.set("radius thingy", ((2) * (Math.PI * (20))))
            if ((args["25bd28a11d56f6d8"] == ("1"))) {
                return (String.prototype.concat(String("<svg viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["efe5e5d7b65423a7"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\" stroke-dasharray=\"125.66370614359172\" stroke-dashoffset=\""), String.prototype.concat(Scratch.Cast.toString((ExtForge.Variables.get("radius thingy") -
                    ((args["6d84d8c789dcf405"] / (100)) * ExtForge.Variables.get("radius thingy")))), String("\" transform=\"rotate(-90 30 30)\"/></svg>"))))))))))
            } else {
                return (String.prototype.concat(String("<svg viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["465e5f3eac21d7f6"], String.prototype.concat(String("\" stroke-width=\"5\"/><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"none\" stroke=\""), String.prototype.concat(args["efe5e5d7b65423a7"], String.prototype.concat(String("\" stroke-width=\"5\" stroke-dasharray=\"125.66370614359172\" stroke-dashoffset=\""), String.prototype.concat(Scratch.Cast.toString((ExtForge.Variables.get("radius thingy") -
                    ((args["6d84d8c789dcf405"] / (100)) * ExtForge.Variables.get("radius thingy")))), String("\" transform=\"rotate(-90 30 30)\"/></svg>"))))))))))
            };
        }
        async block_61e3a096dba768f3(args) {
            return (String.prototype.concat(args["789e0bbae97ea983"], String.prototype.concat(String("Loop"), Scratch.Cast.toString(args["f5bfc71ba7914c4f"]))))
        }
        async block_65033c2e911bf1b2(args) {
            return ((args["f8a3eff0fa75b157"] + ((args["4eb811af31944866"] - (1)) * (2))))
        }
        async block_b55988a7a0a88e8b(args) {
            return (((args["e3e6927eabb55526"] * ((0.5) - ((0.5) * args["26aebb6378b15dff"]))) + (args["e3e6927eabb55526"] * (args["8c33068a2cb70acf"] - (1)))))
        }
        async block_2a796064978379ad(args) {
            return (((Scratch.vm.runtime.ioDevices.mouse.getScratchX() > (args["6afb6140bef85e51"] - (args["c7484c39e6969f76"] / (args["d4e9aed6d08340bd"] * (0.256))))) && (Scratch.vm.runtime.ioDevices.mouse.getScratchX() < (args["6afb6140bef85e51"] + (args["c7484c39e6969f76"] / (args["d4e9aed6d08340bd"] * (0.256)))))))
        }
        async block_86dc1e0d8d458fe0(args) {
            return ((((960) / args["a1244500d3871998"]) / (1.0006)))
        }
        async block_e55d2ca6b757b633(args) {
            return ((!((args["de6451c1750e1273"] == args["43da465d6af16a45"]) && (!(args["69e75c67f240afd0"] == args["374aaa080303ae1e"])))))
        }
    }

    let extension = new Extension();
    // code compiled from extforge

    Scratch.extensions.register(extension);
})(Scratch);
