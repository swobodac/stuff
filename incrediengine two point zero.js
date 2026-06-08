(function(Scratch) {
    'use strict'

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("'IncrediEngine 2.0' is based off'4TheEngine', which must run unsandboxed")
    }

    const vm = Scratch.vm
    const runtime = Scratch.vm.runtime
    const Cast = Scratch.Cast


    function getJwArray() {
        return vm.jwArray ?? {
            Type: class {
                static toArray(x) {
                    return Array.isArray(x) ? x : []
                }
            },
            Block: {},
            Argument: {}
        }
    }

    function getDogeiscutObject() {
        return vm.dogeiscutObject ?? {
            Type: class {
                static toObject(x) {
                    return x
                }
                static blank = {}
            },
            Block: {},
            Argument: {}
        }
    }


    const EventKey = Symbol('IncrediEngine2point0_eventData')


    function toObj(x) {
        return getDogeiscutObject().Type.toObject(x)
    }

    function toArr(x) {
        return getJwArray().Type.toArray(x)
    }

    function makeArr(a) {
        return new(getJwArray().Type)(a)
    }


    class IncrediEngine2point0 {
        constructor() {

            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
            if (!vm.dogeiscutObject) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js')


            this.characters = new Map()
            this.slots = new Map()
            this.loops = new Map()
            this.categories = new Set(['beats', 'effects', 'melodies', 'voices', 'bonuses'])

            this.soloedCharacter = null


            this._audioCtx = null
            this._vmEventBound = false


            this._timerRunning = false
            this._timerOrigin = 0
            this._timerPaused = 0
            this.internalTimer = 0


            this.currentLoop = null
            this.currentBeat = -1
            this.currentBar = -1
            this.lastLoopProgress = 0
            this.halfwayDone = false;

            this._loopRunning = false
            this._loopStartAudioTime = 0
            this._loopPausedElapsed = 0
            this._totalBeats = 0
            this._beatPosition = 0


            this._setupVMEvents()

            runtime.on('PROJECT_STOP_ALL', () => this._stopAllLoops())
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

            this._audioCtx = scratchCtx || new(window.AudioContext || window.webkitAudioContext)()
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
            if (!this._loopRunning || !this.currentLoop) return 0;

            const elapsed = this._getLoopElapsedSeconds()
            const bpm = this.currentLoop.bpm || 120
            const secondsPerBeat = 60 / bpm
            this._totalBeats = elapsed / secondsPerBeat
            this._beatPosition = this._totalBeats % 1
        }


        _tick() {

            if (this._timerRunning) {
                const ctx = this._getAudioCtx()
                this.internalTimer = this._timerPaused + (ctx.currentTime - this._timerOrigin)
            }


            if (!this._loopRunning || !this.currentLoop) return

            this._updateLoopTime()

            const data = this.currentLoop
            const secondsPerBeat = 60 / (data.bpm || 120)
            const totalBeats = data.bars * data.beatsPerBar
            const totalSeconds = secondsPerBeat * totalBeats
            const elapsed = this._getLoopElapsedSeconds()


            if (elapsed >= totalSeconds) {
                const carry = elapsed % totalSeconds
                this._loopPausedElapsed = 0
                this._loopStartAudioTime = this._getAudioCtx().currentTime - carry
                this.lastLoopProgress = 100
                this._triggerLoopEvent('whenLoopFinishes', data)

                this._updateLoopTime()
            }
            else if (elapsed >= (totalSeconds / 2) & !this.halfwayDone) {
                this.halfwayDone = true;
                this._triggerLoopEvent("whenLoopHalfwayDone", data);

                this._updateLoopTime()
            }

            const newBeat = Math.floor(this._totalBeats % data.beatsPerBar)
            const newBar = Math.floor(this._totalBeats / data.beatsPerBar)

            if (newBeat !== this.currentBeat) {
                this.currentBeat = newBeat
                runtime.startHats('incrediengine2point0_whenBeat')
            }
            if (newBar !== this.currentBar) {
                this.currentBar = newBar
                runtime.startHats('incrediengine2point0_whenNewBar')
            }

            this.lastLoopProgress = Math.min(100, (elapsed / totalSeconds) * 100)
        }


        getInfo() {
            return {
                id: 'incrediengine2point0',
                name: 'IncrediEngine 2.0',
                "color1": "#2b2b2b",
                "color2": "#212121",
                "color3": "#0d0d0d",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjQuMTczMTEiIGhlaWdodD0iMTI0LjE3MzExIiB2aWV3Qm94PSIwLDAsMTI0LjE3MzExLDEyNC4xNzMxMSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIzMTkuOTk5OTgiIHkxPSIxMTcuOTEzNDUiIHgyPSIzMTkuOTk5OTgiIHkyPSIyNDIuMDg2NTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNGQ0ZDRkIiBzdG9wLW9wYWNpdHk9IjAuNTAxOTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAwMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU3LjkxMzQzLC0xMTcuOTEzNDQpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yODMuNjAyMTEsMTE3LjkxMzQ1aDcyLjc5NTc3YzE0LjIzMTU1LDAgMjUuNjg4NjcsMTEuNDU3MTUgMjUuNjg4NjcsMjUuNjg4Njd2NzIuNzk1NzdjMCwxNC4yMzE1MiAtMTEuNDU3MTIsMjUuNjg4NjcgLTI1LjY4ODY3LDI1LjY4ODY3aC03Mi43OTU3N2MtMTQuMjMxNTIsMCAtMjUuNjg4NjcsLTExLjQ1NzE1IC0yNS42ODg2NywtMjUuNjg4Njd2LTcyLjc5NTc3YzAsLTE0LjIzMTUyIDExLjQ1NzE1LC0yNS42ODg2NyAyNS42ODg2NywtMjUuNjg4Njd6IiBmaWxsPSJ1cmwoI2NvbG9yLTEpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSI0LjQzOTIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjc2LjczNzgsMTcyLjkyODhjMCwwIDYuMTYzMjksLTUuOTIxODcgNi4yOTE2MSwtNi43ODc2MWMwLjMzNjU0LC0yLjI3MDYzIC0wLjE2Nzc2LC00MC4xNzMxNyAzNS45Njc3NSwtNDEuNTczODJjNDQuNjM2MzMsLTAuOTEzNjIgMzkuMDE0ODksMzUuMzQ4NzIgNDEuNTMwODgsNDIuMTkwM2MzLjQ0OTgxLDkuMzgwODQgNi4xNTY2NCwxNy40MDAxNiA2LjE1NjY0LDE3LjQwMDE2YzAsMCAtMi43NjcxNSwtMi4wNTM1MSAtNC4wNzk3LC0zLjEzMzk3Yy0xLjIyNDIsLTEuMDA3NzMgLTMuODAxNDMsLTMuMTQ1ODUgLTMuODAxNDMsLTMuMTQ1ODVjMCwwIDMuMDkxMTEsMTAuMzQ4MSAxLjMxMDkyLDIwLjY5NDk4Yy0xLjU2MjMsOS40ODA5OCAtNy4yOTc4MiwxNy4yMjU0MyAtNy4yOTc4MiwxNy4yMjU0M2wtMS4xNTUyMiwtMi4zNDczNWMwLDAgLTEuMDIyNjYsMi4xOTc5NCAtMi4xNjAwNSwzLjMzMjc0Yy0xLjEzNzQsMS4xMzQ3OSAtMy40Mzg3MywyLjkxMjczIC0zLjQzODczLDIuOTEyNzNsLTAuMDkyMDUsLTMuNzA0MjFjMCwwIC03LjA2MDEsMTEuMDE3OTUgLTI0LjM1MDY2LDEwLjg3MTU0Yy0xNi4zMDYyNSwtMC4yNTU0NyAtMjYuMDcxNTEsLTEwLjY3NTIgLTI2LjA3MTUxLC0xMC42NzUybC0wLjExNjIsMi42NTQ4NGMwLDAgLTMuODk0NzcsLTMuMjkyNzYgLTYuMTgxNDUsLTkuNzA3NTRjLTIuNzI1NDUsLTcuNjQ1NjcgLTMuMjM5NDYsLTEyLjI0MzI0IC0zLjIzOTQ2LC0xMi4yNDMyNGMwLDAgLTIuMzM5MDgsMS44OTkxNiAtNS43MTcwNCwyLjc3NDRjLTQuMjMyNzgsMS4wOTY3MyAtNi45NDY2NSwwLjM0NTI2IC02Ljk0NjY1LDAuMzQ1MjZjMCwwIDMuNjA3OTUsLTIuNzE3MTcgNS41ODM5NiwtNC43Njk4OWMxLjc2MDA3LC0xLjgyODQgMi42NDY1OCwtMy4zNzcyMiAyLjY0NjU4LC0zLjM3NzIyYzAsMCAtMi4xMDc1OCwxLjA4NDcgLTQuMjMyNzcsMS42MTc5NWMtMi4yMTczOSwwLjU1NjQgLTQuMDMwMDgsMC41MzA5MyAtNC4wMzAwOCwwLjUzMDkzYzAsMCA0Ljk3NDkyLC01LjAzNzI4IDcuMDMwNzQsLTEwLjg3NDI5YzEuOTQxMDIsLTUuNTExMDggMi4wOTk3MiwtMTAuOTU3MzEgMi4wOTk3MiwtMTAuOTU3MzFjMCwwIC0xLjM2MTY1LDAuNjYxNjMgLTMuMzMwMTMsMC43OTUxM2MtMS4yNDc3NiwwLjA4NDYzIC0yLjM3Nzg1LC0wLjA0ODkgLTIuMzc3ODUsLTAuMDQ4OXoiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjkzLjUyMzY4LDE4NC4yNTA0MmMtMC41NzcwOSwtNy4yOTMyMyAwLjMzNSwtMTcuMTU0NDggMC4zMzUsLTE3LjE1NDQ4YzAsMCAzLjQxMDU5LC0wLjA0MTI0IDEzLjkxNDI5LC0zLjE0NDI0YzguMDY5NiwtMi4zODM5NCAyMC41NDczMSwtOS40ODcyMiAyMC41NDczMSwtOS40ODcyMmMwLDAgLTIuMTYwMDUsMy4wMDUwMyAtMy40MDc4MSw0LjQ2MDE1Yy0xLjMyNjUxLDEuNTQ2OTYgLTMuOTkyOTIsNC41NjI5NyAtMy45OTI5Miw0LjU2Mjk3YzAsMCA3LjgzOCwtMS42Njc2MSAxNC42NzQ3NiwtNC43MjkzMWM4LjU2ODM3LC0zLjUzNTc1IDEwLjU5MjUyLC02LjA1MzA5IDEyLjk1MDQyLC00LjU5MjdjMi43ODI5LDEuNzIzNjIgMS4wMzAwNiwyMy4xODI3IDAuNzE4NDYsMjguNzQwNjJjLTAuNDIxNjMsNS42NjkyMiAtMi41MzMyNyw5LjQ5OTY5IC0zLjE1MDMxLDEyLjUyMDUzYy0wLjYxNzA0LDMuMDIwODQgLTAuNDA5Niw2LjEzNjYyIC0yLjIwNjIyLDE2LjAzOTdjLTEuMTIxMjEsNi4xODAyMSAtNC4xNjE4Myw4LjkyNDY2IC0xMC4wMTk0MiwxNC42NjA4MWMtNS44NTc1OSw1LjczNjE2IC05LjA1Mzc4LDkuMjUyNzUgLTEzLjAxMzU5LDkuMzIxNzNjLTMuODEwNzcsMC4wNjYzOSAtOC45MzU2NSwtNS4xMDAyIC0xMy45MzU0MiwtMTAuMzgyNDRjLTUuMzIzOTMsLTUuNjI0NzQgLTguODc0ODksLTguNDc3MTMgLTkuNzE1NTEsLTE1LjEzOTc1Yy0wLjc1NzA3LC02LjAwMDM5IC0wLjc3NjUzLC05LjkwODUzIC0xLjEyMjY2LC0xNS4yNDgzNWMtMC4yNTI5OCwtMy45MDI3MyAtMi4yNjExOSwtNi40NDUwNCAtMi41NzYzNiwtMTAuNDI4MDF6IiBmaWxsPSIjODA4MDgwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI5NS4yMjMzMiwxOTQuMzczNjRjMCwwIC00LjkzMjExLC0zLjUxNzA1IC02LjE2NDE3LC04Ljk3NTAyYy0xLjI5NjM2LC01Ljc0Mjg0IC0xLjQ2MTE4LC05LjczMjggMC40ODAxMywtOS45OTE5M2MxLjk0MTMxLC0wLjI1OTE1IDIuNzAzMjEsMi4zNzY5MiAzLjczMjYyLDguMzU1NjljMS4wMjk0LDUuOTc4NzcgMS45NTE0MywxMC42MTEyNyAxLjk1MTQzLDEwLjYxMTI3eiIgZmlsbD0iIzgwODA4MCIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjk1LjAyMDczLDE5MC40MjYwOGMwLDAgLTMuNTYzODUsLTIuOTIzMzggLTQuMzE4MTYsLTguNDUwNjFjLTAuNDIwNzksLTMuMDgzMjcgMi4xNTY3NSwtMi4yODAxNiAyLjE1Njc1LC0yLjI4MDE2IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMzQ5LjQ1NjQ4LDE4My43NjIzN2MxLjAyOTQsLTUuOTc4NzcgMS43OTEzLC04LjYxNDgzIDMuNzMyNjIsLTguMzU1NjljMS45NDEzMSwwLjI1OTE0IDEuNzc2NDksNC4yNDkwOSAwLjQ4MDEzLDkuOTkxOTNjLTEuMjMyMDYsNS40NTc5NyAtNi4xNjQxNyw4Ljk3NTAyIC02LjE2NDE3LDguOTc1MDJjMCwwIDAuOTIyMDMsLTQuNjMyNSAxLjk1MTQzLC0xMC42MTEyN3oiIGZpbGw9IiM4MDgwODAiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTM0OS44NjkwOCwxNzkuNjk1MzFjMCwwIDIuNTc3NTQsLTAuODAzMTIgMi4xNTY3NSwyLjI4MDE2Yy0wLjc1NDMxLDUuNTI3MjMgLTQuMzE4MTYsOC40NTA2MSAtNC4zMTgxNiw4LjQ1MDYxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48L2c+PC9nPjwvc3ZnPg==",
                blocks: [

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "A modifaction of draker's '4TheEngine' extension."
                    },


                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Characters'
                    },

                    {
                        opcode: 'newCharacter',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        allowDropAnywhere: true,
                        text: 'create character object using id [ID] category [CATEGORY] order [ORDER] max volume [VOLUME] page [PAGE]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CATEGORY_MENU'
                            },
                            ORDER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            VOLUME: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'page1'
                            }
                        }
                    },
                    {
                        opcode: 'registerCharacter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'register char [CHAR]',
                        arguments: {
                            CHAR: {
                                shape: Scratch.BlockShape.PLUS,
                                type: Scratch.ArgumentType.ANY,
                                defaultValue: '',
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'deleteCharacter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete character [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    {
                        opcode: 'characterExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'character [ID] exists?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'getCharacterProperty',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: '[PROPERTY] of character [ID]',
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CHAR_PROPS'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterProperty',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PROPERTY] of character [ID] to [VALUE]',
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CHAR_SET_PROPS'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterCustomProp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set custom prop [KEY] of character [ID] to [VALUE]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'color'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'red',
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'getCharacterCustomProp',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'custom prop [KEY] of character [ID]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'color'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        },
                        allowDropAnywhere: true
                    },
                    {
                        opcode: 'assignSpriteWithCharacterID',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[MENU] [ID] to [SPRITE]',
                        arguments: {
                            MENU: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ASSIGN_MENU'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SPRITES'
                            }
                        }
                    },
                    {
                        opcode: 'getAssiginedIDFromSprite',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get assigned character id from [SPRITE]',
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SPRITES'
                            }
                        }
                    },
                    {
                        opcode: 'getAssiginedIDFromThisSprite',
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: 'get assigned character id from this sprite',
                    },
                    {
                        opcode: 'getCharacterAsObject',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        allowDropAnywhere: true,
                        text: 'character [ID] as object',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'muteCharacter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[ACTION] character [ID]',
                        arguments: {
                            ACTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MUTE_ACTIONS'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    {
                        opcode: 'soloCharacter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[ACTION] character [ID] [UNSOLO_MODE]',
                        arguments: {
                            ACTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SOLO_ACTIONS'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            UNSOLO_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'UNSOLO_MODES'
                            }
                        }
                    },
                    {
                        opcode: 'getCurrentlySoloedCharacter',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'currently soloed character'
                    },
                    '---',
                    {
                        opcode: 'getAllCharactersInCategory',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all characters in [CATEGORY] on page [PAGE]',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CATEGORY_MENU'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'page1'
                            }
                        },
                        allowDropAnywhere: true,
                    },
                    {
                        opcode: 'getAllCharactersInCategoryByOrder',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all characters in [CATEGORY] on page [PAGE] sorted by order',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CATEGORY_MENU'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'page1'
                            }
                        },
                        allowDropAnywhere: true,
                    },
                    {
                        opcode: 'getAllCharacterIDs',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all character IDs on page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'page1'
                            }
                        },
                    },
                    {
                        opcode: 'getAllCharacterIDsFromAllPages',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all character IDs',
                    },
                    {
                        opcode: 'getAllPlacedCharacterIDs',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all placed character IDs'
                    },
                    {
                        opcode: 'areAnyCharactersPlaced',
                        blockType: Scratch.BlockType.BOOLEAN,
                        allowDropAnywhere: true,
                        text: 'are any characters placed'
                    },

                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Slots'
                    },

                    {
                        opcode: 'registerSlot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'register slot [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'deleteSlot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete slot [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'putCharacterInSlot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'put character [CHARACTER] in slot [SLOT]',
                        arguments: {
                            CHARACTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'replaceCharacterInSlot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'replace character in slot [SLOT] with [CHARACTER]',
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            },
                            CHARACTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'char2'
                            }
                        }
                    },
                    {
                        opcode: 'clearCharacterFromSlots',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear character [CHARACTER] from its slot',
                        arguments: {
                            CHARACTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'polo'
                            }
                        }
                    },
                    {
                        opcode: 'clearSlotOccupant',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear occupant from slot [SLOT]',
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'clearAllCharactersFromSlots',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear all characters from slots'
                    },
                    '---',
                    {
                        opcode: 'slotIsOccupied',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'slot [SLOT] is occupied?',
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'getSlotOccupant',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'occupant of slot [SLOT]',
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'setSlotCustomProp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set custom prop [KEY] of slot [SLOT] to [VALUE]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'position'
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '0',
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'getSlotCustomProp',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'custom prop [KEY] of slot [SLOT]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'position'
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        },
                        allowDropAnywhere: true
                    },
                    {
                        opcode: 'getSlotAsObject',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        allowDropAnywhere: true,
                        text: 'slot [SLOT] as object',
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'slot1'
                            }
                        }
                    },
                    {
                        opcode: 'getAllSlots',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all slot IDs'
                    },
                    {
                        opcode: 'getAllEmptySlots',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all empty slot IDs'
                    },
                    {
                        opcode: 'getAllOccupiedSlots',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all occupied slot IDs'
                    },


                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Categories'
                    },

                    {
                        opcode: 'categoryReporter',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        disableMonitor: true,
                        text: 'category [CATEGORY]',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'CATEGORY_MENU'
                            }
                        }
                    },

                    {
                        opcode: 'registerCategory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'register category [CATEGORY]',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom'
                            }
                        }
                    },
                    {
                        opcode: 'deleteCategory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete category [CATEGORY]',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom'
                            }
                        }
                    },
                    {
                        opcode: 'categoryExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'category [CATEGORY] exists?',
                        arguments: {
                            CATEGORY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'beats'
                            }
                        }
                    },
                    {
                        opcode: 'getAllCategories',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        allowDropAnywhere: true,
                        text: 'all categories'
                    },


                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Loop System'
                    },

                    {
                        opcode: 'createLoop',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        allowDropAnywhere: true,
                        text: 'loop ID [ID] BPM [BPM] bars [BARS] beats/bar [BPB]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'loop1'
                            },
                            BPM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 120
                            },
                            BARS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            },
                            BPB: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            }
                        }
                    },
                    {
                        opcode: 'getLoopProperty',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: '[PROPERTY] of loop [LOOP]',
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'LOOP_PROPS'
                            },
                            LOOP: {
                                shape: Scratch.BlockShape.PLUS,
                                type: Scratch.ArgumentType.ANY,
                                defaultValue: '',
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'startLoop',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'start loop [LOOP]',
                        arguments: {
                            LOOP: {
                                type: Scratch.ArgumentType.ANY,
                                shape: Scratch.BlockShape.PLUS,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'startLoopAndWait',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'start loop [LOOP] and wait',
                        arguments: {
                            LOOP: {
                                type: Scratch.ArgumentType.ANY,
                                shape: Scratch.BlockShape.PLUS,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'stopLoops',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop loops and timer'
                    },
                    '---',
                    {
                        opcode: 'loopsPlaying',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'are any loops playing'
                    },
                    {
                        opcode: 'getCurrentLoop',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        allowDropAnywhere: true,
                        text: 'current loop'
                    },
                    {
                        opcode: 'getCurrentBeat',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'current beat'
                    },
                    {
                        opcode: 'getCurrentBar',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'current bar'
                    },
                    {
                        opcode: 'getLoopProgress',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'loop progress %'
                    },
                    {
                        opcode: 'getTimeUntilNextBeat',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'seconds until next beat'
                    },
                    {
                        opcode: 'waitForNextBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'wait for next beat'
                    },
                    '---',
                    {
                        opcode: 'whenBeat',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when beat'
                    },
                    {
                        opcode: 'whenNewBar',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when new bar'
                    },


                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Internal Timer'
                    },

                    {
                        opcode: 'resetTimer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset internal timer'
                    },
                    {
                        opcode: 'getTimer',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'internal timer'
                    },


                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Events'
                    },


                    {
                        opcode: 'eventLoop',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        allowDropAnywhere: true,
                        canDragDuplicate: true,
                        disableMonitor: true,
                        text: 'event loop',
                    },
                    {
                        opcode: 'eventCharacter',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        allowDropAnywhere: true,
                        canDragDuplicate: true,
                        disableMonitor: true,
                        text: 'event character',
                    },

                    {
                        opcode: 'whenLoopStarts',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when loop starts [LOOP]',
                        arguments: {
                            LOOP: {
                                fillIn: 'eventLoop'
                            }
                        }
                    },
                    {
                        opcode: 'whenLoopHalfwayDone',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when loop is halfway done [LOOP]',
                        arguments: {
                            LOOP: {
                                fillIn: 'eventLoop'
                            }
                        }
                    },
                    {
                        opcode: 'whenLoopFinishes',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when loop finishes [LOOP]',
                        arguments: {
                            LOOP: {
                                fillIn: 'eventLoop'
                            }
                        }
                    },
                    {
                        opcode: 'whenCharacterPlaced',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when character placed [CHARACTER]',
                        arguments: {
                            CHARACTER: {
                                fillIn: 'eventCharacter'
                            }
                        }
                    },
                    {
                        opcode: 'whenCharacterRemoved',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when character removed [CHARACTER]',
                        arguments: {
                            CHARACTER: {
                                fillIn: 'eventCharacter'
                            }
                        }
                    },
                    {
                        opcode: 'whenCharacterReplaced',
                        blockType: Scratch.BlockType.HAT,
                        isEdgeActivated: false,
                        text: 'when character replaced [CHARACTER]',
                        arguments: {
                            CHARACTER: {
                                fillIn: 'eventCharacter'
                            }
                        }
                    },


                    '---',
                    {
                        opcode: 'resetAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset all engine data'
                    },
                    {
                        opcode: 'getInternalMap',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        text: 'get internal object for [MENU]',
                        allowDropAnywhere: true,
                        arguments:
                        {
                            MENU: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'INTERNAL_MAP_MENU'
                            },
                        }
                    }
                ],
                menus: {
                    CHAR_PROPS: {
                        acceptReporters: true,
                        items: ['id', 'category', 'order', 'page', 'placed', 'singing', 'slot', 'was on slot', 'muted', 'current volume', 'true volume', 'max volume', 'assigned sprite']
                    },
                    CHAR_SET_PROPS: {
                        acceptReporters: true,
                        items: ['current volume', 'max volume', 'order']
                    },
                    ASSIGN_MENU: {
                        acceptReporters: true,
                        items: ['assign', 'unassign']
                    },
                    LOOP_PROPS: {
                        acceptReporters: true,
                        items: ['id', 'bpm', 'bars', 'beats per bar', 'length in seconds', 'length in beats', 'length per beat']
                    },
                    MUTE_ACTIONS: {
                        acceptReporters: true,
                        items: ['toggle muting for', 'mute', 'unmute']
                    },
                    SOLO_ACTIONS: {
                        acceptReporters: true,
                        items: ['solo', 'unsolo']
                    },
                    UNSOLO_MODES: {
                        acceptReporters: true,
                        items: ['restore previous states', 'unmute all']
                    },
                    CATEGORY_MENU: {
                        acceptReporters: true,
                        items: "getCategoriesMenu"
                    },
                    SPRITES: {
                    acceptReporters: true,
                    items: "getSpriteMenu"
                    },
                    INTERNAL_MAP_MENU: {
                    acceptReporters: true,
                    items: ['characters', 'slots', 'loops']
                    }
                }
            }
        }

        getSpriteMenu({}) {
        let sprites = new Array();
        for (let target of runtime.targets.filter(v => v !== vm.runtime._stageTarget)) {
            if (!sprites.includes(target.sprite.name)) sprites.push(target.sprite.name)
        }
        if (sprites.length === 0)  return ["no sprites found"];
        return sprites;
        }

        getCategoriesMenu()
        {
        let categoriesList = [];
        for (let categoryName of [...this.categories]) {
        categoriesList.push(categoryName)
        }
        return ['none', ...categoriesList];
        }

        categoryReporter({
            CATEGORY
        }) {
            return Cast.toString(CATEGORY)
        }

        findCharacterWithoutPageInput(ID)
        {
        const search = ID;
        let returnValue = {};
        this.characters.forEach((value, key, set) => {
        if (Object.keys(value).includes(search))
            { 
            returnValue = (value[search]);
            }
        });
        if (Object.keys(returnValue).length > 0)
        {
        return returnValue;
        }
        else
        {
        return;
        }
        }

        findAssignedIDForSprite(SPRITE)
        {
        let filter = [];
        let id = '';
        this.characters.forEach((value, key, set) => {
        filter = ([Object.values(set.get(key))])[0].filter(c => c.assignedSprite === SPRITE).map(c => c.id)
        if (filter.length > 0) id = filter[0];
        });
        return id;
        }

        newCharacter({
            ID,
            CATEGORY,
            ORDER,
            VOLUME,
            PAGE
        }) {
            return toObj({
                id: Cast.toString(ID),
                category: Cast.toString(CATEGORY),
                order: Cast.toNumber(ORDER),
                maxVolume: Cast.toNumber(VOLUME),
                page: Cast.toString(PAGE)
            })
        }


        registerCharacter({
            CHAR
        }) {
            let def
            try {
                def = JSON.parse(Cast.toString(CHAR))
            } catch {
                return
            }
            if (typeof def !== 'object' || !def.id) return

            const id = Cast.toString(def.id)
            const category = Cast.toString(def.category ?? 'beats')
            const volume = Cast.toNumber(def.maxVolume ?? 100)
            const page = Cast.toString(def.page ?? 'page1')

            this.categories.add(category)


            const known = new Set(['id', 'category', 'order', 'maxVolume', 'page'])
            const customProps = {}
            for (const [k, v] of Object.entries(def)) {
                if (!known.has(k)) customProps[k] = v
            }
                const registerData =
                {
                id,
                category,
                order: Cast.toNumber(def.order ?? 1),
                page,
                currentVolume: 100,
                maxVolume: volume,
                singing: false,
                slot: null,
                muted: false,
                soloed: false,
                previousMuteState: false,
                customProps
                }


                const currentCharacters = this.characters.get(page) || {};

                this.characters.set(page, {
                ...currentCharacters,
                [id]: [registerData][0]
                });
        }

        deleteCharacter({
            ID
        }) {
            ID = Cast.toString(ID)

            const char = this.findCharacterWithoutPageInput(ID)

            if (!char) return; 

            if (char?.slot) {
                const slot = this.slots.get(char.slot)
                if (slot) slot.occupant = null
            }

            const usePage = Cast.toString(char.page);

        const currentCharacters = (this.characters.get(usePage));
            
            delete currentCharacters[ID];

            this.characters.set(usePage, currentCharacters)

        }

        characterExists({
            ID
        }) {
            return Boolean(Object.keys(this.findCharacterWithoutPageInput(ID) || {}).length > 0)
        }

        getCharacterProperty({
            PROPERTY,
            ID
        }) {

            let  char = {};

            try {
             char = JSON.parse(ID);
            } catch (e) {
            char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            }
            
            if (!char) return ''
            switch (Cast.toString(PROPERTY)) {
                case 'id':
                    return char.id
                case 'category':
                    return char.category
                case 'order':
                    return char.order
                case 'placed':
                return Boolean(char.slot)
                case 'singing':
                return char.singing || 'false';
                case 'current volume':
                    return (char.currentVolume * (char.maxVolume / 100))
                case 'true volume':
                    return char.currentVolume
                case 'max volume':
                    return char.maxVolume
                case 'slot':
                    return char.slot ?? ''
                case 'muted':
                    return char.muted
                case 'was on slot':
                    return char.wasOnSlot ?? ''
                case 'page':
                    return char.page ?? ''
                case 'assigned sprite':
                    return char.assignedSprite ?? ''
                default:
                    return ''
            }
        }

        setCharacterProperty({
            PROPERTY,
            ID,
            VALUE
        }) {
            const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            if (!char) return
            VALUE = Cast.toNumber(VALUE)
            switch (Cast.toString(PROPERTY)) {
                case 'current volume':
                    char.currentVolume = Math.max(0, Math.min(VALUE, char.maxVolume));
                    break
                case 'max volume':
                    char.maxVolume = Math.max(0, VALUE);
                    break
                case 'order':
                    char.order = VALUE;
                    break
            }
        }

        setCharacterCustomProp({
            KEY,
            ID,
            VALUE
        }) {
            const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            if (!char) return
            char.customProps[Cast.toString(KEY)] = VALUE
        }

        getCharacterCustomProp({
            KEY,
            ID
        }) {
            const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            if (!char) return ''
            return char.customProps[Cast.toString(KEY)] ?? ''
        }

        getCharacterAsObject({
            ID
        }) {
            const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            if (!char) return getDogeiscutObject().Type.blank

            const plain = {
                ...char,
                ...char.customProps
            }
            delete plain.customProps
            delete plain.previousMuteState
            return toObj(plain)
        }

        muteCharacter({
            ACTION,
            ID
        }) {
            const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
            if (!char) return
            if (Cast.toString(ACTION) === 'toggle muting for')
            {
            char.muted = !char.muted;
            }
            else
            {
            char.muted = Cast.toString(ACTION) === 'mute';
            }
        }

        soloCharacter({
            ACTION,
            ID,
            UNSOLO_MODE
        }) {
            ID = Cast.toString(ID)
            const char = this.findCharacterWithoutPageInput(ID)

            if (!char) return

            ACTION = Cast.toString(ACTION)

            UNSOLO_MODE = Cast.toString(UNSOLO_MODE)

            let data = {};

            if (ACTION === 'solo') {

                if (this.soloedCharacter && this.soloedCharacter !== ID) {
                    const prev = this.findCharacterWithoutPageInput(this.soloedCharacter)
                    if (prev) prev.soloed = false
                }
                for (const c of JSON.parse(this.getAllPlacedCharacterIDs())) {
                    data = this.findCharacterWithoutPageInput(c)
                    data.previousMuteState = data.muted
                    data.muted = c !== ID
                }
                char.muted = false
                char.soloed = true
                this.soloedCharacter = ID
            } else {
                if (UNSOLO_MODE === 'unmute all') {
                    for (const c of JSON.parse(this.getAllPlacedCharacterIDs())) {
                        data = this.findCharacterWithoutPageInput(c);
                        data.muted = false;
                        data.soloed = false
                    }
                } else {
                    for (const c of JSON.parse(this.getAllPlacedCharacterIDs())) {
                        data = this.findCharacterWithoutPageInput(c);
                        data.muted = data.previousMuteState;
                        data.soloed = false
                    }
                }
                this.soloedCharacter = null
            }
        }

        getCurrentlySoloedCharacter() {
            return this.soloedCharacter ?? ''
        }

        getAllCharactersInCategory({
            CATEGORY,
            PAGE
        }) {
            CATEGORY = Cast.toString(CATEGORY)
            PAGE = Cast.toString(PAGE)
            let arr = [];
            try {
            arr = [...Object.values(this.characters.get(PAGE))].filter(c => c.category === CATEGORY).map(c => c.id)
            }
            catch (e)
            {
            arr = []
            }
            return makeArr(arr)
        }

        getAllCharactersInCategoryByOrder({
            CATEGORY,
            PAGE
        }) {
            CATEGORY = Cast.toString(CATEGORY)
            PAGE = Cast.toString(PAGE)
            let arr = [];
            try {
            arr = [...Object.values(this.characters.get(PAGE))]
                .filter(c => c.category === CATEGORY)
                .sort((a, b) => a.order - b.order)
                .map(c => c.id)
            }
            catch (e)
            {
            arr = []
            }
            return makeArr(arr)
        }

        getAllCharacterIDs({PAGE}) {
            let arr = [];
            PAGE = Cast.toString(PAGE)
            try
            {
            arr = [...Object.keys(this.characters.get(PAGE))]
            }
            catch (e)
            {
            arr = []
            }
            return makeArr(arr);
        }

            getAllCharacterIDsFromAllPages() {
            let arr = [];
            try
            {
        this.characters.forEach((value, key, set) => {
            arr.push(...Object.keys(value));
        });
            }
            catch (e)
            {
            alert(e)
            }
            return makeArr(arr);
        }

        getAllPlacedCharacterIDs() {
            return makeArr([...this.slots.values()].filter(s => s.occupant).map(s => s.occupant))
        }

        areAnyCharactersPlaced()
        {
        return Boolean(this.getAllPlacedCharacterIDs().length)
        }

        registerSlot({
            ID
        }) {
            ID = Cast.toString(ID)
            if (!this.slots.has(ID)) this.slots.set(ID, {
                id: ID,
                occupant: null,
                customProps: {}
            })
        }

        deleteSlot({
            ID
        }) {
            ID = Cast.toString(ID)
            const slot = this.slots.get(ID)
            if (!slot || slot.occupant) return
            this.slots.delete(ID)
        }

        putCharacterInSlot({
            CHARACTER,
            SLOT
        }) {
            CHARACTER = Cast.toString(CHARACTER)
            SLOT = Cast.toString(SLOT)
            const char = this.findCharacterWithoutPageInput(CHARACTER)
            if (!char) return


            if (char.slot) {
                const old = this.slots.get(char.slot)
                if (old) old.occupant = null
            }


            if (!this.slots.has(SLOT)) this.slots.set(SLOT, {
                id: SLOT,
                occupant: null,
                customProps: {}
            })

            const slot = this.slots.get(SLOT)
            slot.occupant = CHARACTER
            char.slot = SLOT
            char.wasOnSlot = SLOT
            char.singing = false
            this._triggerCharacterEvent('whenCharacterPlaced', char)
        }

        replaceCharacterInSlot({
            SLOT,
            CHARACTER
        }) {
            SLOT = Cast.toString(SLOT)
            CHARACTER = Cast.toString(CHARACTER)
            const slot = this.slots.get(SLOT)
            const newChar = this.findCharacterWithoutPageInput(CHARACTER)
            if (!slot || !newChar) return

            if (slot.occupant) {
                const oldChar =this.findCharacterWithoutPageInput(slot.occupant)
                if (oldChar) {
                    oldChar.slot = null
                    oldChar.wasOnSlot = SLOT
                    oldChar.singing = false
                    this._triggerCharacterEvent('whenCharacterReplaced', oldChar)
                }
            }
            if (newChar.slot) {
                const oldSlot = this.slots.get(newChar.slot)
                if (oldSlot) oldSlot.occupant = null
            }
            slot.occupant = CHARACTER
            newChar.slot = SLOT
            newChar.wasOnSlot = SLOT
            newChar.singing = false
            this._triggerCharacterEvent('whenCharacterPlaced', newChar)
        }

        clearCharacterFromSlots({
            CHARACTER
        }) {
            CHARACTER = Cast.toString(CHARACTER)
            const char = this.findCharacterWithoutPageInput(CHARACTER)
            if (!char?.slot) return
            const slot = this.slots.get(char.slot)
            if (slot) slot.occupant = null
            const wasOnSlot = char.slot
            char.slot = null
            char.singing = false
            this._triggerCharacterEvent('whenCharacterRemoved', {
                ...char,
                wasOnSlot
            })
        }

        clearSlotOccupant({
            SLOT
        }) {
            SLOT = Cast.toString(SLOT)
            const slot = this.slots.get(SLOT)
            if (!slot?.occupant) return
            const char = this.findCharacterWithoutPageInput(slot.occupant)
            if (char) {
                const wasOnSlot = char.slot
                char.slot = null
                char.wasOnSlot = wasOnSlot
                char.singing = false
                this._triggerCharacterEvent('whenCharacterRemoved', {
                    ...char,
                    wasOnSlot
                })
            }
            slot.occupant = null
        }

        clearAllCharactersFromSlots() {
        let data = {};
            for (const char of this.getAllPlacedCharacterIDs()) {
                data = this.findCharacterWithoutPageInput(char)
                if (!data.slot) continue
                const slot = this.slots.get(data.slot)
                if (slot) slot.occupant = null
                const wasOnSlot = data.slot
                data.slot = null
                data.wasOnSlot = wasOnSlot
                data.singing = false
                this._triggerCharacterEvent('whenCharacterRemoved', {
                    ...data,
                    wasOnSlot
                })
            }
        }

        slotIsOccupied({
            SLOT
        }) {
            const slot = this.slots.get(Cast.toString(SLOT))
            return !!(slot?.occupant)
        }

        getSlotOccupant({
            SLOT
        }) {
            return this.slots.get(Cast.toString(SLOT))?.occupant ?? ''
        }

        setSlotCustomProp({
            KEY,
            SLOT,
            VALUE
        }) {
            const slot = this.slots.get(Cast.toString(SLOT))
            if (!slot) return
            slot.customProps[Cast.toString(KEY)] = VALUE
        }

        getSlotCustomProp({
            KEY,
            SLOT
        }) {
            const slot = this.slots.get(Cast.toString(SLOT))
            if (!slot) return ''
            return slot.customProps[Cast.toString(KEY)] ?? ''
        }

        getSlotAsObject({
            SLOT
        }) {
            const slot = this.slots.get(Cast.toString(SLOT))
            if (!slot) return getDogeiscutObject().Type.blank
            const plain = {
                id: slot.id,
                occupant: slot.occupant ?? '',
                ...slot.customProps
            }
            return toObj(plain)
        }

        getAllSlots() {
            return makeArr([...this.slots.keys()])
        }
        getAllEmptySlots() {
            return makeArr([...this.slots.values()].filter(s => !s.occupant).map(s => s.id))
        }
        getAllOccupiedSlots() {
            return makeArr([...this.slots.values()].filter(s => s.occupant).map(s => s.id))
        }




        registerCategory({
            CATEGORY
        }) {
            if (Cast.toString(CATEGORY) === 'none') return;
            this.categories.add(Cast.toString(CATEGORY))
        }

        deleteCategory({
            CATEGORY
        }) {
            CATEGORY = Cast.toString(CATEGORY)
            const inUse = [...this.characters.values()].some(c => c.category === CATEGORY)
            if (!inUse) this.categories.delete(CATEGORY)
        }

        categoryExists({
            CATEGORY
        }) {
            return this.categories.has(Cast.toString(CATEGORY))
        }

        getAllCategories() {
            return makeArr([...this.categories])
        }




        _parseLoop(raw) {

            if (raw && typeof raw === 'object') return raw
            try {
                return JSON.parse(Cast.toString(raw))
            } catch {
                return null
            }
        }

        createLoop({
            ID,
            BPM,
            BARS,
            BPB
        }) {
            const totalBeats =  Cast.toNumber(BARS) * Cast.toNumber(BPB)
            const lengthSec = (totalBeats * 60) / (Cast.toNumber(BPM) || 120)
            const data = {
                id: Cast.toString(ID),
                bpm: Cast.toNumber(BPM),
                bars: Cast.toNumber(BARS),
                beatsPerBar: Cast.toNumber(BPB),
                lengthInBeats: totalBeats,
                lengthInSeconds: parseFloat(lengthSec.toFixed(3)),
                lengthPerBeat: lengthSec / (Cast.toNumber(BARS) * Cast.toNumber(BPB))
            }
            this.loops.set(data.id, data)
            return toObj(data)
        }

        getLoopProperty({
            PROPERTY,
            LOOP
        }) {
            const data = this._parseLoop(Cast.toString(LOOP))
            if (!data) return ''
            switch (Cast.toString(PROPERTY)) {
                case 'id':
                    return data.id ?? ''
                case 'bpm':
                    return data.bpm ?? 0
                case 'bars':
                    return data.bars ?? 0
                case 'beats per bar':
                    return data.beatsPerBar ?? 0
                case 'length per beat':
                    return data.lengthPerBeat ?? 0 
                case 'length in beats':
                    return data.lengthInBeats ?? 0
                case 'length in seconds': 
                    return data.lengthInSeconds ?? 0
                default:
                    return ''
            }
        }

        startLoop({
            LOOP
        }) {
            const data = this._parseLoop(Cast.toString(LOOP))
            if (!data) return
            this._startLoopInternal(data)
        }

        startLoopAndWait({
            LOOP
        }) {
            const data = this._parseLoop(Cast.toString(LOOP))
            if (!data) return
            this._startLoopInternal(data)
            const totalBeats = data.bars * data.beatsPerBar
            const totalSeconds = (totalBeats * 60) / (data.bpm || 120)

            return new Promise(resolve => {
                const poll = () => {
                    this._updateLoopTime()
                    if (this._getLoopElapsedSeconds() >= totalSeconds) return resolve()
                    requestAnimationFrame(poll)
                }
                requestAnimationFrame(poll)
            })
        }

        _startLoopInternal(data) {
            const ctx = this._getAudioCtx()
            this.currentLoop = data

            for (const c of JSON.parse(this.getAllPlacedCharacterIDs())) {
            charData = this.findCharacterWithoutPageInput(c)
            charData.singing = true;
            }

            this.currentBeat = -1
            this.currentBar = -1
            this.lastLoopProgress = 0
            this._loopRunning = true
            this.halfwayDone = false;
            this._loopPausedElapsed = 0
            this._loopStartAudioTime = ctx.currentTime
            this._totalBeats = 0
            this._beatPosition = 0
            this.resetTimer()
            this._triggerLoopEvent('whenLoopStarts', data)
        }

        stopLoops() {
            this._stopAllLoops()
        }

        _stopAllLoops() {

            if (this._loopRunning) {
                this._loopPausedElapsed = this._getLoopElapsedSeconds()
            }
            this._loopRunning = false
            this._timerRunning = false
            this._timerPaused = 0
            this.internalTimer = 0
            this.currentLoop = null
            this.currentBeat = -1
            this.currentBar = -1
            this.halfwayDone = false;
            this.lastLoopProgress = 0
            this._totalBeats = 0
            this._beatPosition = 0
        }

        loopsPlaying()
        {
        return Boolean(!(!this._loopRunning || !this.currentLoop))
        }

        getCurrentLoop()
        {
        return toObj(this.currentLoop || {});
        }

        getCurrentBeat() {
            this._updateLoopTime()
            return Math.max(0, Math.floor(this._totalBeats % (this.currentLoop?.beatsPerBar || 4)))
        }

        getCurrentBar() {
            this._updateLoopTime()
            return Math.max(0, Math.floor(this._totalBeats / (this.currentLoop?.beatsPerBar || 4)))
        }

        getLoopProgress() {
            this._updateLoopTime()
            return parseFloat(this.lastLoopProgress.toFixed(2))
        }

        getTimeUntilNextBeat() {
            if (!this._loopRunning || !this.currentLoop) return 0
            this._updateLoopTime()
            const secondsPerBeat = 60 / (this.currentLoop.bpm || 120)
            const timeSinceBeat = this._beatPosition * secondsPerBeat
            return parseFloat((secondsPerBeat - timeSinceBeat).toFixed(4))
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

        whenBeat() {
            return true
        }
        whenNewBar() {
            return true
        }

        resetTimer() {
            const ctx = this._getAudioCtx()
            this._timerOrigin = ctx.currentTime
            this._timerPaused = 0
            this.internalTimer = 0
            this._timerRunning = true
        }

        getTimer() {
            return parseFloat(this.internalTimer.toFixed(3))
        }

        whenLoopStarts() {
            return true
        }
        whenLoopHalfwayDone() {
            return true
        }
        whenLoopFinishes() {
            return true
        }
        whenCharacterPlaced() {
            return true
        }
        whenCharacterRemoved() {
            return true
        }
        whenCharacterReplaced() {
            return true
        }

        eventLoop({}, util) {
            const data = util.thread[EventKey]
            if (!data) return getDogeiscutObject().Type.blank
            return toObj({data})
        }

        eventCharacter({}, util) {
            const data = util.thread[EventKey]
            if (!data) return getDogeiscutObject().Type.blank

            const {
                customProps,
                previousMuteState,
                ...rest
            } = data
            return toObj({
                ...rest,
                ...customProps
            })
        }

        _triggerLoopEvent(opcode, loopData) {
            const threads = runtime.startHats('incrediengine2point0_' + opcode)
            for (const thread of threads) thread[EventKey] = loopData
        }

        _triggerCharacterEvent(opcode, charData) {
            const threads = runtime.startHats('incrediengine2point0_' + opcode)
            for (const thread of threads) thread[EventKey] = charData
        }

        resetAll() {
            this._stopAllLoops()
            this.characters.clear()
            this.slots.clear()
            this.loops.clear()
            this.categories.clear()
            this.categories.add('beats')
            this.categories.add('effects')
            this.categories.add('melodies')
            this.categories.add('voices')
            this.categories.add('bonuses')
            this.soloedCharacter = null
        }

        assignSpriteWithCharacterID({
            MENU,
            SPRITE,
            ID
        }) {
        
        const char = this.findCharacterWithoutPageInput(Cast.toString(ID))
        if (!char) return;

        SPRITE = Cast.toString(SPRITE);

        MENU = Cast.toString(MENU);

        if (SPRITE === "no sprites found") return;
        
        if (MENU === 'assign')
        {
        if (!this.findAssignedIDForSprite(SPRITE)) char.assignedSprite = SPRITE;
        }
        else
        {
        delete char.assignedSprite;
        }
        }

        getAssiginedIDFromThisSprite(args, util)
        {
        let spriteName = util.target.getName();

        return this.findAssignedIDForSprite(spriteName);
        }

        getAssiginedIDFromSprite({
        SPRITE
        }){
            
        SPRITE = Cast.toString(SPRITE);
        if (SPRITE === "no sprites found") return;

        return this.findAssignedIDForSprite(SPRITE);
        }

        getInternalMap({
        MENU
        }){
        MENU =  (Cast.toString(MENU))
        switch(MENU)
        {
        case 'characters':
        return toObj(this.characters);

        case 'slots':
        return toObj(this.slots);

        case 'loops':
        return toObj(this.loops);

        default:
        return '';
        }
        }

}Scratch.extensions.register(new IncrediEngine2point0())
})(Scratch)
