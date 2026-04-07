//new update
//some updated beat timing was used from 4daengine which is used from beat sync

(async function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("IncrediEngine must run unsandboxed!");
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const Cast = Scratch.Cast;
  const isPM = Scratch.extensions.isPenguinMod;
  const Thread = isPM ? vm.exports.Thread : vm.exports.i_will_not_ask_for_help_when_these_break().Thread;

    function getJwArray()         { return vm.jwArray         ?? { Type: class { static toArray(x)  { return Array.isArray(x) ? x : [] } }, Block: {}, Argument: {} } }
    function getDogeiscutObject() { return vm.dogeiscutObject ?? { Type: class { static toObject(x) { return x } static blank = {} }, Block: {}, Argument: {} } }

    function toObj(x) { return getDogeiscutObject().Type.toObject(x) }
    function toArr(x) { return getJwArray().Type.toArray(x) }
    function makeArr(a) { return new (getJwArray().Type)(a) }

  const EventKey = Symbol("incredimodUtilsMODDEDEventData");

  const regenReporters = [
    "incredimodUtilsMODDED_loopProperty",
    "incredimodUtilsMODDED_characterProperty",
    "incredimodUtilsMODDED_eventCharacter",
    "incredimodUtilsMODDED_eventLoop"
  ];

    if (Scratch.gui) {
    Scratch.gui.getBlockly().then(SB => {
      const ogCheck = SB.scratchBlocksUtils.isShadowArgumentReporter;
      SB.scratchBlocksUtils.isShadowArgumentReporter = function(block) {
        if (ogCheck(block)) return true;
        return block.isShadow() && regenReporters.includes(block.type);
      };
    });
  }

  class incredimodUtilsMODDED {
    constructor() {
            if (!vm.jwArray)         vm.extensionManager.loadExtensionIdSync('jwArray')
            if (!vm.dogeiscutObject) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js')
      this.characters = new Map(); 
      this.polos = new Map(); 
      this.loops = new Map(); 
      this.categories = new Set([]); 
      this.lastCharacterPlaced = null;
      this.lastCharacterRemoved = null;
      this.lastCharacterReplaced = null;

      this.internalTimer = 0;
      this.timerRunning = false;
      this.timerInterval = null;
      this.lastLoopProgress = 0

      this.currentLoop = null;
      this.currentBeat = -1;
      this.currentBar = -1;
      this.loopInterval = null;

            this._loopRunning     = false
            this._loopStartAudioTime = 0
            this._loopPausedElapsed  = 0
            this._totalBeats      = 0
            this._beatPosition    = 0
              this.halfwaydone = false;

            this._setupVMEvents()

      this.soloedCharacter = null;

      runtime.on("PROJECT_STOP_ALL", () => {
        this.stopAllLoops();
      });
    }

        _getAudioCtx() {
            if (this._audioCtx) return this._audioCtx
            
            let scratchCtx = null
            try {
                scratchCtx =
                    vm.runtime?.audioEngine?.audioContext ||
                    vm.runtime?.scratch?.audioEngine?.audioContext ||
                    vm.audioEngine?.audioContext ||
                    null
            } catch (e) {}
            
            this._audioCtx = scratchCtx || new (window.AudioContext || window.webkitAudioContext)()
            if (this._audioCtx.state === 'suspended') this._audioCtx.resume()
            return this._audioCtx
        }

        _getLatency() {
            const ctx = this._getAudioCtx()
            return (ctx.baseLatency || 0) + (ctx.outputLatency || 0)
        }

        _getLoopElapsedSeconds() {
            if (!this._loopRunning) return this._loopPausedElapsed
            const ctx = this._getAudioCtx()
            return this._loopPausedElapsed + (ctx.currentTime - this._loopStartAudioTime) + this._getLatency()
        }

        _setupVMEvents() {
            if (this._vmEventBound) return
            this._vmEventBound = true

            vm.on('BEFORE_EXECUTE', () => {
                this._tick()
            })

            if (Scratch.extensions.isPenguinMod) {
                runtime.on('RUNTIME_STEP_START', () => {
                    this._tick()
                })
            }
        }

        _updateLoopTime() {
            if (!this._loopRunning || !this.currentLoop) return
            
            const elapsed = this._getLoopElapsedSeconds()
            const bpm = this.currentLoop.bpm || 120
            const secondsPerBeat = 60 / bpm
            this._totalBeats = elapsed / secondsPerBeat
            this._beatPosition = this._totalBeats % 1
        }

        loopsRunningBool()
        {
        return Boolean(this._loopRunning);
        }

        _tick() {
            if (this._timerRunning) {
                const ctx = this._getAudioCtx()
                this.internalTimer = this._timerPaused + (ctx.currentTime - this._timerOrigin)
            }

            if (!this._loopRunning || !this.currentLoop) return
            
            this._updateLoopTime()
            
            const data           = this.currentLoop
            const secondsPerBeat = 60 / (data.bpm || 120)
            const totalBeats     = data.bars * data.beatsPerBar
            const totalSeconds   = secondsPerBeat * totalBeats
            const elapsed        = this._getLoopElapsedSeconds()

            if (elapsed >= totalSeconds) {
                const carry          = elapsed % totalSeconds
                this.lastLoopProgress = 100
              this.triggerLoopEvent("whenLoopFinishes", data);
                this._updateLoopTime()
            }
            else if (elapsed >= (totalSeconds / 2) & !this.halfwaydone) {
              this.halfwaydone = true;
              this.triggerLoopEvent("whenLoopHalfwayDone", data);
                this._updateLoopTime()
            }

            const newBeat = Math.floor(this._totalBeats % data.beatsPerBar)
            const newBar  = Math.floor(this._totalBeats / data.beatsPerBar)

            if (newBeat !== this.currentBeat) {
                this.currentBeat = (newBeat % data.beatsPerBar)
                runtime.startHats('incredimodUtilsMODDED_whenBeat')
            }
            if (newBar !== this.currentBar) {
                this.currentBar = (newBar % data.bars)
                runtime.startHats('incredimodUtilsMODDED_whenNewBar')
            }

            this.lastLoopProgress = Math.min(100, (elapsed / totalSeconds) * 100)
        }

    getInfo() {
      return {
        id: "incredimodUtilsMODDED",
        name: "IncrediEngine",
        color1: "#6b6b6b",
        color2: "#575757",
        color3: "#303030",
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2NC45NTYzNCIgaGVpZ2h0PSI2NC45NTYzNCIgdmlld0JveD0iMCwwLDY0Ljk1NjM0LDY0Ljk1NjM0Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjMyMCIgeTE9IjE0OS41MjE4MyIgeDI9IjMyMCIgeTI9IjIxMC40NzgxNyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5MjkyOTIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0ZDRkNGQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg3LjUyMTgzLC0xNDcuNTIxODMpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yODkuNTIxODMsMTgwYzAsLTE2LjgzMjYzIDEzLjY0NTU0LC0zMC40NzgxNyAzMC40NzgxNywtMzAuNDc4MTdjMTYuODMyNjMsMCAzMC40NzgxNywxMy42NDU1NCAzMC40NzgxNywzMC40NzgxN2MwLDE2LjgzMjYzIC0xMy42NDU1NCwzMC40NzgxNyAtMzAuNDc4MTcsMzAuNDc4MTdjLTE2LjgzMjYzLDAgLTMwLjQ3ODE3LC0xMy42NDU1NCAtMzAuNDc4MTcsLTMwLjQ3ODE3eiIgZmlsbD0idXJsKCNjb2xvci0xKSIgc3Ryb2tlLW9wYWNpdHk9IjAuNTAxOTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTMxMy4wOTA0OCwxOTguODA2MThjMS44MzY2OSwtMS44MzY2NyAxMC42MDY4MSwtMTAuNjA2ODEgMTEuNzU5NTQsLTExLjc1OTU0YzAuNTc3ODIsLTAuNTc3ODIgMS42MTU2NSwtMC4zODM5OSAxLjkxMzM3LC0wLjA4NjMyYzAuNDAwMDgsMC40MDAwOCAwLjY3Mjg3LDEuMzA1NTEgMC4wNTY3OSwxLjkyMTU5Yy0xLjE4NjE1LDEuMTg2MTUgLTEwLjA5NjQ1LDEwLjA5NjQ1IC0xMS44OTQzNiwxMS44OTQzNmMtMC41ODEwNCwwLjU4MTA2IC0xLjQ4MTUxLDAuMTQ5NDUgLTEuODA0NjcsLTAuMTczNzJjLTAuMzEwNTUsLTAuMzEwNTUgLTAuNTczNDIsLTEuMjUzNjMgLTAuMDMwNjMsLTEuNzk2NDN6IiBmaWxsPSIjZDlkOWQ5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0zMjQuOTY2OTUsMjAwLjcwODg4Yy0xLjgzNjY5LC0xLjgzNjY3IC0xMC42MDY3OSwtMTAuNjA2NzkgLTExLjc1OTU0LC0xMS43NTk1NGMtMC41Nzc4MiwtMC41Nzc4MiAtMC4zODM5OSwtMS42MTU2NyAtMC4wODYzMiwtMS45MTMzN2MwLjQwMDA4LC0wLjQwMDA4IDEuMzA1NTEsLTAuNjcyODggMS45MjE1OSwtMC4wNTY4YzEuMTg2MTUsMS4xODYxNSAxMC4wOTY0NSwxMC4wOTY0NSAxMS44OTQ0LDExLjg5NDRjMC41ODEwNCwwLjU4MTA2IDAuMTQ5NDUsMS40ODE1MSAtMC4xNzM3MiwxLjgwNDY1Yy0wLjMxMDU1LDAuMzEwNTUgLTEuMjUzNjMsMC41NzM0MiAtMS43OTY0MywwLjAzMDYzeiIgZmlsbD0iI2Q5ZDlkOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjk3LjA4MTY3LDE2OC43NzgxNWMwLjcxOTcyLDAgMy41NTc0OSwtMC4wODA2NiAzLjU1NzQ5LC0wLjA4MDY2YzAsMCAzLjQ2Mzg1LC0zLjY5NjM0IDQuNDMxMjIsLTQuNTQ4NjVjMC4zODI5MSwtMC4zMzczNiAwLjgwMTcyLC0wLjI3NTM4IDAuODAxNzIsMC40NDk3N2MwLDMuNDgzNDkgMCwxMy43NTU1NCAwLDE1LjY1MjU5YzAsMC41ODkzMyAtMC40MjA3NiwwLjY4MDc4IC0wLjc5NzM5LDAuMjk1NDRjLTAuOTE1MzcsLTAuOTM2NTcgLTQuNTg5MTYsLTQuNjk4MzIgLTQuNTg5MTYsLTQuNjk4MzJjMCwwIC0yLjYyMDU5LDAgLTMuMzk2MzMsMGMtMC4zOTAyMiwwIC0wLjk2MDM4LC0wLjQ4MDk4IC0wLjk2MDM4LC0wLjk3NDU4YzAsLTEuMzg2MjUgMCwtMy45ODI5MiAwLC00Ljg4MzM5YzAsLTAuNTU1NDUgMC41NDY3NSwtMS4yMTIxOSAwLjk1Mjg0LC0xLjIxMjE5eiIgZmlsbD0iI2Q5ZDlkOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMzE0LjgyMzU3LDE3Ni42MTM1OWMtMS40MzI3LC0xLjQzMjcgLTQuODMzMzgsLTQuODMzNCAtNS43MzI1NywtNS43MzI1N2MtMC40NTA3NCwtMC40NTA3NCAtMC4yOTk1NSwtMS4yNjAzMSAtMC4wNjczNCwtMS40OTI1YzAuMzEyMDgsLTAuMzEyMDggMS4wMTgzOCwtMC41MjQ4OSAxLjQ5ODk1LC0wLjA0NDMxYzAuOTI1MjcsMC45MjUyNyA0LjQzNTI4LDQuNDM1MjggNS44Mzc3NCw1LjgzNzc0YzAuNDUzMjUsMC40NTMyNSAwLjExNjU4LDEuMTU1NjcgLTAuMTM1NTEsMS40MDc3NGMtMC4yNDIyNSwwLjI0MjI1IC0wLjk3NzksMC40NDcyNyAtMS40MDEzMiwwLjAyMzg3eiIgZmlsbD0iI2Q5ZDlkOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMzA5LjE1ODk4LDE3Ni41ODk2OWMtMC4yNTIwOSwtMC4yNTIwOSAtMC41ODg3MywtMC45NTQ1IC0wLjEzNTUxLC0xLjQwNzc1YzEuNDAyNDksLTEuNDAyNDkgNC45MTI1LC00LjkxMjUgNS44Mzc3NCwtNS44Mzc3NGMwLjQ4MDU3LC0wLjQ4MDU4IDEuMTg2ODcsLTAuMjY3NzkgMS40OTg5NywwLjA0NDMxYzAuMjMyMjIsMC4yMzIyMiAwLjM4MzQxLDEuMDQxNzkgLTAuMDY3MzMsMS40OTI1MWMtMC44OTkxOSwwLjg5OTE5IC00LjI5OTg3LDQuMjk5OSAtNS43MzI1Nyw1LjczMjU3Yy0wLjQyMzQsMC40MjM0IC0xLjE1OTA2LDAuMjE4MzQgLTEuNDAxMzIsLTAuMDIzODd6IiBmaWxsPSIjZDlkOWQ5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0zMjcuNTg2ODcsMTgwLjA3NzEzYy0wLjU2MTksLTEuNTA4MjkgLTEuMTE0MzMsLTMuODk4NzcgLTEuNDQxOTcsLTQuNzc4MjJjLTAuMjQ5MDYsLTAuNjY4NTcgMC4zMzE0NCwtMS42ODM2NCAwLjc3NzQsLTEuODQ2NjRjMC4zNzU5NiwtMC4xMzc0NCAxLjM3MDYxLC0wLjQzMzMzIDEuMzcwNjEsLTAuNDMzMzNjMCwwIC0xLjEwNjUzLC00LjAxMDkyIDAuNDU0NiwtNi4yMzA1NmMwLjYyODY4LC0wLjg5Mzg1IDEuNTYyOTIsLTEuODQ5OTYgMi41MjI0OCwtMi4zMTAyOWMxLjg2NDE4LC0wLjg5NDM0IDQuMDExMjgsLTAuNjU5MjcgNC4wMTEyOCwtMC42NTkyN2wwLjEyMjA0LDEuNzI1MWMwLDAgLTIuMDM2OTUsLTAuMjI1MTUgLTMuNDkxNTMsMC42Nzc1MWMtMC44NDAyMywwLjUyMTQxIC0xLjY4NTIsMS41MDEyNSAtMS44NzEwOCwyLjY0NTM4Yy0wLjI4MzMxLDEuNzQzODEgMC4xMTAxOCwzLjc5NTc1IDAuMTEwMTgsMy43OTU3NWwxLjk4MDA2LDcuMzYwMjRjMCwwIC0xLjM0NTI3LDAuNDYxODYgLTIuNTg5NDQsMC43OTA2OGMtMS4xNDIxMSwwLjMwMTg0IC0xLjY1NjM2LDAuMDY0MiAtMS45NTQ1OSwtMC43MzYzNHoiIGZpbGw9IiNkOWQ5ZDkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTM0Mi4zNjkzMSwxODAuMDc3MTNjLTAuMjk4MjUsMC44MDA1NCAtMC44MTI0NiwxLjAzODIgLTEuOTU0NTcsMC43MzYzNGMtMS4yNDQxOCwtMC4zMjg4MiAtMi41ODk0NSwtMC43OTA2OCAtMi41ODk0NSwtMC43OTA2OGwyLjE2MzgxLC03LjM2MDJjMCwwIDAuMjA5NzUsLTIuMDUxOTUgLTAuMDczNTYsLTMuNzk1NzZjLTAuMTg1OTEsLTEuMTQ0MTEgLTEuMDMwODUsLTIuMTIzOTYgLTEuODcxMDcsLTIuNjQ1MzhjLTEuNDU0NiwtMC45MDI2NiAtMy40MjkwNiwtMC42Nzc1MSAtMy40MjkwNiwtMC42Nzc1MWwwLjA1OTU0LC0xLjcyNTFjMCwwIDIuMTQ3MTEsLTAuMjM1MDggNC4wMTEyOCwwLjY1OTI3YzAuOTU5NTUsMC40NjAzNiAxLjg5MzgxLDEuNDE2NDUgMi41MjI0OCwyLjMxMDI5YzEuNTYxMTUsMi4yMTk2MiAwLjQ1NDYyLDYuMjMwNTUgMC40NTQ2Miw2LjIzMDU1YzAsMCAwLjk5NDY1LDAuMjk1ODggMS4zNzA1OSwwLjQzMzMxYzAuNDQ1OTcsMC4xNjMwMSAxLjAyNjQ4LDEuMTc4MDggMC43NzczOSwxLjg0NjY0Yy0wLjMyNzY0LDAuODc5NDYgLTAuODgwMDcsMy4yNjk5MiAtMS40NDE5Nyw0Ljc3ODIyeiIgZmlsbD0iI2Q5ZDlkOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48L2c+PC9nPjwvc3ZnPg==",
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Fork of Draker's Incredimod Utils"
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Character Management"
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Registration"
          },
          {
            opcode: "registerCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "register character ID [ID] category [CATEGORY] order [ORDER] max volume [VOLUME] in icon page [PAGE]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Beats" },
              ORDER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              VOLUME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              PAGE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            }
          },
          {
            opcode: "categoryDropdown",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "category [MENU]",
            arguments: {
              MENU: { type: Scratch.ArgumentType.STRING, menu: "CATEGORIES" },
            }
          },
          {
            opcode: "legacyCategoryDropdown",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "legacy category [MENU]",
            arguments: {
              MENU: { type: Scratch.ArgumentType.STRING, menu: "LEGACYCATEGORIES" },
            }
          },
          {
            opcode: "deleteCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete character ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "characterExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "character ID [ID] exists?",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Properties"
          },
          {
            opcode: "getCharacterData",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "get [PROPERTY] of character ID [ID]",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "CHAR_PROPERTIES" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "setCharacterProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [PROPERTY] of character ID [ID] to [VALUE]",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "CHAR_SET_PROPERTIES" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: "assignSpriteToCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "assign sprite [SPRITES] to character with id [ID]",
            arguments: {
              SPRITES: { type: Scratch.ArgumentType.STRING, menu: "sprites" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Custom Properties"
          },
          {
            opcode: "getCharacterCustomProperty",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "get custom property [KEY] of character ID [ID]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "color" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "setCharacterCustomProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: "set custom property [KEY] of character ID [ID] to [VALUE]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "color" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "red" }
            }
          },
          {
            opcode: "deleteCharacterCustomProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete custom property [KEY] from character ID [ID]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "color" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Mute & Soloing System"
          },
          {
            opcode: "muteCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "[ACTION] character ID [ID]",
            arguments: {
              ACTION: { type: Scratch.ArgumentType.STRING, menu: "MUTE_ACTIONS" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "soloCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "[ACTION] character ID [ID] [MODE]",
            arguments: {
              ACTION: { type: Scratch.ArgumentType.STRING, menu: "SOLO_ACTIONS" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
              MODE: { type: Scratch.ArgumentType.STRING, menu: "UNSOLO_MODES" }
            }
          },
          {
            opcode: "getCurrentlySoloedCharacter",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: false,
            text: "currently soloed character"
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Queries"
          },
          {
            opcode: "characterToObject",
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            text: "get data of character with ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "getassignedCharacterfromSprite",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "get assigned character id from sprite [SPRITES]",
            arguments: {
              SPRITES: { type: Scratch.ArgumentType.STRING, menu: "sprites" }
            }
          },
          {
            opcode: "getassignedCharactercurSprite",
            blockType: Scratch.BlockType.REPORTER,
            filter: [Scratch.TargetType.SPRITE],
            disableMonitor: true,
            text: "get assigned character id from this sprite"
          },
          {
            opcode: "areAnyCharactersPlaced",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "are any characters placed"
          },
          {
            opcode: "amountofcharactersplaced",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: false,
            text: "amount of placed characters"
          },
          {
            opcode: "getAllCharacters",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "all characters in page [PAGE] as [FORMAT]",
            arguments: {
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" },
              PAGE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: "getAllCharactersInCategory",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "all characters in [CATEGORY] in page [PAGE] as [FORMAT]",
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Beats" },
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" },
              PAGE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: "getAllCharactersInCategoryByOrder",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "all characters in [CATEGORY] in page [PAGE] by order as [FORMAT]",
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Beats" },
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" },
              PAGE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: "getAllPlacedCharacters",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "all placed characters as [FORMAT]",
            arguments: {
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" }
            }
          },
          {
            opcode: "getlastupdated",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "get last [LASTMENU] character",
            arguments: {
 LASTMENU: { type: Scratch.ArgumentType.STRING, menu: "LAST_UPDATED" },
            }
          },

          "---",
          "---",

          {
            blockType: Scratch.BlockType.LABEL,
            text: "Polo System"
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Setup"
          },
          {
            opcode: "registerPolo",
            blockType: Scratch.BlockType.COMMAND,
            text: "register empty polo with ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "deletePolo",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete empty polo with ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "poloExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "empty polo with ID [ID] exists?",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Assignment"
          },
          {
            opcode: "putCharacterOnPolo",
            blockType: Scratch.BlockType.COMMAND,
            text: "place character ID [CHARACTER] on polo [POLO]",
            arguments: {
              CHARACTER: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" },
              POLO: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "clearCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove character ID [CHARACTER]",
            arguments: {
              CHARACTER: { type: Scratch.ArgumentType.STRING, defaultValue: "char1" }
            }
          },
          {
            opcode: "clearPoloOccupant",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove character placed on polo ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "replaceCharacterOnPolo",
            blockType: Scratch.BlockType.COMMAND,
            text: "(NOT RECOMMENDED) replace character on polo [POLO] with [CHARACTER]",
            arguments: {
              POLO: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" },
              CHARACTER: { type: Scratch.ArgumentType.STRING, defaultValue: "char2" }
            }
          },
          {
            opcode: "clearAllCharacters",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove all characters from polos"
          },
 {
            blockType: Scratch.BlockType.LABEL,
            text: "Character Events"
          },
          {
            opcode: "whenCharacterPlaced",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            hideFromPalette: true,
            text: "when character is placed [CHARACTER]",
            arguments: {
              CHARACTER: {}
            }
          },
          {
            opcode: "eventCharacter",
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            hideFromPalette: true,
            disableMonitor: true,
            text: "[PROPERTY] of character",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "CHAR_PROPERTIES" }
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenCharacterPlaced">
                <value name="CHARACTER">
                  <shadow type="incredimodUtilsMODDED_eventCharacter">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_CHAR_EVENT_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          {
            opcode: "whenCharacterRemoved",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            hideFromPalette: true,
            text: "when character is removed [CHARACTER]",
            arguments: {
              CHARACTER: {}
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenCharacterRemoved">
                <value name="CHARACTER">
                  <shadow type="incredimodUtilsMODDED_eventCharacter">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_CHAR_EVENT_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          {
            opcode: "whenCharacterReplaced",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
           hideFromPalette: true,
            text: "(NOT RECOMMENDED) when character is replaced [CHARACTER]",
            arguments: {
              CHARACTER: {}
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenCharacterReplaced">
                <value name="CHARACTER">
                  <shadow type="incredimodUtilsMODDED_eventCharacter">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_CHAR_EVENT_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Polo Properties"
          },
          {
            opcode: "poloIsOccupied",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "polo ID [ID] is occupied?",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "getPoloOccupant",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "get occupant of polo ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Custom Polo Properties"
          },
          {
            opcode: "getPoloCustomProperty",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "get custom property [KEY] of polo ID [ID]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "position" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "setPoloCustomProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: "set custom property [KEY] of polo ID [ID] to [VALUE]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "position" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "0" }
            }
          },
          {
            opcode: "deletePoloCustomProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete custom property [KEY] from polo ID [ID]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "position" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Queries"
          },
          {
            opcode: "poloToObject",
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            text: "get data of empty polo with ID [ID]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "polo1" }
            }
          },
          {
            opcode: "getAllEmptyPolos",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "all empty polos as [FORMAT]",
            allowDropAnywhere: true,
            arguments: {
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" }
            }
          },
          {
            opcode: "getAllOccupiedPolos",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "all occupied polos as [FORMAT]",
            allowDropAnywhere: true,
            arguments: {
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" }
            }
          },
          {
            opcode: "getAllPolos",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "all polos as [FORMAT]",
            allowDropAnywhere: true,
            arguments: {
              FORMAT: { type: Scratch.ArgumentType.STRING, menu: "LIST_FORMAT" }
            }
          },

          "---",
          "---",

          {
            blockType: Scratch.BlockType.LABEL,
            text: "Category System"
          },
          {
            opcode: "registerCategory",
            blockType: Scratch.BlockType.COMMAND,
            text: "register category [CATEGORY]",
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Custom" }
            }
          },
          {
            opcode: "deleteCategory",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete category [CATEGORY]",
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Custom" }
            }
          },
          {
            opcode: "categoryExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "category [CATEGORY] exists?",
            arguments: {
              CATEGORY: { type: Scratch.ArgumentType.STRING, defaultValue: "Beats" }
            }
          },
          {
            opcode: "getAllCategories",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: false,
            allowDropAnywhere: true,
            text: "all categories"
          },

          "---",
          "---",

          {
            blockType: Scratch.BlockType.LABEL,
            text: "Loop System"
          },
          {
            opcode: "createLoopData",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            text: "loop data: ID [ID] BPM [BPM] bars [BARS] beats per bar [BPB]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loop1" },
              BPM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 },
              BARS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              BPB: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          {
            opcode: "getLoopProperty",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "get [PROPERTY] of [LOOP]",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "LOOP_PROPERTIES" },
              LOOP: { type: Scratch.ArgumentType.EMPTY }
            }
          },
          {
            opcode: "getLoopPropertyfromCurrentLoop",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "get [PROPERTY] of current loop",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "LOOP_PROPERTIES" }
            }
        },
          "---",
          {
            opcode: "startLoop",
            blockType: Scratch.BlockType.COMMAND,
            text: "start loop with data [LOOP]",
            arguments: {
              LOOP: { type: Scratch.ArgumentType.EMPTY }
            }
          },
          {
            opcode: "startLoopAndWait",
            blockType: Scratch.BlockType.COMMAND,
            text: "start loop with data [LOOP] and wait",
            arguments: {
              LOOP: { type: Scratch.ArgumentType.EMPTY }
            }
          },
          "---",
          {
            opcode: "loopsRunningBool",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "are loops playing"
          },
          {
            opcode: "getCurrentLoop",
            blockType: Scratch.BlockType.REPORTER,
            text: "currently playing loop"
          },
          {
            opcode: "getCurrentBeat",
            blockType: Scratch.BlockType.REPORTER,
            text: "current beat"
          },
          {
            opcode: "getCurrentBar",
            blockType: Scratch.BlockType.REPORTER,
            text: "current bar"
          },
          {
            opcode: "getLoopProgress",
            blockType: Scratch.BlockType.REPORTER,
            text: "loop progress %"
          },
          {
            opcode: "waitForNextBeat",
            blockType: Scratch.BlockType.COMMAND,
            text: "wait until next beat"
          },
          {
            opcode: "getTimeUntilNextBeat",
            blockType: Scratch.BlockType.REPORTER,
            text: "seconds until next beat"
          },
          {
            opcode: "getTimer",
            blockType: Scratch.BlockType.REPORTER,
            text: "get current loop timer"
          },

          "---",
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Loop Events"
          },
          {
            opcode: "whenLoopStarts",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            hideFromPalette: true,
            text: "when loop starts [LOOP]",
            arguments: {
              LOOP: {}
            }
          },
          {
            opcode: "eventLoop",
            blockType: Scratch.BlockType.REPORTER,
            allowDropAnywhere: true,
            hideFromPalette: true,
            disableMonitor: true,
            text: "[PROPERTY] of loop",
            arguments: {
              PROPERTY: { type: Scratch.ArgumentType.STRING, menu: "LOOP_PROPERTIES" }
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenLoopStarts">
                <value name="LOOP">
                  <shadow type="incredimodUtilsMODDED_eventLoop">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_LOOP_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          {
            opcode: "whenLoopHalfwayDone",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            hideFromPalette: true,
            text: "when loop is half way done [LOOP]",
            arguments: {
              LOOP: {}
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenLoopHalfwayDone">
                <value name="LOOP">
                  <shadow type="incredimodUtilsMODDED_eventLoop">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_LOOP_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          {
            opcode: "whenLoopFinishes",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            hideFromPalette: true,
            text: "when loop finishes [LOOP]",
            arguments: {
              LOOP: {}
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="incredimodUtilsMODDED_whenLoopFinishes">
                <value name="LOOP">
                  <shadow type="incredimodUtilsMODDED_eventLoop">
                    <value name="PROPERTY">
                      <shadow type="incredimodUtilsMODDED_menu_LOOP_PROPERTIES"></shadow>
                    </value>
                  </shadow>
                </value>
              </block>
            `
          },
          {
            opcode: "whenBeat",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            text: "when beat"
          },
          {
            opcode: "whenNewBar",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            text: "when new bar"
          },
          "---",
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Resetting Data"
          },
                    {
            opcode: "reset",
            blockType: Scratch.BlockType.COMMAND,
            text: "reset [MENU] data",
            arguments: {
              MENU: { type: Scratch.ArgumentType.STRING, menu: "RESET" }
            }
          },
          {
            opcode: "stopAllLoops",
            blockType: Scratch.BlockType.COMMAND,
            text: "cancel internal timer and loops"
          },
          {
            opcode: "resetAll", // bye bye little butterfly
            blockType: Scratch.BlockType.COMMAND,
            text: "reset all data"
          },
        ],
        menus: {
          CHAR_PROPERTIES: {
            acceptReporters: true,
            items: ["category", "assigned sprite", "placed", "singing", "muted", "current volume", "true volume", "max volume", "order", "page", "polo", "last polo"]
          },
          CHAR_EVENT_PROPERTIES: {
            acceptReporters: true,
            items: ["id", "category", "assigned sprite", "placed", "singing", "muted", "current volume", "true volume", "max volume", "order", "page", "polo", "last polo"]
          },
          CHAR_SET_PROPERTIES: {
            acceptReporters: true,
            items: ["current volume", "max volume", "order"]
          },
          LOOP_PROPERTIES: {
            acceptReporters: true,
            items: ["id", "bpm", "bars", "beats per bar", "length in seconds", "beat length", "length in beats"]
          },
          MUTE_ACTIONS: {
            acceptReporters: false,
            items: ["mute", "unmute", "toggle"]
          },
          SOLO_ACTIONS: {
            acceptReporters: false,
            items: ["solo", "unsolo"]
          },
          UNSOLO_MODES: {
            acceptReporters: false,
            items: ["restore previous states", "unmute all"]
          },
          LIST_FORMAT: {
            acceptReporters: false,
            items: ["names", "data"]
          },
          LAST_UPDATED: {
            acceptReporters: false,
            items: ["placed", "removed", "replaced"]
          },
          RESET: {
            acceptReporters: false,
            items: ["characters", "polos", "categorys"]
          },
          CATEGORIES: {
            acceptReporters: false,
            items: ["None", "Beats", "Effects", "Melodies", "Voices", "Bonuses"]
          },
          LEGACYCATEGORIES: {
            acceptReporters: false,
            items: ["None", "beat", "effect", "melody", "voice"]
          },
          sprites: {
acceptReporters: true,
items: "getSpriteMenu"
}
        }
      };
    }

                getSpriteMenu({}) {
        let sprites = new Array();
        for (let target of runtime.targets.filter(v => v !== vm.runtime._stageTarget)) {
            if (!sprites.includes(target.sprite.name)) sprites.push(target.sprite.name)
        }
    if (sprites.length === 0)  return ["no sprites found"];
        return sprites;
    }

    registerCharacter(args) {
      const id = Cast.toString(args.ID);
      const category = Cast.toString(args.CATEGORY);

      if (!this.categories.has(category)) {
        this.categories.add(category);
      }

      this.characters.set(id, {
        id: id,
        category: category,
        order: Cast.toNumber(args.ORDER),
        maxVolume: Cast.toNumber(args.VOLUME),
        page: Cast.toNumber(args.PAGE),
        currentVolume: 100,
        polo: null,
        singing: false,
        muted: false,
        soloed: false,
        previousMuteState: false,
        customProps: {}
      });
    }

    categoryDropdown(args)
    {
    return Cast.toString(args.MENU);
    }

        legacyCategoryDropdown(args)
    {
    return Cast.toString(args.MENU);
    }

    deleteCharacter(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (char && char.polo) {
        const polo = this.polos.get(char.polo);
        if (polo) polo.occupant = null;
      }
      this.characters.delete(id);
    }

    getCharacterData(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return "";

      const prop = Cast.toString(args.PROPERTY);
      switch (prop) {
        case "id": return char.id;
        case "category": return char.category;
        case "order": return char.order;
        case "assigned sprite": return char.assignedSprite || "";
        case "page": return char.page || 0;
        case "current volume": return (char.currentVolume * (char.maxVolume / 100));
        case "max volume": return char.maxVolume;
        case "true volume": return char.currentVolume;
        case "polo": return char.polo || "";
        case "placed": if (char.polo !== null) { return 'true' } return 'false';
        case "muted": return char.muted;
        case "last polo": return char.wasOnPolo || "";
        case "singing": return char.singing;
        default: return "";
      }
    }

    setCharacterProperty(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;

      const prop = Cast.toString(args.PROPERTY);
      const value = Cast.toNumber(args.VALUE);

      switch (prop) {
        case "current volume":
          char.currentVolume = Math.max(0, value);
          break;
        case "max volume":
          char.maxVolume = Math.max(0, value);
          break;
        case "order":
          char.order = value;
          break;
      }
    }

    assignSpriteToCharacter(args)
    {
          const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;
      if (Cast.toString(args.SPRITES) === "no sprites found") return;
      char.assignedSprite = Cast.toString(args.SPRITES);
    }

    getassignedCharactercurSprite(args, util)
    {
for (const value of this.characters.values()) {
  if (value.assignedSprite === util.target.getName())
return value.id;
}
    }

        getassignedCharacterfromSprite(args)
    {
for (const value of this.characters.values()) {
  if (value.assignedSprite === Cast.toString(args.SPRITES))
return value.id;
}
    }

    setCharacterCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;

      const key = Cast.toString(args.KEY);
      const value = args.VALUE;

      char.customProps[key] = value;
    }

    getCharacterCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return "";

      const key = Cast.toString(args.KEY);
      return char.customProps[key] !== undefined ? char.customProps[key] : "";
    }

    deleteCharacterCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;

      const key = Cast.toString(args.KEY);
      delete char.customProps[key];
    }

    muteCharacter(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;
      if (Cast.toString(args.ACTION) === "toggle")
      {
      char.muted = !char.muted;
      }
      else
      {
      char.muted = Cast.toString(args.ACTION) === "mute";
      }
    }

    characterExists(args) {
      return this.characters.has(Cast.toString(args.ID));
    }

    characterToObject(args)
    {
if (!args["ID"]) return;
    return toObj(this.characters.get(Cast.toString(args.ID)));
    }
  
    poloExists(args) {
      return this.polos.has(Cast.toString(args.ID));
    }

    poloToObject(args)
    {
if (!args["ID"]) return;
    return toObj(this.polos.get(Cast.toString(args.ID)));
    }
    
    getAllCharactersInCategory(args) {
      const category = Cast.toString(args.CATEGORY);
      const format = Cast.toString(args.FORMAT);
      const chars = Array.from(this.characters.values())
        .filter(char => char.category === category)
       .filter(char => char.page === args.PAGE);
       
      if (format === "names") {
        return makeArr(chars.map(char => char.id));
      } else {
        return makeArr(chars);
      }
    }

    getAllCharacters(args) {
      const category = Cast.toString(args.CATEGORY);
      const format = Cast.toString(args.FORMAT);
      const chars = Array.from(this.characters.values())
       .filter(char => char.page === args.PAGE);
       
      if (format === "names") {
        return makeArr(chars.map(char => char.id));
      } else {
        return makeArr(chars);
      }
    }

    getAllCharactersInCategoryByOrder(args) {
      const category = Cast.toString(args.CATEGORY);
      const format = Cast.toString(args.FORMAT);
      const chars = Array.from(this.characters.values())
        .filter(char => char.category === category)
       .filter(char => char.page === args.PAGE)
        .sort((a, b) => a.order - b.order);

      if (format === "names") {
        return makeArr(chars.map(char => char.id));
      } else {
        return makeArr(chars);
      }
    }

    getAllCategories() {
      return makeArr(Array.from(this.categories));
    }

    registerCategory(args) {
      const category = Cast.toString(args.CATEGORY);
      this.categories.add(category);
    }

    deleteCategory(args) {
      const category = Cast.toString(args.CATEGORY);

      const hasChars = Array.from(this.characters.values()).some(char => char.category === category);
      if (!hasChars) {
        this.categories.delete(category);
      }
    }

    categoryExists(args) {
      return this.categories.has(Cast.toString(args.CATEGORY));
    }

    putCharacterOnPolo(args) {
      const charId = Cast.toString(args.CHARACTER);
      const poloId = Cast.toString(args.POLO);

      const char = this.characters.get(charId);
      if (!char) return;

      if (char.polo) {
        const oldPolo = this.polos.get(char.polo);
        if (oldPolo) oldPolo.occupant = null;
      }

      if (!this.polos.has(poloId)) {
        this.polos.set(poloId, { id: poloId, occupant: null, customProps: {} });
      }

      const polo = this.polos.get(poloId);
      polo.occupant = charId;
      char.polo = poloId;
      char.wasOnPolo = poloId;
      this.lastCharacterPlaced = charId;
      char.singing = false;

      this.triggerCharacterEvent("whenCharacterPlaced", char);
    }

    replaceCharacterOnPolo(args) {
      new Promise((resolve) => {
      const poloId = Cast.toString(args.POLO);
      const newCharId = Cast.toString(args.CHARACTER);

      const polo = this.polos.get(poloId);
      if (!polo) return;

      const newChar = this.characters.get(newCharId);
      if (!newChar) return;

      if (polo.occupant) {
        const oldChar = this.characters.get(polo.occupant);
        if (oldChar) {
      oldChar.wasOnPolo = oldChar.polo;
          oldChar.polo = null;
      this.lastCharacterReplaced = oldChar.id;
      oldChar.singing = false;
          this.triggerCharacterEvent("whenCharacterReplaced", oldChar);
        }
      }

      if (newChar.polo) {
        const oldPolo = this.polos.get(newChar.polo);
        if (oldPolo) oldPolo.occupant = null;
      }

      polo.occupant = newCharId;
      newChar.polo = poloId;
      newChar.wasOnPolo = poloId;
      this.lastCharacterPlaced = newCharId;
      newChar.singing = false;
      this.triggerCharacterEvent("whenCharacterPlaced", newChar);
      });
    }

    clearCharacter(args) {
      const charId = Cast.toString(args.CHARACTER);
      const char = this.characters.get(charId);
      if (!char || !char.polo) return;

      const polo = this.polos.get(char.polo);
      if (polo) polo.occupant = null;

      const previousPolo = char.polo; 
      char.wasOnPolo = char.polo;
      char.polo = null;
      char.singing = false;
      this.lastCharacterRemoved = charId;
      
      this.triggerCharacterEvent("whenCharacterRemoved", { ...char, wasOnPolo: previousPolo });
    }

    clearAllCharacters() {
      for (const char of this.characters.values()) {
        if (char.polo) {
          const polo = this.polos.get(char.polo);
          if (polo) polo.occupant = null;
          const previousPolo = char.polo;
          char.wasOnPolo = char.polo;
          char.polo = null;
      char.singing = false;
      this.lastCharacterRemoved = null;
          this.triggerCharacterEvent("whenCharacterRemoved", { ...char, wasOnPolo: previousPolo });
        }
      }
    }

    registerPolo(args) {
      const id = Cast.toString(args.ID);
      if (!this.polos.has(id)) {
        this.polos.set(id, { id: id, occupant: null, customProps: {} });
      }
    }

    deletePolo(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo || polo.occupant) return; 

      this.polos.delete(id);
    }

    getPoloOccupant(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      return polo?.occupant || "";
    }

    clearPoloOccupant(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo || !polo.occupant) return;

      const char = this.characters.get(polo.occupant);
      if (char) {
        const previousPolo = char.polo;
          char.wasOnPolo = char.polo;
          char.polo = null;
      this.lastCharacterRemoved = char.id;
        this.triggerCharacterEvent("whenCharacterRemoved", { ...char, wasOnPolo: previousPolo });
      }

      polo.occupant = null;
    }

    getPoloProperty(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo) return "";

      const prop = Cast.toString(args.PROPERTY);
      switch (prop) {
        case "occupant id": return polo.occupant || "";
        case "occupied": return !!polo.occupant || "false";
        default: return "";
      }
    }

    setPoloCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo) return;

      const key = Cast.toString(args.KEY);
      const value = args.VALUE;

      polo.customProps[key] = value;
    }

    getPoloCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo) return "";

      const key = Cast.toString(args.KEY);
      return polo.customProps[key] !== undefined ? polo.customProps[key] : "";
    }

    deletePoloCustomProperty(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo) return;

      const key = Cast.toString(args.KEY);
      delete polo.customProps[key];
    }

    poloIsOccupied(args) {
      const id = Cast.toString(args.ID);
      const polo = this.polos.get(id);
      if (!polo) return 'false';

      return polo && polo.occupant !== null;
    }

    getAllEmptyPolos(args) {
      const format = Cast.toString(args.FORMAT);
      const polos = Array.from(this.polos.values())
        .filter(polo => !polo.occupant);

      if (format === "names") {
        return makeArr(polos.map(polo => polo.id));
      } else {
        return makeArr(polos);
      }
    }

    getAllOccupiedPolos(args) {
      const format = Cast.toString(args.FORMAT);
      const polos = Array.from(this.polos.values())
        .filter(polo => polo.occupant);

      if (format === "names") {
        return makeArr(polos.map(polo => polo.id));
      } else {
        return makeArr(polos);
      }
    }

    areAnyCharactersPlaced()
    {
      const polos = Array.from(this.polos.values())
        .filter(polo => polo.occupant);
        return Boolean((polos && polos.length > 0));

    }
  
    getAllPlacedCharacters(args) {
      const format = Cast.toString(args.FORMAT);
      const characters = Array.from(this.polos.values())
        .filter(polo => polo.occupant);

      if (format === "names") {
        return makeArr(characters.map(polo => polo.occupant));
      } else {
        return makeArr(characters.map(polo => this.characters.get(polo.occupant)));
      }
    }

    amountofcharactersplaced()
    {
            const characters = Array.from(this.polos.values())
        .filter(polo => polo.occupant);
    return characters.length
    }

    getAllPolos(args) {
      const format = Cast.toString(args.FORMAT);
      const polos = Array.from(this.polos.values());

      if (format === "names") {
        return makeArr(polos.map(polo => polo.id));
      } else {
        return makeArr(polos);
      }
    }

    createLoopData(args) {
        const totalBeats = Cast.toNumber(args.BARS) * Cast.toNumber(args.BPB);
        const beatDuration = 60 / Cast.toNumber(args.BPM);
      const data = {
        id: Cast.toString(args.ID),
        bpm: Cast.toNumber(args.BPM),
        bars: Cast.toNumber(args.BARS),
        beatsPerBar: Cast.toNumber(args.BPB),
        lengthInSeconds: (totalBeats * beatDuration).toFixed(3),
        beatLength: (totalBeats * beatDuration).toFixed(3) / (totalBeats),
        lengthInBeats: totalBeats
      };
      this.loops.set(data.id, data);
      return toObj(data);
    }

    getLoopProperty(args) {
      try {
        const loopData = JSON.parse(Cast.toString(args.LOOP));
        const prop = Cast.toString(args.PROPERTY);
    
        switch (prop) {
          case "id": return loopData.id || "";
          case "bpm": return loopData.bpm || 0;
          case "bars": return loopData.bars || 0;
          case "beats per bar": return loopData.beatsPerBar || 0;
          case "length in seconds": return loopData.lengthInSeconds || 0;
          case "beat length": return loopData.beatLength || 0;
          case "length in beats": return loopData.lengthInBeats || 0;
          default: return "";
        }
      } catch {
        return "";
      }
    }

    getLoopPropertyfromCurrentLoop(args)
    {
      try {
        const loopData = this.currentLoop;
        const prop = Cast.toString(args.PROPERTY);
    
        switch (prop) {
          case "id": return loopData.id || "";
          case "bpm": return loopData.bpm || 0;
          case "bars": return loopData.bars || 0;
          case "beats per bar": return loopData.beatsPerBar || 0;
          case "length in seconds": return loopData.lengthInSeconds || 0;
          case "beat length": return loopData.beatLength || 0;
          case "length in beats": return loopData.lengthInBeats || 0;
          default: return "";
        }
      } catch {
        return "";
      }
    }

    getlastupdated(args)
    {
          try {
        const prop = Cast.toString(args.LASTMENU);
    
        switch (prop) {
          case "placed": return this.lastCharacterPlaced || "";
          case "removed": return this.lastCharacterRemoved || "";
          case "replaced": return this.lastCharacterReplaced || "";
          default: return "";
        }
      } catch {
        return "";
      }
    }


    startLoop(args) {
      try {
        const loopData = JSON.parse(Cast.toString(args.LOOP));
    this.startLoopInternal(loopData)
      } catch (e) {
        console.error("Invalid loop data:", e);
      }
    }

            startLoopInternal(data) {
            const ctx = this._getAudioCtx()
            this.currentLoop      = data
            this.currentBeat      = -1
            this.currentBar       = -1
            this.lastLoopProgress = 0
            this._loopRunning     = true
              this.halfwaydone = false;
            this._loopPausedElapsed = 0
            this._loopStartAudioTime = ctx.currentTime
            this._totalBeats      = 0
            this._beatPosition    = 0
for (const polo of this.polos.values()) {
        if (polo && polo.occupant !== null) {
        let char = this.characters.get(polo.occupant)
          char.singing = true;
        }
      }
        this.triggerLoopEvent("whenLoopStarts", data);
        }


    startLoopAndWait(args, util) {
      return new Promise((resolve) => {
        try {
          const loopData = JSON.parse(Cast.toString(args.LOOP));
          this.startLoop(args);

          const beatDuration = (60 / loopData.bpm) * 1000;
          const totalDuration = beatDuration * loopData.bars * loopData.beatsPerBar;

          setTimeout(() => {
            resolve();
          }, totalDuration);
        } catch (e) {
          console.error("Invalid loop data:", e);
          resolve();
        }
      });
    }

    getCurrentBeat() {
            this._updateLoopTime()
            return (this._loopRunning) ? Math.max(0, Math.floor(this._totalBeats % (this.currentLoop?.beatsPerBar || 4))) : 0;
    }

    getCurrentBar() {
            this._updateLoopTime()
            return (this._loopRunning) ? Math.max(0, Math.floor((this._totalBeats / (this.currentLoop?.bars || 4)) % (this.currentLoop?.bars || 4))) : 0;
    }

    getCurrentLoopPosition() {
      if (!this.currentLoop || !this.loopStartTime) return 0;
      const elapsed = performance.now() - this.loopStartTime;
      const beatDuration = (60 / this.currentLoop.bpm) * 1000;
      return (elapsed / beatDuration) % (this.currentLoop.bars * this.currentLoop.beatsPerBar);
    }

        getTimeUntilNextBeat() {
            if (!this._loopRunning || !this.currentLoop) return 0
            this._updateLoopTime()
            const secondsPerBeat = 60 / (this.currentLoop.bpm || 120)
            const timeSinceBeat  = this._beatPosition * secondsPerBeat
            return parseFloat((secondsPerBeat - timeSinceBeat).toFixed(4))
        }
    
    getLoopProgress() {
            this._updateLoopTime()
      if (!this.currentLoop || !this.loopStartTime) {
        return this.lastLoopProgress || 0;
      }
    
      return lastLoopProgress.toFixed(3);
    }

        waitForNextBeat() {
            this._updateLoopTime()
            const startBeat = Math.floor(this._totalBeats)
            return new Promise(resolve => {
                const poll = () => {
                    this._updateLoopTime()
                    if (Math.floor(this._totalBeats) > startBeat) return resolve()
                    requestAnimationFrame(poll)
                }
                requestAnimationFrame(poll)
            })
        }

    stopAllLoops() {
      if (this.loopRAF) {
        cancelAnimationFrame(this.loopRAF);
        this.loopRAF = null;
      }
      if (this.timerRAF) {
        cancelAnimationFrame(this.timerRAF);
        this.timerRAF = null;
      }
      if (this.loopInterval) {
        clearInterval(this.loopInterval);
        this.loopInterval = null;
      }
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.timerRunning = false;
      this._loopRunning     = false
      this.internalTimer = 0;
      this.currentLoop = null;
      this.currentBeat = -1;
      this.currentBar = -1;
      this.lastLoopProgress = 0;
    }

    resetAll() {
      for (const char of this.characters.values()) {
        if (char.polo) {
          const polo = this.polos.get(char.polo);
          if (polo) polo.occupant = null;
        }
      }
      this.characters.clear();

      this.polos.clear();

      this.loops.clear();

      this.categories.clear();

      this.lastCharacterPlaced = null;
      this.lastCharacterRemoved = null;
      this.lastCharacterReplaced = null;

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.timerRunning = false;
      this.internalTimer = 0;

      if (this.loopInterval) {
        clearInterval(this.loopInterval);
        this.loopInterval = null;
      }
      this.currentLoop = null;
      this.currentBeat = 0;
      this.currentBar = 0;

      this.soloedCharacter = null;
      this.lastLoopProgress = 0;
    }

    reset(args)
    {
          try {
        const prop = Cast.toString(args.MENU);
    
        switch (prop) {
          case "characters": this.characters.clear();
          case "polos": return this.polos.clear();
          case "categorys": return this.categories.clear();
          default: return "";
        }
      } catch {
        return "";
      }
    }

    getTimer() {
            this._updateLoopTime()
      const elapsed = (this._loopRunning) ? this._getLoopElapsedSeconds() : 0;
      
      return elapsed.toFixed(3);
    }

    soloCharacter(args) {
      const id = Cast.toString(args.ID);
      const char = this.characters.get(id);
      if (!char) return;

      const action = Cast.toString(args.ACTION);
      const mode = Cast.toString(args.MODE);

      if (action === "solo") {

        if (this.soloedCharacter && this.soloedCharacter !== id) {
          const prevSoloed = this.characters.get(this.soloedCharacter);
          if (prevSoloed) {
            prevSoloed.soloed = false;
          }
        }

        for (const [charId, c] of this.characters) {
          c.previousMuteState = c.muted;
          if (charId !== id) {
            c.muted = true;
          }
        }
        char.muted = false;
        char.soloed = true;
        this.soloedCharacter = id;
      } else {

        if (mode === "unmute all") {

          for (const c of this.characters.values()) {
            c.muted = false;
            c.soloed = false;
          }
        } else {

          for (const c of this.characters.values()) {
            c.muted = c.previousMuteState;
            c.soloed = false;
          }
        }
        this.soloedCharacter = null;
      }
    }

    getCurrentlySoloedCharacter() {
      return this.soloedCharacter || "";
    }

    whenLoopStarts() {
      return true; 
    }

    whenLoopFinishes() {
      return true;
    }

    whenLoopHalfwayDone()
    {
      return true;
    }

    whenCharacterPlaced() {
      return true;
    }

    whenCharacterRemoved() {
      return true;
    }

    whenCharacterReplaced() {
      return true;
    }

    whenBeat() {
      return true;
    }

    whenNewBar() {
      return true;
    }

    eventLoop(args, util) {
      const data = util.thread[EventKey];
      if (!data) return "";
    
      const prop = Cast.toString(args.PROPERTY);
      switch (prop) {
        case "id": return data.id || "";
        case "bpm": return data.bpm || 0;
        case "bars": return data.bars || 0;
        case "beats per bar": return data.beatsPerBar || 0;
        case "length in seconds": {
          const totalBeats = data.bars * data.beatsPerBar;
          const beatDuration = 60 / data.bpm;
          return (totalBeats * beatDuration).toFixed(3);
        }
        case "length in beats": {
          return data.bars * data.beatsPerBar;
        }
        default: return "";
      }
    }

    eventCharacter(args, util) {
      const data = util.thread[EventKey];
      if (!data) return "";

      const prop = Cast.toString(args.PROPERTY);
      switch (prop) {
        case "id": return data.id || "";
        case "category": return data.category || "";
        case "assigned sprite": return data.assignedSprite || "";
        case "order": return data.order || 0;
        case "page": return data.page || 0;
        case "max volume": return data.maxVolume || 0;
        case "current volume": return (data.currentVolume * (data.maxVolume / 100)) || 0;
        case "true volume": return data.currentVolume || 0;
        case "polo": return data.polo || "";
        case "placed": if (data.polo !== null) { return 'true' } return 'false';
        case "muted": return data.muted || false;
        case "last polo": return data.wasOnPolo || "";
        case "singing": return data.singing || false;
        default: return "";
      }
    }

    triggerLoopEvent(opcode, loopData) {
      const threads = runtime.startHats("incredimodUtilsMODDED_" + opcode);
      for (const thread of threads) {
        thread[EventKey] = loopData;
      }
    }

    triggerCharacterEvent(opcode, charData) {
      const threads = runtime.startHats("incredimodUtilsMODDED_" + opcode);
      for (const thread of threads) {
        thread[EventKey] = charData;
      }
    }
    getCurrentLoop()
    {
    return toObj(this.currentLoop);
    }
  }

  Scratch.extensions.register(new incredimodUtilsMODDED());
})(Scratch);
