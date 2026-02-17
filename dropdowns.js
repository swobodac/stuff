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
                "id": "dropdownstuff",
                "name": "Engine Dropdowns",
                "color1": "#0088ff",
                "color2": "#0063ba",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        blockType: Scratch.BlockType.LABEL,
        hideFromPalette: false,
        text: `only dropdowns are here :scream:`,
    });


    menus["getfrompolo"] = {
        acceptReporters: true,
        items: ["occupant", {
            text: "position",
            value: "pos"
        }, "distance set", {
            text: "highlighted",
            value: "hovering"
        }]
    }

    menus["getfromchar"] = {
        acceptReporters: true,
        items: ["category", "active", "muted", "volume", {
            text: "singing/playing loops",
            value: "singing"
        }]
    }

    menus["pos"] = {
        acceptReporters: true,
        items: ["x", "y", {
            text: "direction",
            value: "dir"
        }, "size", "stretch x", "stretch y"]
    }

    menus["setprop"] = {
        acceptReporters: true,
        items: ["muted", "volume", {
            text: "singing/playing loops",
            value: "singing"
        }]
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
