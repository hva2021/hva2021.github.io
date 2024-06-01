! function(f) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = f();
    else if ("function" == typeof define && define.amd) define([], f);
    else {
        var g;
        g = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, g.p3lib = f()
    }
}(function() {
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = "function" == typeof require && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
        return s
    }({
        1: [function(require, module, exports) {
            var MovieClip = require("./display/MovieClip"),
                ParticleSystem = require("./display/particles/ParticleSystem"),
                Timer = require("./utils/Timer"),
                Animator = function() {
                    this._particleSystems = null, this._emitters = null, this._movieClips = null, this._timers = null, this._tweens = null, this._paused = !1, this.init()
                };
            module.exports = Animator, Animator.prototype.init = function() {
                this._movieClips = [], this._particleSystems = [], this._emitters = [], this._tweens = [], this._timers = [], this._paused = !1
            }, Animator.prototype.update = function() {
                this._paused || (this._updateEmitters(), this._updateParticleSystems(), this._updateTimers())
            }, Animator.prototype.add = function(a) {
                if (a instanceof ParticleSystem) {
                    if (-1 != this._particleSystems.indexOf(a)) throw new Error("'ParticleSystem' already added!");
                    this._particleSystems.push(a)
                } else if (a instanceof cloudkid.Emitter) {
                    if (-1 != this._emitters.indexOf(a)) throw new Error("'Emitter' already added!");
                    this._emitters.push(a)
                } else if (a instanceof MovieClip) {
                    if (-1 != this._movieClips.indexOf(a)) throw new Error("'MovieClip' already added!");
                    this._movieClips.push(a)
                } else if (a instanceof TweenMax || a instanceof TimelineMax) {
                    if (-1 != this._tweens.indexOf(a)) throw new Error("'Tween' already added!");
                    this._tweens.push(a)
                } else if (a instanceof Timer) {
                    if (-1 != this._timers.indexOf(a)) throw new Error("'Timer' already added!");
                    this._timers.push(a)
                }
                return a
            }, Animator.prototype.remove = function(a) {
                var index;
                if (a instanceof ParticleSystem) {
                    if (index = this._particleSystems.indexOf(a), -1 == index) throw new Error("'ParticleSystem' is not added!");
                    a.__updateTransform && (a.updateTransform = a.__updateTransform, a.__updateTransform = null), this._particleSystems.splice(index, 1)
                } else if (a instanceof cloudkid.Emitter) {
                    if (index = this._emitters.indexOf(a), -1 == index) throw new Error("'Emitter' is not added!");
                    this._emitters.splice(index, 1)
                } else if (a instanceof MovieClip) {
                    if (index = this._movieClips.indexOf(a), -1 == index) throw new Error("'MovieClip' is not added!");
                    a.__updateTransform && (a.updateTransform = a.__updateTransform, a.__updateTransform = null), this._movieClips.splice(index, 1)
                } else if ((a instanceof TweenMax || a instanceof TimelineMax) && -1 != this._tweens.indexOf(a)) {
                    if (index = this._tweens.indexOf(a), -1 == index) throw new Error("'Tween' is not added!");
                    this._tweens.splice(index, 1)
                } else if (a instanceof Timer && -1 != this._timers.indexOf(a)) {
                    if (index = this._timers.indexOf(a), -1 == index) throw new Error("'Timer' is not added!");
                    this._timers.splice(index, 1)
                }
            }, Animator.prototype.removeAll = function(emitters, movieClips, tweens, timers) {
                emitters = "boolean" == typeof emitters ? emitters : !0, movieClips = "boolean" == typeof movieClips ? movieClips : !0, tweens = "boolean" == typeof tweens ? tweens : !0, timers = "boolean" == typeof timers ? timers : !0, emitters && (this._particleSystems.length = this._emitters.length = 0), movieClips && (this._movieClips.length = 0), tweens && this.removeAllTweens(!0), timers && (this._timers.length = 0)
            }, Animator.prototype.removeAllTweens = function(kill) {
                for (var t, i = 0; i < this._tweens.length; ++i) t = this._tweens[i], kill && t.kill();
                this._tweens.length = 0
            }, Animator.prototype.setTimeout = function(callback, delay, scope) {
                scope = scope || window;
                var timer = new p3.Timer(delay, 1);
                return timer.signals.timerComplete.addOnce(function() {
                    callback.call(scope), this.remove(timer)
                }, this), timer.start(), this.add(timer), timer
            }, Animator.prototype._playMovieClips = function() {
                for (var mc, count = this._movieClips.length, i = 0; count > i; ++i) mc = this._movieClips[i], mc.__updateTransform && (mc.updateTransform = mc.__updateTransform, mc.__updateTransform = null)
            }, Animator.prototype._pauseMoveClips = function() {
                for (var mc, count = this._movieClips.length, i = 0; count > i; ++i) mc = this._movieClips[i], mc.__updateTransform || (mc.__updateTransform = mc.updateTransform, mc.updateTransform = function() {
                    p3.MovieClip.superClass_.updateTransform.call(this)
                })
            }, Animator.prototype._playTweens = function() {
                for (var tween, count = this._tweens.length, i = 0; count > i; ++i) tween = this._tweens[i], tween.resume()
            }, Animator.prototype._pauseTweens = function() {
                for (var tween, count = this._tweens.length, i = 0; count > i; ++i) tween = this._tweens[i], tween.pause()
            }, Animator.prototype._updateParticleSystems = function() {
                for (var emitter, count = this._particleSystems.length, i = count - 1; i >= 0; --i) emitter = this._particleSystems[i], emitter.update()
            }, Animator.prototype._updateEmitters = function() {
                for (var emitter, count = this._emitters.length, i = count - 1; i >= 0; --i) emitter = this._emitters[i], emitter.update(p3.Timestep.deltaTime)
            }, Animator.prototype._updateTimers = function() {
                for (var timer, count = this._timers.length, i = count - 1; i >= 0; --i) timer = this._timers[i], timer.update()
            }, Object.defineProperty(Animator.prototype, "paused", {
                get: function() {
                    return this._paused
                },
                set: function(value) {
                    this._paused = value, this._paused ? (this._pauseMoveClips(), this._pauseTweens()) : (this._playMovieClips(), this._playTweens())
                }
            })
        }, {
            "./display/MovieClip": 12,
            "./display/particles/ParticleSystem": 17,
            "./utils/Timer": 57
        }],
        2: [function(require, module, exports) {
            var FontAtlas = require("./text/FontAtlas"),
                AssetManager = (require("./utils/Utils"), function() {
                    if (!AssetManager.__allowInstance) throw new Error("AssetManager is a Singleton, use 'instance'.");
                    this.signalCompleted = new signals.Signal, this.signalProgress = new signals.Signal, this.progress = 0, this.resources = {}, this.fontAtlases = {}, this._pixiAssetLoader = null, this._manifest = [], this._scaleFactor = 1, this._completeDelay = 0
                });
            AssetManager.prototype.constructor = AssetManager, module.exports = AssetManager, AssetManager.instance = null, Object.defineProperty(AssetManager, "instance", {
                get: function() {
                    return AssetManager.__instance || (AssetManager.__allowInstance = !0, AssetManager.__instance = new AssetManager, AssetManager.__allowInstance = !1), AssetManager.__instance
                }
            }), AssetManager.__instance = null, AssetManager.__allowInstance = !1, AssetManager.VERSION = "02.00.00", AssetManager.DEBUG = !1, AssetManager.EVENT_ON_COMPLETE = "onComplete", AssetManager.EVENT_ON_PROGRESS = "onProgress", AssetManager.FILETYPE_PNG = ".png", AssetManager.FILETYPE_JPG = ".jpg", AssetManager._IMAGE = "_image", AssetManager.prototype.addFiles = function(array, path) {
                if (path = path || "", null != path && path.length > 0)
                    for (var len = array.length, i = 0; len > i; i++) {
                        var url = array[i].url;
                        array[i].url = path + url
                    }
                return this._manifest = this._manifest.concat(array), this._manifest
            }, AssetManager.prototype.load = function(completeDelay) {
                if (this._completeDelay = completeDelay || 0, !this._manifest || 0 === this._manifest.length) throw Error('[AssetManager.load] - The manifest is either null or it is empty. Make sure you have added files via "addFiles()" before calling "load()".');
                return this.progress = 0, this._pixiAssetLoader || (this._pixiAssetLoader = new PIXI.loaders.Loader, this._pixiAssetLoader.on("progress", this._onProgress, this), this._pixiAssetLoader.on("complete", this._onComplete, this), this._pixiAssetLoader.on("error", this._onError, this)), this._pixiAssetLoader.add(this._manifest), this._pixiAssetLoader.load(), this._manifest
            }, AssetManager.prototype.getTexture = function(fileName, opt_extension) {
                opt_extension = opt_extension || AssetManager.FILETYPE_PNG;
                try {
                    var texture = PIXI.Texture.fromFrame(fileName + opt_extension)
                } catch (e) {
                    if (!this.resources[fileName]) throw Error('[AssetManager.getTexture] - Texture does not exist: "' + fileName + '". Are you tring to get a texture from an Atlas? If so use "getSprite()".');
                    texture = this.resources[fileName].texture
                }
                return texture
            }, AssetManager.prototype.getSprite = function(fileName, centered, opt_extension) {
                var texture = this.getTexture(fileName, opt_extension),
                    sprite = new PIXI.Sprite(texture);
                return centered && (sprite.anchor.x = .5, sprite.anchor.y = .5), sprite
            }, AssetManager.prototype.getJSON = function(fileName, clone) {
                var jsonData = clone ? p3.Utils.cloneObject(this.resources[fileName].data) : this.resources[fileName].data;
                if (!jsonData) throw Error('[AssetManager.getJSON] - Json does not exist: "' + fileName + '".');
                return jsonData
            }, AssetManager.prototype.getFontAtlas = function(fileName) {
                var atlas = this.fontAtlases[fileName];
                if (!atlas) throw new Error('[AssetManager.getJSON] - FontAtlas does not exist: "' + fileName + '".');
                return atlas
            }, AssetManager.prototype.getSpineData = function(fileName) {
                var file = this.resources[fileName];
                if (!file || file && !file.spineData) throw new Error('[AssetManager.getJSON] - SpineData does not exist: "' + fileName + '".');
                return file.spineData
            }, AssetManager.prototype.reset = function() {
                this.progress = 0, this._manifest = [], null != this._pixiAssetLoader && this._pixiAssetLoader.reset()
            }, AssetManager.prototype._checkForFontAtlas = function(resource) {
                if (resource.data && resource.data.font) {
                    var fontData = resource.data.font,
                        fileName = fontData.pages.page.file,
                        fileNameWithoutExtension = fileName.match(/([^\/]+)(?=\.\w+$)/gim),
                        path = resource.url;
                    path = path.substring(0, path.lastIndexOf("/"));
                    var url = path + "/" + fileName;
                    this._pixiAssetLoader.add({
                        name: fileNameWithoutExtension + AssetManager._IMAGE,
                        url: url
                    })
                }
            }, AssetManager.prototype._buildFontAtlases = function() {
                for (var key in this.resources)
                    if (this.resources.hasOwnProperty(key)) {
                        var resource = this.resources[key];
                        if (resource.data.font) {
                            var url = resource.url,
                                fileNameWithoutExtension = url.match(/([^\/]+)(?=\.\w+$)/gim),
                                texture = this.getTexture(fileNameWithoutExtension + AssetManager._IMAGE);
                            this.fontAtlases[key] = new FontAtlas(key, resource.data, texture)
                        }
                    }
            }, AssetManager.prototype._onProgress = function(loader, resource) {
                this.progress = loader.progress, this._checkForFontAtlas(resource), this.signalProgress.dispatch(loader, this.progress)
            }, AssetManager.prototype._onComplete = function(loader, resources) {
                for (var key in resources) this.resources[key] || (this.resources[key] = resources[key]);
                this._buildFontAtlases();
                var that = this;
                setTimeout(function() {
                    that.reset(), that.signalCompleted.dispatch()
                }, 1e3 * this._completeDelay)
            }, AssetManager.prototype._onError = function(loader, resource) {
                console.log("[AssetManager] There was an error", loader, resource)
            }, Object.defineProperty(AssetManager.prototype, "scaleFactor", {
                get: function() {
                    return this._scaleFactor
                },
                set: function(value) {
                    this._scaleFactor = value
                }
            }), Object.defineProperty(AssetManager.prototype, "scaleFactorInverse", {
                get: function() {
                    return 1 / this._scaleFactor
                }
            }), Object.defineProperty(AssetManager.prototype, "pixiLoader", {
                get: function() {
                    return this._pixiAssetLoader
                }
            }), Object.defineProperty(AssetManager.prototype, "manifest", {
                get: function() {
                    return this._manifest
                }
            })
        }, {
            "./text/FontAtlas": 48,
            "./utils/Utils": 58
        }],
        3: [function(require, module, exports) {
            var Device = (require("./CanvasParams"), require("./utils/Device")),
                Canvas = function(canvasParams) {
                    this.params = canvasParams, this.signalReady = new signals.Signal, this.signalChange = new signals.Signal, this.window = window = window.self, this.imageOverlay = null, this.backgroundImage = null, this.width = 0, this.height = 0, this.orientation = "", this.holderElement = null, this.iosfixElement = null, this.canvasElement = null, this.autoResize = !0, this.isAndroidStockBrowser = Device.isAndroidStockBrowser, this._isReadyDone = !1, this._targetOrientation = "", Canvas.params = this.params, Canvas.center = new PIXI.Point(0, 0), this.params.width > this.params.height ? this._targetOrientation = Canvas.LANDSCAPE : this._targetOrientation = Canvas.PORTRAIT, this.params.forceLetterbox || Device.isAndroidStockBrowser && Canvas.params.stockAndroidLetterbox, this.window.onload = this.onLoad.bind(this)
                };
            module.exports = Canvas, Canvas.LANDSCAPE = "landscape", Canvas.PORTRAIT = "portrait", Canvas.DEFAULT_HOLDER_ID = "p3gameholder", Canvas.DEFAULT_CANVAS_ID = "p3gamecanvas", Canvas.DEFAULT_IMAGE_OVERLAY_ID = "p3imageoverlay", Canvas.DEFAULT_BACKGROUND_IMAGE_ID = "p3backgroundimage", Canvas.canvasElement = null, Canvas.holderElement = null, Canvas.iosfixElement = null, Canvas.width = 0, Canvas.height = 0, Canvas.center = null, Canvas.stage = null, Canvas.renderer = null, Canvas.params = null, Canvas.prototype.init = function(disableAutoresize) {
                if (this._initHolder(), this._initCanvas(), this._initImageOverlay(), Device.isCocoonJS || this._disableUnwantedInteractions(), this.signalReady.dispatch(), Device.isCocoonJS) this.width = this.params.width * (window.innerWidth / this.params.width) / (window.innerHeight / this.params.height), this.height = this.params.height, this.updateSize(this.width, this.height), this.signalReady.dispatch();
                else if (disableAutoresize) this.holderElement.style.width = this.params.width + "px", this.holderElement.style.height = this.params.height + "px", Canvas.width = this.width = this.params.width, Canvas.height = this.height = this.params.height, this.signalReady.dispatch(), this.signalChange.dispatch(!0);
                else {
                    this.window.addEventListener("resize", this._onResizeEvent.bind(this), !1);
                    var correctOrientation = this._checkOrientation();
                    this._toggleRotateImage(!correctOrientation), correctOrientation && this._checkOrientationAndThenResize()
                }
            }, Canvas.prototype.updateSize = function(width, height) {
                Canvas.width = this.width = Math.floor(width), Canvas.height = this.height = Math.floor(height), Canvas.center.x = Math.floor(.5 * Canvas.width), Canvas.center.y = Math.floor(.5 * Canvas.height)
            }, Canvas.prototype._initHolder = function() {
                Device.isCocoonJS || (this.params.holderID ? this.holderElement = document.getElementById(this.params.holderID) : (document.getElementById(Canvas.DEFAULT_HOLDER_ID) && console.warn("[p3.Canvas] You have not set a 'HolderId' and there is already one on the page with the DEFAULT_ID, attempting to use it. " + Canvas.DEFAULT_HOLDER_ID), this.holderElement = document.createElement("div"), this.holderElement.id = Canvas.DEFAULT_HOLDER_ID, document.body.appendChild(this.holderElement)), this.holderElement.style.left = 0, this.holderElement.style.top = 0, this.holderElement.style.position = "absolute", this.holderElement.style.width = this.window.innerWidth + "px", this.holderElement.style.height = this.window.innerHeight + "px", Canvas.holderElement = this.holderElement, p3.Device.isIOS && (this.iosfixElement = document.createElement("iosfix"), this.iosfixElement.id = "iosfix", this.iosfixElement.style.position = "absolute", this.iosfixElement.style.width = "100%", this.iosfixElement.style.height = this.holderElement.height + 1, this.iosfixElement.style.left = 0, this.iosfixElement.style.right = 0, this.iosfixElement.style.top = 0, this.iosfixElement.style.bottom = 0, this.iosfixElement.style.visibility = "hidden", document.body.appendChild(this.iosfixElement), Canvas.iosfixElement = this.iosfixElement))
            }, Canvas.prototype._initCanvas = function() {
                Device.isCocoonJS ? (this.canvasElement = document.createElement("screencanvas"), this.canvasElement.id = Canvas.DEFAULT_CANVAS_ID, this.canvasElement.width = this.params.width, this.canvasElement.height = this.params.height, this.canvasElement.style.cssText = "idtkscale:ScaleAspectFill;", document.body.appendChild(this.canvasElement)) : (this.params.canvasID ? this.canvasElement = document.getElementById(this.params.canvasID) : (document.getElementById(Canvas.DEFAULT_HOLDER_ID) && console.warn("[p3.Canvas] You have not set a 'CanvasID' and there is already a canvas with on the page with the DEFAULT_ID, attempting to use it. " + Canvas.DEFAULT_CANVAS_ID), this.canvasElement = document.createElement("canvas"), this.canvasElement.id = Canvas.DEFAULT_CANVAS_ID), this.canvasElement.style.left = 0, this.canvasElement.style.right = 0, this.canvasElement.style.top = 0, this.canvasElement.style.bottom = 0, this.canvasElement.style.position = "absolute", this.canvasElement.style.width = "100%", this.canvasElement.style.height = "100%", (this.params.forceLetterbox || Device.isAndroidStockBrowser && Canvas.params.stockAndroidLetterbox) && (this.canvasElement.style.margin = "auto", this.canvasElement.style.width = "auto"), this.canvasElement.style.overflow = "visible", this.canvasElement.style.display = "block", this.holderElement.appendChild(this.canvasElement), this.window.focus(), this.canvasElement.tabIndex = 1), Canvas.canvasElement = this.canvasElement
            }, Canvas.prototype._initImageOverlay = function() {
                if (!Device.isCocoonJS) {
                    if (document.getElementById(Canvas.DEFAULT_IMAGE_OVERLAY_ID)) throw Error("[Canvas] There is already a div with that id on the page, are you using it? : " + Canvas.DEFAULT_IMAGE_OVERLAY_ID);
                    this.imageOverlay = document.createElement("div"), this.imageOverlay.id = Canvas.DEFAULT_IMAGE_OVERLAY_ID, this.imageOverlay.style.left = "0", this.imageOverlay.style.top = "0", this.imageOverlay.style.width = "auto", this.imageOverlay.style.height = "100%", this.imageOverlay.style.marginLeft = "auto", this.imageOverlay.style.marginRight = "auto", this.imageOverlay.style.overflow = "visible", this.imageOverlay.style.display = "none", this.imageOverlay.style.backgroundColor = this.params.rotateImageBackgroundColor, this.imageOverlay.style.backgroundImage = "url(" + this.params.rotateImageSrc + ")", this.imageOverlay.style.backgroundPosition = "50% 50%", this.imageOverlay.style.backgroundRepeat = "no-repeat", this.imageOverlay.style.backgroundSize = "contain", this.holderElement.appendChild(this.imageOverlay)
                }
            }, Canvas.prototype._initBackgroundImage = function() {
                if (!Device.isCocoonJS) {
                    if (document.getElementById(Canvas.DEFAULT_BACKGROUND_IMAGE_ID)) throw Error("[Canvas] There is already a div with that id on the page, are you using it? : " + Canvas.DEFAULT_BACKGROUND_IMAGE_ID);
                    this.backgroundImage = document.createElement("div"), this.backgroundImage.id = Canvas.DEFAULT_BACKGROUND_IMAGE_ID, this.backgroundImage.style.left = "0", this.backgroundImage.style.top = "0", this.backgroundImage.style.height = "100%", this.backgroundImage.style.width = "auto", this.backgroundImage.style.overflow = "visible", this.backgroundImage.style.display = "block", this.backgroundImage.style.backgroundImage = "url(" + this.params.backgroundImageSrc + ")", this.backgroundImage.style.backgroundPosition = "50% 50%", this.backgroundImage.style.backgroundRepeat = "no-repeat", this.backgroundImage.style.backgroundSize = "auto 100%", this.holderElement.appendChild(this.backgroundImage)
                }
            }, Canvas.prototype._checkOrientation = function() {
                return this.window.innerWidth > this.window.innerHeight ? this.orientation = Canvas.LANDSCAPE : this.orientation = Canvas.PORTRAIT, Device.isMobile ? this.orientation === this._targetOrientation : !0
            }, Canvas.prototype._resize = function() {
                if (window.scrollTo(0, 0), this.params.forceLetterbox || Device.isAndroidStockBrowser && Canvas.params.stockAndroidLetterbox) Canvas.width = this.width = this.params.width, Canvas.height = this.height = this.params.height;
                else {
                    console.log(this.window.innerWidth), console.log(this.window.innerHeight);
                    var ratioW = this.window.innerWidth / this.params.width,
                        ratioHInverse = (this.params.width / this.window.innerWidth, this.window.innerHeight / this.params.height, this.params.height / this.window.innerHeight),
                        newWidth = this.params.width,
                        newHeight = this.params.height;
                    newWidth = Math.floor(this.params.width * ratioW * ratioHInverse), newHeight = this.params.height, Canvas.width = this.width = this.canvasElement.width = newWidth, Canvas.height = this.height = this.canvasElement.height = newHeight
                }
                this.updateSize(Canvas.width, Canvas.height)
            }, Canvas.prototype._toggleRotateImage = function(show) {
                show ? (this.imageOverlay.style.display = "block", this.canvasElement.style.display = "none") : (this.canvasElement.style.display = "block", this.imageOverlay.style.display = "none")
            }, Canvas.prototype._checkOrientationAndThenResize = function() {
                Device.isIframe ? (this.holderElement.style.width = "100%", this.holderElement.style.height = "100%") : (this.holderElement.style.width = this.window.innerWidth + "px", this.holderElement.style.height = this.window.innerHeight + "px"), p3.Device.isIOS && (this.iosfixElement.style.height = parseInt(this.holderElement.style.height) + 1 + "px");
                var isCorrectOrientation = this._checkOrientation();
                this._toggleRotateImage(!isCorrectOrientation), isCorrectOrientation && (this._resize(), this._isReadyDone || (this._isReadyDone = !0, this.signalReady.dispatch())), this._isReadyDone && this.signalChange.dispatch(isCorrectOrientation)
            }, Canvas.prototype._disableUnwantedInteractions = function() {
                Canvas.canvasElement.addEventListener("touchmove", function(event) {
                    return event.preventDefault(), !1
                }), Canvas.canvasElement.addEventListener("touchstart", function(event) {
                    return event.preventDefault(), !1
                }), Canvas.canvasElement.addEventListener("touchend", function(event) {
                    return event.preventDefault(), !1
                }), Device.isAndroidStockBrowser && (Canvas.canvasElement.addEventListener("mousedown", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1), Canvas.canvasElement.addEventListener("mouseup", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1), Canvas.canvasElement.addEventListener("click", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1))
            }, Canvas.prototype.onLoad = function() {
                var that = this;
                setTimeout(function() {
                    that.init()
                }, 0)
            }, Canvas.prototype._onResizeEvent = function(event) {
                this._checkOrientationAndThenResize()
            }
        }, {
            "./CanvasParams": 4,
            "./utils/Device": 54
        }],
        4: [function(require, module, exports) {
            function CanvasParams() {
                this.width = 0, this.height = 0, this.holderID = "", this.canvasID = "", this.rotateImageSrc = "", this.rotateImageBackgroundColor = "#FFFFFF", this.backgroundImageSrc = "", this.forceCanvasMode = !1, this.forceLetterbox = !1, this.stockAndroidCanvasMode = !0, this.stockAndroidLetterbox = !1
            }
            module.exports = CanvasParams
        }, {}],
        5: [function(require, module, exports) {
            var Timestep = function(type) {
                this.maxElapsedMS = 100, this._type = type || Timestep.VARIABLE, this._lastTime = Timestep.timeInSeconds, this._accumulator = 0
            };
            module.exports = Timestep, Timestep.VERSION = "2.0.0", Timestep.VARIABLE = "variable", Timestep.SEMI_FIXED = "semi_fixed", Timestep.FIXED = "fixed", Timestep.deltaTime = 1, Timestep.speed = 1, Timestep.queue = [], Timestep.queueCall = function(func, args, scope) {
                Timestep.queue.push({
                    func: func,
                    args: args,
                    scope: scope
                })
            }, Timestep.executeCalls = function() {
                for (var sync, i = 0; i < Timestep.queue.length; ++i) sync = Timestep.queue[i], sync.func.apply(sync.scope, sync.args);
                Timestep.queue.length = 0
            }, Timestep.prototype.init = function(update, render, scope) {
                function variable() {
                    var time = window.performance.now(),
                        elapsedMS = Math.min(that.maxElapsedMS, time - that._lastTime);
                    Timestep.deltaTime = .001 * elapsedMS * Timestep.speed, that._lastTime = time, Timestep.executeCalls(), update.call(scope), render.call(scope), requestAnimationFrame(frame)
                }

                function semi() {
                    var time = .001 * window.performance.now(),
                        elapsedMS = time - that._lastTime;
                    for (that._lastTime = time, Timestep.executeCalls(), that._accumulator += elapsedMS; that._accumulator >= Timestep.deltaTime;) update.call(scope), that._accumulator -= Timestep.deltaTime;
                    render.call(scope), requestAnimationFrame(frame)
                }

                function fixed() {
                    Timestep.executeCalls(), update.call(scope), render.call(scope), requestAnimationFrame(frame)
                }
                var frame, that = this;
                switch (this._type) {
                    case Timestep.VARIABLE:
                        frame = variable, this._lastTime = 0;
                        break;
                    case Timestep.SEMI_FIXED:
                        frame = semi, this._lastTime = 0, this._accumulator = 0, Timestep.deltaTime = 1 / 60;
                        break;
                    case Timestep.FIXED:
                        frame = fixed, Timestep.deltaTime = 1 / 60
                }
                requestAnimationFrame(frame), window.onfocus = function() {
                    that._lastTime = Timestep.timeInSeconds
                }
            }, Object.defineProperty(Timestep, "frameInterval", {
                get: function() {
                    return this._frameInterval
                }
            }), Object.defineProperty(Timestep, "time", {
                get: function() {
                    return window.performance.now()
                }
            }), Object.defineProperty(Timestep, "timeInSeconds", {
                get: function() {
                    return Timestep.time / 1e3
                }
            })
        }, {}],
        6: [function(require, module, exports) {
            var Device = require("./utils/Device"),
                View = (require("./ViewParams"), function(params) {
                    this.params = params, this.signals = {}, this.signals.ready = new signals.Signal, this.signals.resize = new signals.Signal, this._holder = null, this._canvas = null, this._iosfix = null, this._rotateImage = null, this._width = this.params.width, this._height = this.params.height, this._targetOrientation = this.orientation, window.self.onload = this.onLoad.bind(this)
                });
            module.exports = View, View.holder = null, View.canvas = null, View.width = 0, View.height = 0, View.center = new PIXI.Point, View.prototype.onLoad = function() {
                function init() {
                    this.createHolder(), this.createCanvas(), this.createRotateImage(), this.disableInteractions(), Device.isCocoonJS ? (this.updateDimensions(this.params.width * (window.innerWidth / this.params.width) / (window.innerHeight / this.params.height), this.params.height), this.signals.ready.dispatch(this._canvas)) : (Device.isAndroid ? window.self.addEventListener("orientationchange", this.onOrientationChange.bind(this), !1) : window.self.addEventListener("resize", this.onResize.bind(this), !1), this.signals.ready.dispatch(this._canvas), this.resize())
                }
                var that = this;
                setTimeout(function() {
                    init.call(that)
                }, 0)
            }, View.prototype.onResize = function() {
                this.resize()
            }, View.prototype.onOrientationChange = function() {
                function listener() {
                    window.self.removeEventListener("resize", listener, !1), that.resize()
                }
                window.self.addEventListener("resize", listener, !1);
                var that = this
            }, View.prototype.createHolder = function() {
                Device.isCocoonJS || (this._holder = document.getElementById(this.params.holderId), this._holder || (this._holder = document.createElement("div"), this._holder.id = this.params.holderId ? this.params.holderId : "game", document.body.appendChild(this._holder)), this._holder.style.position = "absolute", this._holder.style.left = "0px", this._holder.style.top = "0px", this._holder.style.width = window.self.innerWidth + "px", this._holder.style.height = window.self.innerHeight + "px", View.holder = this._holder, p3.Device.isIOS && (this._iosfix = document.createElement("div"), this._iosfix.id = "iosfix", this._iosfix.style.position = "absolute", this._iosfix.style.left = "0px", this._iosfix.style.right = "0px", this._iosfix.style.top = "0px", this._iosfix.style.bottom = "0px", this._iosfix.style.width = "100%", this._iosfix.style.height = this._holder.height + 1, this._iosfix.style.visibility = "hidden", document.body.appendChild(this._iosfix), View.iosfix = this._iosfix))
            }, View.prototype.createCanvas = function() {
                Device.isCocoonJS ? (this._canvas = document.createElement("screencanvas"), this._canvas.id = "canvas", this._canvas.width = this.params.width, this._canvas.height = this.params.height, this._canvas.style.cssText = "idtkscale:ScaleAspectFill;", document.body.appendChild(this._canvas)) : (this._canvas = document.createElement("canvas"), this._canvas.id = "canvas", this._canvas.tabIndex = 1, this._canvas.style.position = "absolute", this._canvas.style.left = "0px", this._canvas.style.right = "0px", this._canvas.style.top = "0px", this._canvas.style.bottom = "0px", this._canvas.style.width = "100%", this._canvas.style.height = "100%", this._canvas.style.overflow = "visible", this._canvas.style.display = "block", this._holder.appendChild(this._canvas)), View.canvas = this._canvas
            }, View.prototype.createRotateImage = function() {
                Device.isCocoonJS || (this._rotateImage = document.createElement("div"), this._rotateImage.id = "rotateImage", this._rotateImage.style.position = "absolute", this._rotateImage.style.left = "0px", this._rotateImage.style.top = "0px", this._rotateImage.style.width = "100%", this._rotateImage.style.height = "100%", this._rotateImage.style.marginLeft = "auto", this._rotateImage.style.marginRight = "0auto", this._rotateImage.style.overflow = "visible", this._rotateImage.style.display = "none", this._rotateImage.style.zIndex = 1e3, this._rotateImage.style.backgroundImage = "url(" + this.params.rotateImageUrl + ")", this._rotateImage.style.backgroundColor = this.params.rotateImageColor, this._rotateImage.style.backgroundPosition = "50% 50%", this._rotateImage.style.backgroundRepeat = "no-repeat", this._rotateImage.style.backgroundSize = "contain", this._holder.appendChild(this._rotateImage), this._rotateImage.addEventListener("touchmove", function(event) {
                    return event.preventDefault(), !1
                }), this._rotateImage.addEventListener("touchstart", function(event) {
                    return event.preventDefault(), !1
                }), this._rotateImage.addEventListener("touchend", function(event) {
                    return event.preventDefault(), !1
                }))
            }, View.prototype.updateDimensions = function(width, height) {
                View.width = this._width = Math.round(width), View.height = this._height = Math.round(height), View.center.x = Math.round(.5 * width), View.center.y = Math.round(.5 * height)
            }, View.prototype.resize = function() {
                var width = Device.isMobile ? document.documentElement.clientWidth : window.innerWidth,
                    height = Device.isMobile ? document.documentElement.clientHeight : window.innerHeight;
                Device.isIframe ? (this._holder.style.width = "100%", this._holder.style.height = "100%") : (this._holder.style.width = width + "px", this._holder.style.height = height + "px"), p3.Device.isIOS && (this._iosfix.style.height = parseInt(this._holder.style.height) + 1 + "px"), window.scrollTo(0, 0);
                var ratiow, ratioh;
                this.params.aspectRatioFillHeight ? (ratiow = width / this.params.width, ratioh = this.params.height / height, this.updateDimensions(Math.floor(this.params.width * ratiow * ratioh), this.params.height)) : (ratiow = this.params.width / width, ratioh = height / this.params.height, this.updateDimensions(this.params.width, Math.floor(this.params.height * ratioh * ratiow))), this.toggleRotate(!this.isCorrectOrientation()), this.signals.resize.dispatch(this.isCorrectOrientation())
            }, View.prototype.toggleRotate = function(value) {
                this._canvas.style.display = value ? "none" : "block", this._rotateImage.style.display = value ? "block" : "none"
            }, View.prototype.isCorrectOrientation = function() {
                return Device.isMobile ? this.orientation === this._targetOrientation : !0
            }, View.prototype.disableInteractions = function() {
                View.canvas.addEventListener("touchmove", function(event) {
                    return event.preventDefault(), !1
                }), View.canvas.addEventListener("touchstart", function(event) {
                    return event.preventDefault(), !1
                }), View.canvas.addEventListener("touchend", function(event) {
                    return event.preventDefault(), !1
                }), Device.isAndroidStockBrowser && (View.canvas.addEventListener("mousedown", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1), View.canvas.addEventListener("mouseup", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1), View.canvas.addEventListener("click", function(event) {
                    event.stopPropagation(), event.preventDefault(), event.stopImmediatePropagation()
                }, !1))
            }, Object.defineProperty(View.prototype, "holder", {
                get: function() {
                    return this._holder
                }
            }), Object.defineProperty(View.prototype, "orientation", {
                get: function() {
                    return this._width >= this._height ? "landscape" : "portrait"
                }
            })
        }, {
            "./ViewParams": 7,
            "./utils/Device": 54
        }],
        7: [function(require, module, exports) {
            function ViewParams() {
                this.width = 0, this.height = 0, this.holderId = "", this.rotateImageUrl = "", this.rotateImageColor = "#FFFFFF", this.aspectRatioFillHeight = !0
            }
            module.exports = ViewParams
        }, {}],
        8: [function(require, module, exports) {
            var Device = (require("./../utils/Utils"), require("./../utils/Device")),
                AudioManager = function() {
                    if (!AudioManager.__allowInstance) throw new Error("AudioManager is a Singleton, use 'getInstance()'.");
                    this.signalMute = new signals.Signal, this.SOUND_GROUP_SFX = "sound_group_sfx", this.SOUND_GROUP_MUSIC = "sound_group_music", this.SOUND_GROUP_VO = "sound_group_vo", this.LOCAL_STORAGE_ID = "p3Mute", this._sounds = {}, this._soundsSFX = [], this._soundsVO = [], this._soundsMusic = [], this._previouslyPlayedSound = null, this._isMute = !1, this._isMuteSFX = !1, this._isMuteMusic = !1, this._isMuteVO = !1;
                    var hidden;
                    "undefined" != typeof document.hidden ? (hidden = "hidden", this.visibilityChange = "visibilitychange") : "undefined" != typeof document.mozHidden ? (hidden = "mozHidden", this.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.msHidden ? (hidden = "msHidden", this.visibilityChange = "msvisibilitychange") : "undefined" != typeof document.webkitHidden && (hidden = "webkitHidden", this.visibilityChange = "webkitvisibilitychange"), document.addEventListener(this.visibilityChange, function() {
                        document[hidden] ? Howler.volume(0) : Howler.volume(1)
                    }, !1)
                };
            AudioManager.prototype.constructor = AudioManager, module.exports = AudioManager, AudioManager.instance = null, Object.defineProperty(AudioManager, "instance", {
                get: function() {
                    return AudioManager.__instance || (AudioManager.__allowInstance = !0, AudioManager.__instance = new AudioManager, AudioManager.__allowInstance = !1), AudioManager.__instance
                }
            }), AudioManager.__instance = null, AudioManager.__allowInstance = !1, AudioManager.DEBUG = !1, AudioManager.FADE_OUT_DURATION = .5, AudioManager.prototype.addSounds = function(soundArray, soundExtensions, basePath) {
                basePath = basePath || "";
                for (var i = 0; i < soundArray.length; i++) {
                    for (var url = basePath + soundArray[i], urlSplit = url.split("/"), name = urlSplit[urlSplit.length - 1], urlsWithExtensionArr = [], j = 0; j < soundExtensions.length; j++) {
                        var extension = soundExtensions[j],
                            urlWithExtension = url + extension;
                        urlsWithExtensionArr.push(urlWithExtension)
                    }
                    var howl = new Howl({
                        urls: urlsWithExtensionArr,
                        volume: 1,
                        loop: !1,
                        autoplay: !1,
                        onload: function() {},
                        onloaderror: function() {
                            p3.SoundManager.DEBUG && console.warn("[AudioManager] Error loading sound:", name)
                        }
                    });
                    howl.name = name, this._sounds[name] = howl
                }
            }, AudioManager.prototype.removeSounds = function(soundsArray) {
                for (var i = 0; i < soundsArray.length; i += 1) {
                    var removeSoundName = soundsArray[i];
                    for (var soundName in this._sounds)
                        if (this._sounds.hasOwnProperty(soundName)) {
                            var temphowl = this._sounds[soundName];
                            if (temphowl.name === removeSoundName) {
                                temphowl.unload(), temphowl = null, this._sounds[soundName] = null, delete this._sounds[soundName];
                                break
                            }
                        }
                }
            }, AudioManager.prototype.playSound = function(name, params) {
                var existing = this._checkSoundAlreadyPlaying(name, this._soundsSFX);
                if (existing) return existing.play(), existing;
                var howl = this._play(name, params, this.SOUND_GROUP_SFX);
                return howl ? (this._soundsSFX.push(howl), AudioManager.DEBUG && console.log("[AudioManager] Playing Sound:", name), howl) : null
            }, AudioManager.prototype.playMusic = function(name, params) {
                var existing = this._checkSoundAlreadyPlaying(name, this._soundsMusic);
                if (existing) return existing;
                params = params || {}, params.loop = "undefined" != typeof params.loop ? params.loop : !0, params.fadeIn = params.fadeIn || 1;
                var howl = this._play(name, params, this.SOUND_GROUP_MUSIC);
                return howl ? (this._soundsMusic.push(howl), AudioManager.DEBUG && console.log("[AudioManager] Playing Music:", name), howl) : null
            }, AudioManager.prototype.playVO = function(name, params) {
                var existing = this._checkSoundAlreadyPlaying(name, this._soundsVO);
                if (existing) return existing;
                var howl = this._play(name, params, this.SOUND_GROUP_VO);
                return howl ? (this._soundsVO.push(howl), AudioManager.DEBUG && console.log("[AudioManager] Playing VO:", name), howl) : null
            }, AudioManager.prototype.mute = function(isMute) {
                this._isMute = isMute, this.muteSFX(this._isMute), this.muteMusic(this._isMute), this.muteVO(this._isMute), isMute ? Howler.mute() : Howler.unmute(), this.signalMute.dispatch(this._isMute)
            }, AudioManager.prototype.muteSFX = function(isMute) {
                this._isMuteSFX = isMute, this._isMute = isMute, this._updateSoundMuteStatus(this._isMuteSFX, this._soundsSFX), AudioManager.DEBUG && console.log("[AudioManager] MuteSFX:", this._isMuteSFX)
            }, AudioManager.prototype.muteMusic = function(isMute) {
                this._isMuteMusic = isMute, this._isMute = isMute, this._updateSoundMuteStatus(this._isMuteMusic, this._soundsMusic), AudioManager.DEBUG && console.log("[AudioManager] MuteMusic:", this._isMuteMusic)
            }, AudioManager.prototype.muteVO = function(isMute) {
                this._isMuteVO = isMute, this._sMute = isMute, this._updateSoundMuteStatus(this._isMuteVO, this._soundsVO), AudioManager.DEBUG && console.log("[AudioManager] MuteVO:", this._isMuteVO)
            }, AudioManager.prototype.toggleMute = function() {
                this.mute(!this.isMute)
            }, AudioManager.prototype.stopSound = function(name) {
                for (var tempArrs = [this._soundsSFX, this._soundsVO, this._soundsMusic], i = 0; i < tempArrs.length; i++) {
                    var tempArr = tempArrs[i],
                        existing = this._checkSoundAlreadyPlaying(name, tempArr);
                    if (existing) return void existing.stop()
                }
                AudioManager.DEBUG && console.log("[SoundManager] StopSound: Could not find sound to stop it:", name)
            }, AudioManager.prototype._saveMuteStatus = function() {
                try {
                    localStorage.setItem(this.LOCAL_STORAGE_ID, this._isMute)
                } catch (e) {
                    "QUOTA_EXCEEDED_ERR" == e ? p3.SoundManager.DEBUG && console.log("Error trying to write to local storage. Quota exceeded. ") : p3.SoundManager.DEBUG && console.log("Error trying to write to local storage.")
                }
            }, AudioManager.prototype._play = function(name, params, soundType) {
                var howl, that = this,
                    soundName = name;
                if (params = params || {}, params.volume = params.volume || 1, params.loop = "undefined" != typeof params.loop ? params.loop : !1, params.delay = params.delay || 0, params.fadeIn = "undefined" != typeof params.fadeIn ? 1e3 * params.fadeIn : 0, params.onComplete = params.onComplete || null, params.onCompleteScope = params.onCompleteScope || window, params.dontRepeat = "undefined" != typeof params.dontRepeat ? params.dontRepeat : !0, "string" != typeof name) {
                    if (!(name.length >= 0)) throw Error("[AudioManager] Sound is not a string or array: ", name);
                    if (name.length > 1) {
                        var randomSound = Math.floor(Math.random() * name.length);
                        if (params.dontRepeat)
                            for (var dontRepeatCount = 0; randomSound === this._previouslyPlayedSound;)
                                if (randomSound = Math.floor(Math.random() * name.length), dontRepeatCount++, dontRepeatCount > 10) {
                                    randomSound = 0;
                                    break
                                }
                        soundName = name[randomSound], this._previouslyPlayedSound = soundName
                    } else soundName = name[0]
                }
                for (var soundNameKey in this._sounds)
                    if (this._sounds.hasOwnProperty(soundNameKey)) {
                        var temphowl = this._sounds[soundNameKey];
                        if (temphowl.name === soundName) {
                            howl = temphowl;
                            break
                        }
                    }
                if (!howl) return void console.warn("[AudioManager] Could not find the sound:", name);
                howl.volume(params.volume), howl.loop(params.loop), Device && Device.isAndroidStockBrowser && (howl.buffer = !0), howl.on("end", function() {
                    this.off("end"), params.loop || that._removeSoundFromArray(this, soundType), params.onComplete && params.onComplete.call(params.onCompleteScope), AudioManager.DEBUG && console.log("[AudioManager] Sound ended:", this.name)
                });
                var startMuted;
                switch (soundType) {
                    case this.SOUND_GROUP_SFX:
                        startMuted = this._isMuteSFX;
                        break;
                    case this.SOUND_GROUP_MUSIC:
                        startMuted = this._isMuteMusic, this._stopExistingSound(soundType, params.fadeIn);
                        break;
                    case this.SOUND_GROUP_VO:
                        startMuted = this._isMuteVO, this._stopExistingSound(soundType, params.fadeIn);
                        break;
                    default:
                        startMuted = !1
                }
                return startMuted && (howl.mute(), params.fadeIn = 0), 0 === params.delay ? 0 === params.fadeIn ? howl.play() : howl.fadeIn(params.volume, params.fadeIn) : setTimeout(function() {
                    0 === params.fadeIn ? howl.play() : howl.fadeIn(params.volume, params.fadeIn)
                }, 1e3 * params.delay), howl
            }, AudioManager.prototype._stopExistingSound = function(soundType, fadeIn) {
                var soundArr, that = this;
                if (soundType === this.SOUND_GROUP_MUSIC) soundArr = this._soundsMusic;
                else {
                    if (soundType !== this.SOUND_GROUP_VO) return;
                    soundArr = this._soundsVO, fadeIn = 0
                }
                if (soundArr.length > 0)
                    for (var i = 0; i < soundArr.length; i += 1) {
                        var existingSound = soundArr[i];
                        that._removeSoundFromArray(existingSound, soundType), 0 === fadeIn ? existingSound.stop() : existingSound.fadeOut(0, fadeIn, function() {
                            existingSound.stop()
                        })
                    }
            }, AudioManager.prototype._removeSoundFromArray = function(howl, soundType) {
                var arr;
                switch (soundType) {
                    case this.SOUND_GROUP_SFX:
                        arr = this._soundsSFX;
                        break;
                    case this.SOUND_GROUP_MUSIC:
                        arr = this._soundsMusic;
                        break;
                    case this.SOUND_GROUP_VO:
                        arr = this._soundsVO
                }
                for (var i = 0, len = arr.length; len > i; i++) {
                    var sound = arr[i];
                    sound && sound.name === howl.name && arr.splice(i, 1)
                }
            }, AudioManager.prototype._updateSoundMuteStatus = function(isMute, soundArray) {
                for (var len = soundArray.length, i = 0; len > i; i += 1) {
                    var sound = soundArray[i];
                    isMute ? sound.mute() : sound.unmute()
                }
            }, AudioManager.prototype._checkSoundAlreadyPlaying = function(name, arr) {
                for (var i = 0, len = arr.length; len > i; i += 1) {
                    var sound = arr[i];
                    if (sound.name === name) return sound
                }
                return null
            }, AudioManager.prototype._onBlur = function() {
                Howler.mute()
            }, AudioManager.prototype._onFocus = function() {
                this._isMute || Howler.unmute()
            }, AudioManager.prototype.isMute = !1, AudioManager.prototype.isMuteSFX = !1, AudioManager.prototype.isMuteMusic = !1, AudioManager.prototype.isMuteVO = !1, AudioManager.prototype.sounds = !1, AudioManager.prototype.soundsSFX, AudioManager.prototype.soundsSFX, AudioManager.prototype.soundsMusic, AudioManager.prototype.soundsVO, Object.defineProperty(AudioManager.prototype, "isMute", {
                get: function() {
                    return this._isMute
                }
            }), Object.defineProperty(AudioManager.prototype, "isMuteSFX", {
                get: function() {
                    return this._isMuteSFX
                }
            }), Object.defineProperty(AudioManager.prototype, "isMuteMusic", {
                get: function() {
                    return this._isMuteMusic
                }
            }), Object.defineProperty(AudioManager.prototype, "isMuteVO", {
                get: function() {
                    return this._isMuteVO
                }
            }), Object.defineProperty(AudioManager.prototype, "sounds", {
                get: function() {
                    return this._sounds
                }
            }), Object.defineProperty(AudioManager.prototype, "soundsSFX", {
                get: function() {
                    return this._soundsSFX
                }
            }), Object.defineProperty(AudioManager.prototype, "soundsMusic", {
                get: function() {
                    return this._soundsMusic
                }
            }), Object.defineProperty(AudioManager.prototype, "soundsVO", {
                get: function() {
                    return this._soundsVO
                }
            })
        }, {
            "./../utils/Device": 54,
            "./../utils/Utils": 58
        }],
        9: [function(require, module, exports) {
            var Canvas = require("./../Canvas"),
                AudioManager = require("./../audio/AudioManager"),
                BBCGel = function(wrapperID) {
                    return this.signalClose = new signals.Signal, this.signalExit = new signals.Signal, this.signalInstructions = new signals.Signal, this.signalHome = new signals.Signal, this.signalMute = new signals.Signal, this.signalPause = new signals.Signal, this.buttonDimensions = {
                        x: 64,
                        y: 64
                    }, this.muteBtn = null, this.homeBtn = null, this.exitBtn = null, this.instructionsBtn = null, this.pauseBtn = null, this.closeBtn = null, this._screenHomeBtns = [], this._screenMenuBtns = [], this._screenPauseBtns = [], this._screenInstructionsBtns = [], this._screenGameBtns = [], this._screenGameOverBtns = [], this._screenCurrentBtns = [], this._screenPreviousBtns = [], this._wrapperDiv = document.getElementById(wrapperID), this._gelRootDiv = document.getElementById("p3gel"), this._gelRootDiv ? (this._gelRootDiv.style.display = "none", this._gelRootDiv.style.zIndex = BBCGel.Z_INDEX, void(window.TweenLite || console.log("[P3Gel] You do not have TweenLite which may be needed."))) : void console.warn("[BBCGel] There is no 'p3gel' div on the page.")
                };
            module.exports = BBCGel, BBCGel.Z_INDEX = 100, BBCGel.FADE_IN_DURATION = .3, BBCGel.FADE_OUT_DURATION = .2, BBCGel.DISABLE_ANIMATIONS = !1, BBCGel.prototype.enable = function(isEnabled) {
                isEnabled ? this._gelRootDiv.style.display = "block" : this._gelRootDiv.style.display = "none"
            }, BBCGel.prototype.initBtnClose = function(params) {
                return params = this._checkParams(params), this.closeBtn = document.getElementById("p3gel_close_button"), this.closeBtn ? (this.closeBtn.style.opacity = 1, void this._addButton(this.closeBtn, this._onCloseClick, params)) : void console.warn("[BBCGel] There is no 'close' button div.")
            }, BBCGel.prototype.initBtnExit = function(params) {
                return params = this._checkParams(params), this.exitBtn = document.getElementById("p3gel_exit_button"), this.exitBtn ? (this.exitBtn.style.opacity = 1, void this._addButton(this.exitBtn, this._onExitClick, params)) : void console.warn("[BBCGel] There is no 'exit' button div.")
            }, BBCGel.prototype.initBtnInstructions = function(params) {
                return params = this._checkParams(params), this.instructionsBtn = document.getElementById("p3gel_instructions_button"), this.instructionsBtn ? (this.instructionsBtn.style.opacity = 1, void this._addButton(this.instructionsBtn, this._onInstructionsClick, params)) : void console.warn("[BBCGel] There is no 'instructions' button div.")
            }, BBCGel.prototype.initBtnHome = function(params) {
                return params = this._checkParams(params), this.homeBtn = document.getElementById("p3gel_home_button"), this.homeBtn ? (this.homeBtn.style.opacity = 1, void this._addButton(this.homeBtn, this._onHomeClick, params)) : void console.warn("[BBCGel] There is no 'home' button div.")
            }, BBCGel.prototype.initBtnMute = function(params) {
                return params = this._checkParams(params), this.muteBtn = document.getElementById("p3gel_mute_button"), this.muteBtn ? (this.muteBtn.style.opacity = 1, params.isToggle = !0, this._addButton(this.muteBtn, this._onMuteClick, params), AudioManager.instance.isMute ? this.muteBtn.state = 2 : this.muteBtn.state = 0, void this._onMouseOut(this.muteBtn, null)) : void console.warn("[BBCGel] There is no 'mute' button div.")
            }, BBCGel.prototype.initBtnPause = function(params) {
                return params = this._checkParams(params), this.pauseBtn = document.getElementById("p3gel_pause_button"), this.pauseBtn ? (this.pauseBtn.style.opacity = 1, void this._addButton(this.pauseBtn, this._onPauseClick, params)) : void console.warn("[BBCGel] There is no 'pause' button div.")
            }, BBCGel.prototype.initScreenHome = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenHomeBtns = buttonsArr
            }, BBCGel.prototype.initScreenMenu = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenMenuBtns = buttonsArr
            }, BBCGel.prototype.initScreenPause = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenPauseBtns = buttonsArr
            }, BBCGel.prototype.initScreenInstructions = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenInstructionsBtns = buttonsArr
            }, BBCGel.prototype.initScreenGame = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenGameBtns = buttonsArr
            }, BBCGel.prototype.initScreenGameOver = function(buttonsArr) {
                Array.isArray(buttonsArr) || console.error(["[BBCGel] buttonsArr is not an array."]), this._screenGameOverBtns = buttonsArr
            }, BBCGel.prototype.showButton = function(btnElement, delay, transition) {
                btnElement && this._tweenIn(btnElement, delay, transition)
            }, BBCGel.prototype.hideButton = function(btnElement, delay, transition) {
                btnElement && this._tweenOut(btnElement, delay, transition)
            }, BBCGel.prototype.hideAllButtons = function(delay, transition) {
                delay = delay || 0, this.closeBtn && this._tweenOut(this.closeBtn, delay, transition), this.exitBtn && this._tweenOut(this.exitBtn, delay, transition), this.muteBtn && this._tweenOut(this.muteBtn, delay, transition), this.instructionsBtn && this._tweenOut(this.instructionsBtn, delay, transition), this.homeBtn && this._tweenOut(this.homeBtn, delay, transition), this.pauseBtn && this._tweenOut(this.pauseBtn, delay, transition)
            }, BBCGel.prototype.toggleVisibility = function(isVisible) {
                this._gelRootDiv || console.warn("[P3Gel] root node has not been set."), isVisible ? this._gelRootDiv.style.display = "block" : this._gelRootDiv.style.display = "none"
            }, BBCGel.prototype.showLayoutHome = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenHomeBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutMenu = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenMenuBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutPause = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenPauseBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutInstructions = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenInstructionsBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutGame = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenGameBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutGameOver = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenGameOverBtns, delay, fadeTransition)
            }, BBCGel.prototype.showLayoutPrevious = function(delay, fadeTransition) {
                this._showScreenButtons(this._screenPreviousBtns, delay, fadeTransition)
            }, BBCGel.prototype._checkParams = function(params) {
                return params = params || {}, params.soundClickSFX = params.soundClickSFX, params.soundClickVO = params.soundClickVO, params.soundOverSFX = params.soundOverSFX, params.soundOverVO = params.soundOverVO, params.isToggle = params.isToggle, params
            }, BBCGel.prototype._addButton = function(buttonElement, clickCallback, params) {
                buttonElement.clickCallback = clickCallback, buttonElement.scope = this, buttonElement.isToggle = params.isToggle, buttonElement.state = 0;
                var that = this;
                Canvas.isMobile() ? (buttonElement.ontouchstart = function(evt) {
                    that._onMouseOver(this, evt), params.soundOverSFX && AudioManager.instance.playSound(params.soundOverSFX), params.soundOverVO && AudioManager.instance.playVO(params.soundOverVO)
                }, buttonElement.ontouchmove = function(evt) {
                    that._onTouchMove(this, evt)
                }, buttonElement.ontouchend = function(evt) {
                    that._onMouseUp(this, evt), params.soundClickSFX && AudioManager.instance.playSound(params.soundClickVO), params.soundClickVO && AudioManager.instance.playVO(params.soundClickVO)
                }) : (buttonElement.onmouseover = function(evt) {
                    that._onMouseOver(this, evt), params.soundOverSFX && AudioManager.instance.playSound(params.soundOverSFX), params.soundOverVO && AudioManager.instance.playVO(params.soundOverVO)
                }, buttonElement.onmouseout = function(evt) {
                    that._onMouseOut(this, evt)
                }, buttonElement.onmousedown = function(evt) {
                    that._onMouseOver(this, evt)
                }, buttonElement.onmouseup = function(evt) {
                    that._onMouseUp(this, evt), params.soundClickSFX && AudioManager.instance.playSound(params.soundClickVO), params.soundClickVO && AudioManager.instance.playVO(params.soundClickVO)
                }), this.hideButton(buttonElement, 0, 0)
            }, BBCGel.prototype._showScreenButtons = function(buttonsArr, delay, fadeTransition) {
                this.hideAllButtons();
                for (var i = 0; i < buttonsArr.length; i += 1) {
                    var btn = buttonsArr[i];
                    this._tweenIn(btn, delay, fadeTransition)
                }
                this._screenPreviousBtns = this._screenCurrenBtns, this._screenCurrenBtns = buttonsArr
            }, BBCGel.prototype._tweenIn = function(element, delay, fadeTransition) {
                element && (delay = delay || 0, BBCGel.DISABLE_ANIMATIONS ? (element.style.display = "block", element.style.opacity = 1) : setTimeout(function() {
                    element.style.opacity = 0, element.style.display = "block", fadeTransition ? (TweenLite.killTweensOf(element.style), TweenLite.to(element.style, BBCGel.FADE_IN_DURATION, {
                        opacity: 1,
                        ease: Power2.easeOut
                    })) : (element.style.display = "block", element.style.opacity = 1)
                }, 1e3 * delay))
            }, BBCGel.prototype._tweenOut = function(element, delay, fadeTransition) {
                element && (delay = delay || 0, BBCGel.DISABLE_ANIMATIONS ? (element.style.opacity = 0, element.style.display = "none") : setTimeout(function() {
                    element.style.opacity = 0, element.style.display = "none", fadeTransition ? TweenLite.to(element.style, BBCGel.FADE_OUT_DURATION, {
                        opacity: 0,
                        ease: Power2.easeOut,
                        onComplete: function() {
                            element.style.display = "none"
                        }
                    }) : (element.style.opacity = 0, element.style.display = "none")
                }, 1e3 * delay))
            }, BBCGel.prototype._onTouchMove = function(buttonElement, evt) {
                evt.preventDefault()
            }, BBCGel.prototype._onMouseOver = function(buttonElement, evt) {
                var pos = (buttonElement.state + 1) * this.buttonDimensions.y;
                buttonElement.style.backgroundPosition = "0px -" + pos + "px"
            }, BBCGel.prototype._onMouseOut = function(buttonElement, evt) {
                var pos = buttonElement.state * this.buttonDimensions.y;
                buttonElement.style.backgroundPosition = "0px -" + pos + "px"
            }, BBCGel.prototype._onMouseUp = function(buttonElement, evt) {
                var isMute = AudioManager.instance.isMute;
                buttonElement.isToggle && (isMute ? buttonElement.state = 0 : buttonElement.state = 2), this._onMouseOut(buttonElement, null), buttonElement.clickCallback.call(buttonElement.scope)
            }, BBCGel.prototype._onMuteClick = function() {
                AudioManager.instance.toggleMute(), this.signalMute.dispatch()
            }, BBCGel.prototype._onHomeClick = function() {
                this.signalHome.dispatch()
            }, BBCGel.prototype._onExitClick = function() {
                this.signalExit.dispatch()
            }, BBCGel.prototype._onInstructionsClick = function() {
                this.signalInstructions.dispatch()
            }, BBCGel.prototype._onPauseClick = function() {
                this.signalPause.dispatch()
            }, BBCGel.prototype._onCloseClick = function() {
                this.signalClose.dispatch()
            }
        }, {
            "./../Canvas": 3,
            "./../audio/AudioManager": 8
        }],
        10: [function(require, module, exports) {
            var AdditiveSprite = function(texture, blendStrength, blendColor, blendPasses) {
                this.blendStrength = blendStrength || 0, this.blendColor = blendColor || 16777215, this._blendPasses = Math.max(1, blendPasses) || 2, PIXI.Sprite.call(this, texture)
            };
            module.exports = AdditiveSprite, AdditiveSprite.prototype = Object.create(PIXI.Sprite.prototype), AdditiveSprite.prototype.constructor = AdditiveSprite, AdditiveSprite.prototype._renderWebGL = function(renderer) {
                if (renderer.setObjectRenderer(renderer.plugins.sprite), renderer.plugins.sprite.render(this), this.blendStrength > 0) {
                    renderer.plugins.sprite.flush();
                    var alpha = this.worldAlpha,
                        tint = this.tint;
                    this.worldAlpha = alpha * this.blendStrength, this.blendMode = PIXI.BLEND_MODES.ADD, this.tint = this.blendColor;
                    for (var i = 0; i < this._blendPasses; ++i) renderer.plugins.sprite.render(this);
                    renderer.plugins.sprite.flush(), this.worldAlpha = alpha, this.blendMode = PIXI.BLEND_MODES.NORMAL, this.tint = tint
                }
            }, Object.defineProperty(AdditiveSprite.prototype, "blendPasses", {
                get: function() {
                    return this._blendPasses
                },
                set: function(value) {
                    this._blendPasses = Math.max(1, value)
                }
            })
        }, {}],
        11: [function(require, module, exports) {
            function Button(normalTexture, overTexture, downTexture, iconTexture, normalInactiveTexture, overInactiveTexture, downInactiveTexture, iconInactiveTexture) {
                this.animate = !1, this.defaultScale = new PIXI.Point(1, 1), this.animateOverScale = new PIXI.Point(1.1, 1.1), this.animateDownScale = new PIXI.Point(.9, .9), this.upSoundName = null, this.overSoundName = null, this.downSoundName = null, this.clickSoundName = null, this.signals = {}, this.signals.down = new signals.Signal, this.signals.up = new signals.Signal, this.signals.over = new signals.Signal, this.signals.out = new signals.Signal, this.signals.click = new signals.Signal, this.signals.animate = new signals.Signal, this._background = new PIXI.Sprite(normalTexture), this._icon = new PIXI.Sprite(iconTexture || PIXI.Texture.empty), this._normalTexture = normalTexture, this._overTexture = overTexture, this._downTexture = downTexture, this._iconTexture = iconTexture, this._normalInactiveTexture = normalInactiveTexture, this._overInactiveTexture = overInactiveTexture, this._downInactiveTexture = downInactiveTexture, this._iconInactiveTexture = iconInactiveTexture, this._currentNormalTexture = this._normalTexture, this._currentOverTexture = this._overTexture, this._currentDownTexture = this._downTexture, this._currentIconTexture = this._iconTexture, this._tweenOver = null, this._tweenOut = null, this._tweenDown = null, this._enabled = !0, PIXI.Container.call(this, this._normalTexture), this.interactive = !0, this.buttonMode = !0, this.mousedown = this.touchstart = this.onMouseDown.bind(this), this.mouseup = this.touchend = this.onMouseUp.bind(this), this.mouseupoutside = this.touchendoutside = this.onMouseOut.bind(this), this.click = this.tap = this.onMouseClick.bind(this), this.mouseover = this.onMouseOver.bind(this), this.mouseout = this.onMouseOut.bind(this), this._background.anchor = new PIXI.Point(.5, .5), this.addChild(this._background), this._icon.anchor = new PIXI.Point(.5, .5), this.addChild(this._icon)
            }
            var Device = require("./../utils/Device");
            module.exports = Button, Button.prototype = Object.create(PIXI.Container.prototype), Button.prototype.constructor = Button, Button.audio = null, Button.prototype.init = function() {}, Button.prototype.dispose = function() {
                TweenMax.killTweensOf(this), TweenMax.killTweensOf(this.scale), this.removeChildren(), this.signals.up.dispose(), this.signals.down.dispose(), this.signals.over.dispose(), this.signals.out.dispose(), this.signals.click.dispose(), this.signals.animate.dispose()
            }, Button.prototype.onMouseDown = function(event) {
                if (this.downTexture && (this._background.texture = this._currentDownTexture), this.animate) {
                    var tweens = TweenMax.getTweensOf(this, !0),
                        a = tweens.indexOf(this._tweenOver) > -1 ? tweens.length - 1 : tweens.length;
                    a || (this._tweenOver && (this._tweenOver.kill(), this._tweenOver = null), this._tweenDown = this.animateDown())
                }
                Button.audio && this.downSoundName && Button.audio.playSound(this.downSoundName), this._enabled && this.signals.down.dispatch(this, event)
            }, Button.prototype.onMouseUp = function(event) {
                this.overTexture && !p3.Device.isMobile ? this._background.texture = this._currentOverTexture : this._background.texture = this._currentNormalTexture, this.animate && this._tweenDown && (this._tweenDown && (this._tweenDown.kill(), this._tweenDown = null), this._tweenOver = p3.Device.isMobile ? this.animateOut() : this.animateOver()), Button.audio && this.upSoundName && Button.audio.playSound(this.upSoundName), this._enabled && this.signals.up.dispatch(this, event)
            }, Button.prototype.onMouseOver = function(event) {
                if (this.overTexture && (this._background.texture = this._currentOverTexture), this.animate && !Device.isMobile) {
                    var tweens = TweenMax.getTweensOf(this, !0); - 1 == tweens.indexOf(this._tweenOver) && (this._tweenOut && (this._tweenOut.kill(), this._tweenOut = null), this._tweenOver = this.animateOver())
                }
                Button.audio && this.overSoundName && Button.audio.playSound(this.overSoundName), this._enabled && this.signals.over.dispatch(this, event)
            }, Button.prototype.onMouseOut = function(event) {
                if (this._background.texture = this._currentNormalTexture, this._tweenOver || this._tweenDown) {
                    var tweens = TweenMax.getTweensOf(this, !0); - 1 == tweens.indexOf(this._tweenOut) && (this._tweenOver && (this._tweenOver.kill(), this._tweenOver = null), this._tweenOut = this.animateOut()), -1 == tweens.indexOf(this._tweenDown) && (this._tweenDown && (this._tweenDown.kill(), this._tweenDown = null), this._tweenOut = this.animateOut())
                }
                Button.audio && this.upSoundName && Button.audio.playSound(this.upSoundName), this._enabled && this.signals.out.dispatch(this, event)
            }, Button.prototype.onMouseClick = function(event) {
                Button.audio && this.clickSoundName && Button.audio.playSound(this.clickSoundName), this._enabled && this.signals.click.dispatch(this, event)
            }, Button.prototype.animateOver = function() {
                return TweenMax.to(this.scale, .6, {
                    x: this.defaultScale.x * this.animateOverScale.x,
                    y: this.defaultScale.y * this.animateOverScale.y,
                    ease: Elastic.easeOut,
                    easeParams: [1],
                    onComplete: function() {
                        this.signals.animate.dispatch(this, "over")
                    },
                    onCompleteScope: this
                })
            }, Button.prototype.animateOut = function() {
                return TweenMax.to(this.scale, .3, {
                    x: this.defaultScale.x,
                    y: this.defaultScale.y,
                    ease: Back.easeInOut,
                    easeParams: [2],
                    onComplete: function() {
                        this.signals.animate.dispatch(this, "out")
                    },
                    onCompleteScope: this
                })
            }, Button.prototype.animateDown = function() {
                return TweenMax.to(this.scale, .14, {
                    x: this.defaultScale.x * this.animateDownScale.x,
                    y: this.defaultScale.y * this.animateDownScale.y,
                    ease: Back.easeOut,
                    easeParams: [1],
                    onComplete: function() {
                        this.signals.animate.dispatch(this, "down")
                    },
                    onCompleteScope: this
                })
            }, Object.defineProperty(Button.prototype, "normalTexture", {
                get: function() {
                    return this._normalTexture
                }
            }), Object.defineProperty(Button.prototype, "overTexture", {
                get: function() {
                    return this._overTexture
                }
            }), Object.defineProperty(Button.prototype, "downTexture", {
                get: function() {
                    return this._downTexture
                }
            }), Object.defineProperty(Button.prototype, "iconTexture", {
                get: function() {
                    return this._iconTexture
                }
            }), Object.defineProperty(Button.prototype, "normalInactiveTexture", {
                get: function() {
                    return this._normalInactiveTexture
                }
            }), Object.defineProperty(Button.prototype, "overInactiveTexture", {
                get: function() {
                    return this._overInactiveTexture
                }
            }), Object.defineProperty(Button.prototype, "downInactiveTexture", {
                get: function() {
                    return this._downInactiveTexture
                }
            }), Object.defineProperty(Button.prototype, "iconInactiveTexture", {
                get: function() {
                    return this._iconInactiveTexture
                }
            }), Object.defineProperty(Button.prototype, "currentNormalTexture", {
                get: function() {
                    return this._currentNormalTexture
                }
            }), Object.defineProperty(Button.prototype, "currentOverTexture", {
                get: function() {
                    return this._currentOverTexture
                }
            }), Object.defineProperty(Button.prototype, "currentDownTexture", {
                get: function() {
                    return this._currentDownTexture
                }
            }), Object.defineProperty(Button.prototype, "currentIconTexture", {
                get: function() {
                    return this._currentIconTexture
                }
            }), Object.defineProperty(Button.prototype, "enabled", {
                get: function() {
                    return this._enabled
                },
                set: function(value) {
                    this._enabled = value, this._currentNormalTexture = value || !this._normalInactiveTexture ? this._normalTexture : this._normalInactiveTexture, this._currentOverTexture = value || !this._overInactiveTexture ? this._overTexture : this._overInactiveTexture, this._currentDownTexture = value || !this._downInactiveTexture ? this._downTexture : this._downInactiveTexture, this._currentIconTexture = value || !this._iconInactiveTexture ? this._iconTexture : this._iconInactiveTexture, this._currentNormalTexture && (this._background.texture = this._currentNormalTexture), this._currentIconTexture && (this._icon.texture = this._currentIconTexture)
                }
            }), Object.defineProperty(Button.prototype, "tint", {
                get: function() {
                    return this._background.tint
                },
                set: function(value) {
                    this._background.tint = value, this._icon.tint = value
                }
            })
        }, {
            "./../utils/Device": 54
        }],
        12: [function(require, module, exports) {
            function MovieClip(sequence, defaultAnimation) {
                this.defaultAnimation = defaultAnimation || "default", this.animationSpeed = 24, this.playing = !1, this.looping = !1, this.signals = {}, this.signals.animation = new signals.Signal, this.signals.animationComplete = new signals.Signal, this._frames = {}, this._currentFrame = 0, this._lastFrame = 0, this._currentAnimationName = this.defaultAnimation;
                var texture = sequence.textures[this.defaultAnimation] ? sequence.textures[this.defaultAnimation][0] : PIXI.Texture.EMPTY;
                if (!texture) throw new Error("No default texture found!");
                for (var key in sequence.textures)
                    if (sequence.textures.hasOwnProperty(key)) {
                        this._frames[key] = [];
                        for (var i = 0; i < sequence.textures[key].length; ++i) this._frames[key].push({
                            texture: sequence.textures[key][i],
                            callback: null,
                            scope: null
                        })
                    }
                AdditiveSprite.call(this, texture)
            }
            var AdditiveSprite = (require("./../AssetManager"), require("./AdditiveSprite"));
            require("./MovieClipSequence"), require("./../utils/Utils");
            module.exports = MovieClip, MovieClip.prototype = Object.create(AdditiveSprite.prototype), MovieClip.prototype.constructor = MovieClip, MovieClip.prototype.dispose = function() {
                this.signals.animation.dispose(), this.signals.animationComplete.dispose()
            }, MovieClip.prototype.play = function(looping) {
                "boolean" == typeof looping && (this.looping = looping), this.playing = !0
            }, MovieClip.prototype.stop = function(looping) {
                "boolean" == typeof looping && (this.looping = looping), this.playing = !1
            }, MovieClip.prototype.gotoAndPlay = function(frame, looping) {
                "string" != typeof frame ? this._currentFrame = this._lastFrame = frame : this._frames[frame] && (this._currentFrame = this._lastFrame = 0, this._currentAnimationName = frame), "boolean" == typeof looping && (this.looping = looping), this.playing = !0
            }, MovieClip.prototype.gotoAndStop = function(frame, looping) {
                "string" != typeof frame ? this._currentFrame = frame : this._frames[frame] && (this._currentFrame = 0, this._currentAnimationName = frame), "boolean" == typeof looping && (this.looping = looping), this.playing = !1;
                var frames = this._frames[this._currentAnimationName],
                    round = this._currentFrame + .5 | 0;
                this.texture = frames[round % frames.length].texture
            }, MovieClip.prototype.addFrameScript = function(name, frame, callback, scope) {
                scope = scope || window, this._frames[name] && (this._frames[name][frame].callback = callback, this._frames[name][frame].scope = callback ? scope : null)
            }, MovieClip.prototype.updateTransform = function() {
                if (PIXI.Sprite.prototype.updateTransform.call(this), this.playing && this.totalFrames) {
                    this._currentFrame += this.animationSpeed * p3.Timestep.deltaTime;
                    var frames = this._frames[this._currentAnimationName],
                        round = this._currentFrame + .5 | 0,
                        index = round % (frames.length + 1);
                    this._currentFrame = this._currentFrame % frames.length, index > 0 && index != this._lastFrame && (this._lastFrame = index, frames[index - 1].callback && setTimeout(function() {
                        frames[index - 1].callback.call(frames[index - 1].scope)
                    }, 0)), this.looping || round < frames.length ? (this.texture = frames[round % frames.length].texture, round >= frames.length - 1 && p3.Timestep.queueCall(this.signals.animation.dispatch, [this._currentAnimationName])) : round >= frames.length - 1 && (this.gotoAndStop(frames.length - 1), p3.Timestep.queueCall(this.signals.animationComplete.dispatch, [this._currentAnimationName]))
                }
            }, Object.defineProperty(MovieClip.prototype, "currentFrame", {
                get: function() {
                    return this._currentFrame
                }
            }), Object.defineProperty(MovieClip.prototype, "currentAnimationFrame", {
                get: function() {
                    return this._currentAnimationName
                }
            }), Object.defineProperty(MovieClip.prototype, "totalFrames", {
                get: function() {
                    var frames = this._frames[this.defaultAnimation];
                    return frames ? frames.length : 0
                }
            })
        }, {
            "./../AssetManager": 2,
            "./../utils/Utils": 58,
            "./AdditiveSprite": 10,
            "./MovieClipSequence": 13
        }],
        13: [function(require, module, exports) {
            function MovieClipSequence(textures, name) {
                this.textures = {}, textures && this.addTextures(textures, name)
            }
            module.exports = MovieClipSequence, MovieClipSequence.prototype.addTextures = function(textures, name) {
                name = name || "default", this.textures[name] = textures
            }, MovieClipSequence.prototype.removeTextures = function(name) {
                name = name || "default", this.textures[name] = null
            }, MovieClipSequence.prototype.removeAllTextures = function() {
                this.textures = {}
            }
        }, {}],
        14: [function(require, module, exports) {
            function MuteButton(normalTexture, overTexture, downTexture, onIconTexture, offIconTexture, normalInactiveTexture, overInactiveTexture, downInactiveTexture, onIconInactiveTexture, offIconInactiveTexture) {
                this._onIconTexture = onIconTexture, this._offIconTexture = offIconTexture, this._onIconInactiveTexture = onIconInactiveTexture, this._offIconInactiveTexture = offIconInactiveTexture, Button.call(this, normalTexture, overTexture, downTexture, this.isEnabled() ? this._onIconTexture : this._offIconTexture, normalInactiveTexture, overInactiveTexture, downInactiveTexture, this.isEnabled() ? this._onIconInactiveTexture : this._offIconInactiveTexture);
            }
            var Button = require("./Button");
            module.exports = MuteButton, MuteButton.prototype = Object.create(Button.prototype), MuteButton.prototype.constructor = MuteButton, MuteButton.prototype.onMouseDown = function(event) {
                this._enabled = !this._enabled, this._currentIconTexture = this.isEnabled() ? this._offIconTexture : this._onIconTexture, this._icon.texture = this._currentIconTexture, Button.audio && Button.audio.mute(!Button.audio.isMute), Button.prototype.onMouseDown.call(this, event)
            }, MuteButton.prototype.isEnabled = function() {
                return !!Button.audio && !Button.audio.isMute
            }
        }, {
            "./Button": 11
        }],
        15: [function(require, module, exports) {
            function ToggleButton(onNormalTexture, offNormalTexture, onOverTexture, offOverTexture, onDownTexture, offDownTexture) {
                this._enabled = !1, this._onNormalTexture = onNormalTexture, this._offNormalTexture = offNormalTexture, this._onOverTexture = onOverTexture, this._offOverTexture = offOverTexture, this._onDownTexture = onDownTexture, this._offDownTexture = offDownTexture, this._normalTexture = this.isEnabled() ? onNormalTexture : offNormalTexture, this._overTexture = this.isEnabled() ? onOverTexture : offOverTexture, this._downTexture = this.isEnabled() ? onDownTexture : offDownTexture, Button.call(this, this._normalTexture, this._overTexture, this._downTexture)
            }
            var Button = require("./Button");
            module.exports = ToggleButton, ToggleButton.prototype = Object.create(Button.prototype), ToggleButton.prototype.constructor = ToggleButton, ToggleButton.prototype.onMouseDown = function(event) {
                this._enabled = !this._enabled, this._normalTexture = this.isEnabled() ? this._onNormalTexture : this._offNormalTexture, this._overTexture = this.isEnabled() ? this._onOverTexture : this._offOverTexture, this._downTexture = this.isEnabled() ? this._onDownTexture : this._offDownTexture, Button.prototype.onMouseDown.call(this, event)
            }, ToggleButton.prototype.isEnabled = function() {
                return this._enabled
            }
        }, {
            "./Button": 11
        }],
        16: [function(require, module, exports) {
            var Particle = function(texture) {
                PIXI.Sprite.call(this, texture), this.currentTime = 0, this.totalTime = 0, this.position = new PIXI.Point, this.scale = new PIXI.Point, this.start = new PIXI.Point, this.velocity = new PIXI.Point, this.alpha = 0, this.rotation = 0, this.radialAcceleration = 0, this.tangentialAcceleration = 0, this.emitRadius = 0, this.emitRadiusDelta = 0, this.emitRotation = 0, this.emitRotationDelta = 0, this.rotationDelta = 0, this.scaleDelta = 0, this.renderDepth = 0, this.alphaDelta = 0, this.active = !1, this.anchor.x = .5, this.anchor.y = .5
            };
            module.exports = Particle, Particle.prototype = Object.create(PIXI.Sprite.prototype), Particle.prototype.constructor = Particle, Particle.VERSION = "1.0.0"
        }, {}],
        17: [function(require, module, exports) {
            var AssetManager = require("./../../AssetManager"),
                Particle = require("./Particle"),
                Timestep = require("./../../Timestep"),
                ParticleSystem = function(texture, config, forceAngle, onTop) {
                    if (onTop = "boolean" == typeof onTop ? onTop : !0, PIXI.Container.call(this), this.signalCompleted = new signals.Signal, this.emitterType = ParticleSystem.EMITTER_TYPE_GRAVITY, this.emitter = new PIXI.Point, this.emitterVariance = new PIXI.Point, this.gravity = new PIXI.Point, this.lifespanVariance = 0, this.startSize = 0, this.startSizeVariance = 0, this.endSize = 0, this.endSizeVariance = 0, this.emitAngle = 0, this.emitAngleVariance = 0, this.startRotation = 0, this.startRotationVariance = 0, this.speedMax = 0, this.speedVariance = 0, this.endRotation = 0, this.endRotationVariance = 0, this.radialAcceleration = 0, this.radialAccelerationVariance = 0, this.tangentialAcceleration = 0, this.tangentialAccelerationVariance = 0, this.maxRadius = 0, this.maxRadiusVariance = 0, this.minRadius = 0, this.rotatePerSecond = 0, this.rotatePerSecondVariance = 0, this.startAlpha = 0, this.startAlphaVariance = 0, this.endAlpha = 0, this.endAlphaVariance = 0, this.removeOnComplete = !0, this.onTop = onTop, this._textures = void 0 == texture.length ? [texture] : texture, this._particles = [], this._frameTime = 0, this._numParticles = 0, this._maxCapacity = 0, this._emissionRate = 0, this._emissionTime = 0, this._maxNumParticles = 0, this._lifespan = 0, this._forceAngle = forceAngle, this._running = !1, this._tint = 16777215, "string" == typeof this._textures[0]) throw Error("[ParticleSystem] You are passing in strings for the textures instead of actual textures.");
                    this._parseConfig(config), this._updateEmissionRate(), ParticleSystem.enabled && (this.maxCapacity = this._maxNumParticles ? this._maxNumParticles : 8192, this._raiseCapacity(this._maxNumParticles || 32))
                };
            module.exports = ParticleSystem, ParticleSystem.prototype = Object.create(PIXI.Container.prototype), ParticleSystem.prototype.constructor = ParticleSystem, ParticleSystem.VERSION = "3.0.0", ParticleSystem.EMITTER_TYPE_GRAVITY = 0, ParticleSystem.EMITTER_TYPE_RADIAL = 1, ParticleSystem.enabled = !0, ParticleSystem.prototype.start = function(duration) {
                ParticleSystem.enabled && (duration = duration || Number.MAX_VALUE, 0 != this._emissionRate && (this._emissionTime = duration), this.running = !0)
            }, ParticleSystem.prototype.stop = function() {
                ParticleSystem.enabled && (this._emissionTime = 0, this._numParticles = 0, this.running = !1)
            }, ParticleSystem.prototype.pause = function() {
                ParticleSystem.enabled && (this._emissionTime = 0, this.running = !1)
            }, ParticleSystem.prototype.reset = function() {
                if (ParticleSystem.enabled) {
                    for (var i = 0; i < this._numParticles; ++i) this._disposeParticle(this._particles[i]);
                    this._particles.length = 0, this.maxCapacity = 0, this._numParticles = 0, this.stop()
                }
            }, ParticleSystem.prototype.oneShot = function() {
                if (ParticleSystem.enabled) {
                    this.stop();
                    for (var particle = null, i = 0; i < this._numParticles; ++i) this._disposeParticle(this._particles[i]);
                    for (i = 0; i < this.maxCapacity; ++i) this._numParticles == this.capacity && this._raiseCapacity(this.capacity), particle = this._particles[this._numParticles++], this._initParticle(particle)
                }
            }, ParticleSystem.prototype.simulate = function(steps) {
                if (ParticleSystem.enabled) {
                    steps = steps || 1e3;
                    for (var i = 0; steps > i; ++i) this.advance(Timestep.deltaTime)
                }
            }, ParticleSystem.prototype.advance = function(delta) {
                if (ParticleSystem.enabled) {
                    for (var particleIndex = 0, particle = null; particleIndex < this._numParticles;)
                        if (particle = this._particles[particleIndex], particle.currentTime < particle.totalTime) this._advanceParticle(particle, delta), ++particleIndex;
                        else {
                            if (particleIndex != this._numParticles - 1) {
                                var nextParticle = this._particles[this._numParticles - 1];
                                this._particles[this._numParticles - 1] = particle, this._particles[particleIndex] = nextParticle
                            }--this._numParticles, this._disposeParticle(particle), 0 == this._numParticles && (this.signalCompleted.dispatch(this), this.removeOnComplete && (this.parent && this.parent.removeChild(this.parent), this.dispose()))
                        }
                    if (this._emissionTime > 0) {
                        var timeBetweenParticles = 1 / this._emissionRate;
                        for (this._frameTime += delta; this._frameTime > 0;) this._numParticles < this.maxCapacity && (this._numParticles == this.capacity && this._raiseCapacity(this.capacity), particle = this._particles[this._numParticles++], this._initParticle(particle), this._advanceParticle(particle, delta)), this._frameTime -= timeBetweenParticles;
                        this._emissionTime != Number.MAX_VALUE && (this._emissionTime = Math.max(0, this._emissionTime - delta))
                    }
                }
            }, ParticleSystem.prototype.dispose = function() {
                this.signalCompleted.dispose(), this._textures.length = 0, this._particles.length = 0, this.removeChildren()
            }, ParticleSystem.prototype.update = function() {
                this.advance(Timestep.deltaTime)
            }, ParticleSystem.prototype._initParticle = function(particle) {
                var lifespan = this._lifespan + this.lifespanVariance * (2 * Math.random() - 1);
                if (!(0 >= lifespan)) {
                    var index = Math.floor(Math.random() * this._textures.length),
                        texture = this._textures[index];
                    particle.texture = texture, particle.currentTime = 0, particle.totalTime = lifespan, particle.active = !0, particle.position.x = this.emitter.x + this.emitterVariance.x * (2 * Math.random() - 1), particle.position.y = this.emitter.y + this.emitterVariance.y * (2 * Math.random() - 1), particle.start.x = this.emitter.x, particle.start.y = this.emitter.y;
                    var angle = this.emitAngle + this.emitAngleVariance * (2 * Math.random() - 1),
                        speed = this.speedMax + this.speedVariance * (2 * Math.random() - 1);
                    particle.velocity.x = speed * Math.cos(angle), particle.velocity.y = speed * Math.sin(angle), particle.emitRadius = this.maxRadius + this.maxRadiusVariance * (2 * Math.random() - 1), particle.emitRadiusDelta = this.maxRadius / lifespan, particle.emitRotation = this.emitAngle + this.emitAngleVariance * (2 * Math.random() - 1), particle.emitRotationDelta = this.rotatePerSecond + this.rotatePerSecondVariance * (2 * Math.random() - 1), particle.radialAcceleration = this.radialAcceleration + this.radialAccelerationVariance * (2 * Math.random() - 1), particle.tangentialAcceleration = this.tangentialAcceleration + this.tangentialAccelerationVariance * (2 * Math.random() - 1);
                    var startSize = this.startSize + this.startSizeVariance * (2 * Math.random() - 1),
                        endSize = this.endSize + this.endSizeVariance * (2 * Math.random() - 1);
                    if (startSize = Math.max(.1, startSize), endSize = Math.max(.1, endSize), particle.scale.x = particle.scale.y = startSize / texture.width * AssetManager.instance.scaleFactor, particle.scaleDelta = (endSize - startSize) / lifespan / texture.width, this._forceAngle) particle.rotation = angle + 1.57079637, particle.rotationDelta = 0;
                    else {
                        var startRotation = this.startRotation + this.startRotationVariance * (2 * Math.random() - 1),
                            endRotation = this.endRotation + this.endRotationVariance * (2 * Math.random() - 1);
                        particle.rotation = startRotation, particle.rotationDelta = (endRotation - startRotation) / lifespan
                    }
                    var startAlpha = this.startAlpha,
                        endAlpha = this.endAlpha;
                    0 != this.startAlphaVariance && (startAlpha += this.startAlphaVariance * (2 * Math.random() - 1)), 0 != this.endAlphaVariance && (endAlpha += this.endAlphaVariance * (2 * Math.random() - 1)), particle.alpha = startAlpha, particle.alphaDelta = (endAlpha - startAlpha) / lifespan, particle.tint = this._tint, this.onTop ? this.addChild(particle) : this.addChildAt(particle, 0)
                }
            }, ParticleSystem.prototype._disposeParticle = function(particle) {
                particle.active = !1, this.removeChild(particle)
            }, ParticleSystem.prototype._advanceParticle = function(particle, delta) {
                var restTime = particle.totalTime - particle.currentTime;
                if (delta = restTime > delta ? delta : restTime, particle.currentTime += delta, this.emitterType == ParticleSystem.EMITTER_TYPE_RADIAL) particle.emitRotation += particle.emitRotationDelta * delta, particle.emitRadius -= particle.emitRadiusDelta * delta, particle.position.x = this.emitter.x - Math.cos(particle.emitRotation) * particle.emitRadius, particle.position.y = this.emitter.y - Math.sin(particle.emitRotation) * particle.emitRadius, particle.emitRadius < this.minRadius && (particle.currentTime = particle.totalTime);
                else if (this.emitterType == ParticleSystem.EMITTER_TYPE_GRAVITY) {
                    var distanceX = particle.position.x - particle.start.x,
                        distanceY = particle.position.y - particle.start.y,
                        distanceScalar = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    distanceScalar = Math.max(.01, distanceScalar);
                    var radialX = distanceX / distanceScalar,
                        radialY = distanceY / distanceScalar,
                        tangentialX = radialX,
                        tangentialY = radialY;
                    radialX *= particle.radialAcceleration, radialY *= particle.radialAcceleration, tangentialX = -tangentialY * particle.tangentialAcceleration, tangentialY = tangentialX * particle.tangentialAcceleration, particle.velocity.x += delta * (this.gravity.x + radialX + tangentialX), particle.velocity.y += delta * (this.gravity.y + radialY + tangentialY), particle.position.x += particle.velocity.x * delta, particle.position.y += particle.velocity.y * delta
                }
                particle.scale.x = particle.scale.y = particle.scale.x + particle.scaleDelta * delta, particle.alpha += particle.alphaDelta * delta, this._forceAngle || (particle.rotation += .017453293 * particle.rotationDelta * delta)
            }, ParticleSystem.prototype._updateEmissionRate = function() {
                this._emissionRate = this._maxNumParticles / this._lifespan
            }, ParticleSystem.prototype._parseConfig = function(config) {
                if (void 0 == config) throw new Error("Config is invalid!");
                var deg2rad = .017453293;
                this.emitterVariance.x = config.sourcePositionVariancex, this.emitterVariance.y = config.sourcePositionVariancey, this.gravity.x = config.gravityx, this.gravity.y = config.gravityy, this.emitterType = config.emitterType, this.maxNumParticles = config.maxParticles, this.lifeSpan = config.particleLifespan, this.lifespanVariance = config.particleLifespanVariance, this.startSize = config.startParticleSize, this.startSizeVariance = config.startParticleSizeVariance, this.endSize = config.finishParticleSize, this.endSizeVariance = config.finishParticleSizeVariance, this.emitAngle = -config.angle * deg2rad, this.emitAngleVariance = config.angleVariance * deg2rad, this.startRotation = config.rotationStart, this.startRotationVariance = config.rotationStartVariance, this.endRotation = config.rotationEnd, this.endRotationVariance = config.rotationEndVariance, this.speedMax = config.speed, this.speedVariance = config.speedVariance, this.radialAcceleration = config.radialAcceleration, this.radialAccelerationVariance = config.radialAccelVariance, this.tangentialAcceleration = config.tangentialAcceleration, this.tangentialAccelerationVariance = config.tangentialAccelVariance, this.maxRadius = config.maxRadius, this.maxRadiusVariance = config.maxRadiusVariance, this.minRadius = config.minRadius, this.rotatePerSecond = config.rotatePerSecond * deg2rad, this.rotatePerSecondVariance = config.rotatePerSecondVariance * deg2rad, this.startAlpha = config.startColorAlpha, this.startAlphaVariance = config.startColorVarianceAlpha, this.endAlpha = config.finishColorAlpha, this.endAlphaVariance = config.finishColorVarianceAlpha
            }, ParticleSystem.prototype._raiseCapacity = function(amount) {
                for (var oldCapacity = this.capacity, newCapacity = Math.min(this.maxCapacity, oldCapacity + amount), i = oldCapacity; newCapacity > i; ++i) this._particles[i] = new Particle(this._textures[0])
            }, Object.defineProperty(ParticleSystem.prototype, "capacity", {
                get: function() {
                    return this._particles.length
                }
            }), Object.defineProperty(ParticleSystem.prototype, "maxCapacity", {
                get: function() {
                    return this._maxCapacity
                },
                set: function(value) {
                    this._maxCapacity = Math.min(8192, value)
                }
            }), Object.defineProperty(ParticleSystem.prototype, "maxNumParticles", {
                get: function() {
                    return this._maxNumParticles
                },
                set: function(value) {
                    this.maxCapacity = value, this._maxNumParticles = this.maxCapacity, this._updateEmissionRate()
                }
            }), Object.defineProperty(ParticleSystem.prototype, "lifeSpan", {
                get: function() {
                    return this._lifespan
                },
                set: function(value) {
                    this._lifespan = Math.max(.01, value), this._updateEmissionRate()
                }
            }), Object.defineProperty(ParticleSystem.prototype, "running", {
                get: function() {
                    return this._running
                }
            }), Object.defineProperty(ParticleSystem.prototype, "tint", {
                get: function() {
                    return this._tint
                },
                set: function(value) {
                    this._tint = value;
                    for (var particle, i = 0; i < this._particles.length; ++i) particle = this._particles[i], particle.tint = this._tint
                }
            })
        }, {
            "./../../AssetManager": 2,
            "./../../Timestep": 5,
            "./Particle": 16
        }],
        18: [function(require, module, exports) {
            var Screen = (require("./ScreenParams"), function() {
                PIXI.Container.call(this), this.guid = "", this.group = "", this.params = null
            });
            module.exports = Screen, Screen.prototype = Object.create(PIXI.Container.prototype), Screen.prototype.constructor = Screen, Screen.VERSION = "03.00.00", Screen.prototype.added = function() {}, Screen.prototype.activate = function() {}, Screen.prototype.resize = function() {}, Screen.prototype.dispose = function() {
                this.removeChildren(), this.guid = "", this.group = null, this.params = null
            }, Screen.prototype.update = function(delta) {}
        }, {
            "./ScreenParams": 21
        }],
        19: [function(require, module, exports) {
            var ScreenGroup = function(name, depth) {
                PIXI.Container.call(this), this.name = name, this._depth = depth, this.screenArr = []
            };
            module.exports = ScreenGroup, ScreenGroup.prototype = Object.create(PIXI.Container.prototype), ScreenGroup.prototype.constructor = ScreenGroup, ScreenGroup.VERSION = "03.00.00", ScreenGroup.prototype.getDepth = function() {
                var parent = this.parent;
                return parent && parent.children && (this._depth = parent.children.indexOf(this)), this._depth
            }, ScreenGroup.prototype.setDepth = function(value) {
                this._depth = value
            }
        }, {}],
        20: [function(require, module, exports) {
            var ScreenGroup = require("./ScreenGroup"),
                ScreenParams = (require("./Screen"), require("./ScreenParams")),
                Utils = (require("./transitions/Transition"), require("./../../utils/Utils")),
                ScreenManager = function() {
                    if (!ScreenManager.__allowInstance) throw new Error("ScreenManager is a Singleton, use 'instance'.");
                    this.DEFAULT_GROUP = "group_default", this._view = null, this._stage = null, this._renderer = null, this._groups = {}, this._groupsArr = [], this._isTransitioning = !1
                };
            ScreenManager.prototype.constructor = ScreenManager, module.exports = ScreenManager, ScreenManager.instance = null, Object.defineProperty(ScreenManager, "instance", {
                get: function() {
                    return ScreenManager.__instance || (ScreenManager.__allowInstance = !0, ScreenManager.__instance = new ScreenManager, ScreenManager.__allowInstance = !1), ScreenManager.__instance
                }
            }), ScreenManager.__instance = null, ScreenManager.__allowInstance = !1, ScreenManager.VERSION = "03.00.00", ScreenManager.prototype.init = function(stage, renderer) {
                this._groups = {}, this._groupsArr = [], this._stage = stage, this._renderer = renderer, this._view = new PIXI.Container, this._stage.addChild(this._view), this.addScreenGroup(this.DEFAULT_GROUP, 0)
            }, ScreenManager.prototype.addScreenGroup = function(groupName, depth) {
                if (!this._view || !this._stage) throw new Error('[ScreenManager.addScreenGroup] Error - The view/stage has not been set. Do that via "init" before adding screen groups.');
                if (this._groups[groupName]) throw Error("[ScreenManager.addScreenGroup] The group already exists: " + groupName);
                depth = this._calculateDepth(depth);
                var screengroup = new ScreenGroup(groupName, depth);
                return this._view.addChildAt(screengroup, screengroup.getDepth()), this._groups[groupName] = screengroup, this._groupsArr.push(screengroup), screengroup
            }, ScreenManager.prototype.changeScreenGroupDepth = function(groupName, depth) {
                var group = this._groups[groupName];
                if (!group) throw Error("[ScreenManager.changeScreenGroupDepth] Error - The screengroup does not exist: " + groupName);
                var newDepth = this._calculateDepth(depth);
                this._view.addChildAt(group, newDepth)
            }, ScreenManager.prototype.removeScreenGroup = function(groupName) {
                var screengroup = this._groups[groupName];
                if (!screengroup) throw Error("[ScreenManager.removeScreenGroup] Error - The screengroup does not exist: " + groupName);
                for (var i = 0; i < screengroup.screenArr.length; i += 1) {
                    var screen = screengroup.screenArr[i];
                    this._removeScreenFromGroup(null, screen, screengroup)
                }
                screengroup.screenArr = [], screengroup.removeChildren(), delete this._groups[groupName];
                var index = this._groupsArr.indexOf(screengroup);
                this._groupsArr.splice(index, 1)
            }, ScreenManager.prototype.addScreen = function(screen, params) {
                if (params = params || new ScreenParams, !this._groups[this.DEFAULT_GROUP]) throw new Error('[ScreenManager.addScreen] Error - There is no default group. Maybe you have not yet called "init" before adding screen the screen.');
                if (!screen) throw Error("[ScreenManager.addScreen] Error - The screen you are adding is null.");
                var groupName = params._group || this.DEFAULT_GROUP;
                if (groupName && !this._groups[groupName]) throw Error("[ScreenManager.addScreen] Error - The group does not exist: " + groupName);
                return screen.guid = Utils.generateGUID(), screen.group = groupName, screen.params = params, params._transition ? this._transitionScreens(screen, params._transition) : (this._doReplacements(screen), this._displayScreen(screen)), screen
            }, ScreenManager.prototype.removeScreen = function(screen) {
                if (!screen) throw Error("[ScreenManager.removeScreen] Error - The screen is null. " + screen);
                this._removeScreenFromGroup(null, screen, this.getScreenGroup(screen.group))
            }, ScreenManager.prototype.removeCurrentScreenFromGroup = function(groupName, newscreen) {
                if (!groupName || !this._groups[groupName]) throw Error("[ScreenManager.removeCurrentScreen] Error - You must supply a valid group name: " + groupName);
                var screengroup = this._groups[groupName],
                    screenCount = screengroup.children.length;
                if (screenCount > 0) {
                    var currentScreen = screengroup.getChildAt(screenCount - 1);
                    if (newscreen) {
                        if (currentScreen !== newscreen) this._removeScreenFromGroup(null, currentScreen, screengroup);
                        else if (currentScreen === newscreen) try {
                            currentScreen = screengroup.getChildAt(screenCount - 2), currentScreen && this._removeScreenFromGroup(null, currentScreen, screengroup)
                        } catch (e) {}
                    } else this._removeScreenFromGroup(null, currentScreen, screengroup)
                }
            }, ScreenManager.prototype.removeAllScreens = function() {
                for (var key in this._groups)
                    if (this._groups.hasOwnProperty(key))
                        for (var group = this._groups[key], i = 0; i < group.screenArr.length; i++) {
                            group[i];
                            this.removeScreen(group.screenArr[i])
                        }
            }, ScreenManager.prototype.dispose = function() {
                for (var key in this._groups) this._groups.hasOwnProperty(key) && this.removeScreenGroup(key);
                this._groupsArr = null, this._groups = null, this._view = null, this._stage = null, ScreenManager.__instance = null
            }, ScreenManager.prototype.update = function() {
                for (var i = 0, len = this._groupsArr.length; len > i; i++)
                    for (var group = this._groupsArr[i], j = 0, len2 = group.screenArr.length; len2 > j; j++) group.screenArr[j].update()
            }, ScreenManager.prototype.resize = function() {
                for (var i = 0, len = this._groupsArr.length; len > i; i++)
                    for (var group = this._groupsArr[i], j = 0, len2 = group.screenArr.length; len2 > j; j++) group.screenArr[j].resize()
            }, ScreenManager.prototype.contains = function(screen) {
                var containsScreen = !1;
                for (var key in this._groups)
                    if (this._groups.hasOwnProperty(key))
                        for (var group = this._groups[key], i = 0; i < group.screenArr.length; i += 1) {
                            var tempScreen = group.screenArr[i];
                            if (screen === tempScreen) {
                                containsScreen = !0;
                                break
                            }
                        }
                    return containsScreen
            }, ScreenManager.prototype._calculateDepth = function(depth) {
                var highestGroupDepth = this.getHighestGroupDepth();
                return "undefined" == typeof depth ? depth = highestGroupDepth : depth > highestGroupDepth ? depth = highestGroupDepth : 0 > depth && (depth = 0), depth
            }, ScreenManager.prototype._doReplacements = function(screen) {
                var i, j, otherScreen, screengroup, replaceScreensArr = screen.params._replaceScreens,
                    replaceGroupsArr = screen.params._replaceGroups;
                if (replaceScreensArr.length > 0)
                    for (i = 0; i < replaceScreensArr.length; i += 1) {
                        if (otherScreen = replaceScreensArr[i], screen === otherScreen) throw Error("[ScreenManager.addScreen] Error - You are trying to remove the screen you are adding: " + otherScreen);
                        this.removeScreen(otherScreen)
                    }
                if (screen.params._replaceGroups.length > 0)
                    for (i = 0; i < replaceGroupsArr.length; i += 1)
                        for (screengroup = this._groups[replaceGroupsArr[i]], j = 0; j < screengroup.screenArr.length; j += 1) otherScreen = screengroup.screenArr[j], this._removeScreenFromGroup(screen, otherScreen, screengroup);
                if (screen.params._replaceCurrent && this.removeCurrentScreenFromGroup(screen.group, screen), screen.params._replaceAll)
                    for (var key in this._groups)
                        if (this._groups.hasOwnProperty(key))
                            for (screengroup = this._groups[key], i = screengroup.screenArr.length - 1; i >= 0; i -= 1) otherScreen = screengroup.screenArr[i], this._removeScreenFromGroup(screen, otherScreen, screengroup)
            }, ScreenManager.prototype._removeScreenFromGroup = function(screen, otherScreen, screengroup) {
                if (!otherScreen) throw Error("[ScreenManager._removeScreenFromGroup] Error - The screen does not exist: " + otherScreen);
                if (!screengroup) throw Error("[ScreenManager._removeScreenFromGroup] Error - The screengroup does not exist: " + screengroup.name);
                if (!screengroup.screenArr) throw Error("[ScreenManager._removeScreenFromGroup] Error - The screengroup does not have a valid scrennArray: " + screengroup.name);
                if (otherScreen !== screen) {
                    var index = screengroup.screenArr.indexOf(otherScreen);
                    if (-1 === index) throw Error("[ScreenManager._removeScreenFromGroup] Error - The group does not contain the screen. Group=" + screengroup.name);
                    otherScreen.dispose(), otherScreen.removeChildren(), screengroup.screenArr.splice(index, 1), screengroup.removeChild(otherScreen)
                }
            }, ScreenManager.prototype._displayScreen = function(screen, transitioning) {
                var screenGroup = this._groups[screen.group];
                screenGroup.addChild(screen), screenGroup.screenArr.push(screen), screen.added(), screen.resize(), transitioning || screen.activate()
            }, ScreenManager.prototype._transitionScreens = function(screen, transition) {
                this._isTransitioning = !0, transition.signalTransitionInComplete.addOnce(this._onTransitionInComplete, this), transition.signalTransitionOutComplete.addOnce(this._onTransitionOutComplete, this), transition.oldScreen = this.getCurrentScreen(screen.group), transition.screen = screen, transition.onTopofAllScreens && this._view.addChild(transition), transition.transitionIn()
            }, ScreenManager.prototype._onTransitionInComplete = function(transition) {
                transition.doReplacementsAtEnd || this._doReplacements(transition.screen), this._displayScreen(transition.screen, !0), transition.transitionOut()
            }, ScreenManager.prototype._onTransitionOutComplete = function(transition) {
                transition.doReplacementsAtEnd && this._doReplacements(transition.screen), transition.onTopofAllScreens && this._view.removeChild(transition), this._isTransitioning = !1, transition.screen.activate(), transition.dispose()
            }, ScreenManager.prototype.getStage = function() {
                return this._stage
            }, ScreenManager.prototype.getRenderer = function() {
                return this._renderer
            }, ScreenManager.prototype.getView = function() {
                return this._view
            }, ScreenManager.prototype.getHighestGroupDepth = function() {
                return this._view.children.length
            }, ScreenManager.prototype.getScreenGroup = function(groupName) {
                var group = this._groups[groupName];
                if (group) return group;
                throw Error("[ScreenManager.getScreenGroup] The group does not exist: " + groupName + ". Maybe the screen is not the correct.")
            }, ScreenManager.prototype.getCurrentScreen = function(groupName) {
                if (!groupName || !this._groups[groupName]) throw Error("[ScreenManager.getCurrentScreen] Error - The screen group is invalid: " + groupName);
                var group = this._groups[groupName];
                return group.children.length > 0 ? group.getChildAt(group.children.length - 1) : null
            }, ScreenManager.prototype.getAllScreens = function() {
                var arr = [];
                for (var key in this._groups)
                    if (this._groups.hasOwnProperty(key))
                        for (var group = this._groups[key], i = 0, len = group.screenArr.length; len > i; i++) {
                            var tempScreen = group.screenArr[i];
                            arr.push(tempScreen)
                        }
                    return arr
            }, ScreenManager.prototype.getAllGroups = function() {
                return this._groups
            }
        }, {
            "./../../utils/Utils": 58,
            "./Screen": 18,
            "./ScreenGroup": 19,
            "./ScreenParams": 21,
            "./transitions/Transition": 26
        }],
        21: [function(require, module, exports) {
            var ScreenParams = function() {
                this._group = "", this._replaceCurrent = !1, this._replaceAll = !1, this._replaceGroups = [], this._replaceScreens = [], this._transition = null, this.setReset()
            };
            module.exports = ScreenParams;
            ScreenParams.prototype;
            ScreenParams.prototype.setReset = function() {
                this._group = "", this._replaceCurrent = !1, this._replaceAll = !1, this._replaceGroups = [], this._replaceScreens = [], this._transition = null
            }, ScreenParams.prototype.group = function(group) {
                return this._group = group, this
            }, ScreenParams.prototype.replaceCurrent = function() {
                return this._replaceCurrent = !0, this
            }, ScreenParams.prototype.replaceAll = function() {
                return this._replaceAll = !0, this
            }, ScreenParams.prototype.replaceGroups = function(groupsArray) {
                return this._replaceGroups = groupsArray, this
            }, ScreenParams.prototype.replaceScreen = function(screensArray) {
                return this._replaceScreens = screensArray, this
            }, ScreenParams.prototype.transition = function(transition) {
                return this._transition = transition, this
            }
        }, {}],
        22: [function(require, module, exports) {
            var Transition = require("./Transition"),
                AlphaFade = (require("./../ScreenManager"), function(duration, delay, type) {
                    Transition.call(this), this.onTopofAllScreens = !1, this._duration = duration || 1, this._delay = delay || 0, this.transitionType = type || Transition.TRANSITION_IN_ONLY, this.transitionType === Transition.TRANSITION_IN_ONLY && (this.doReplacementsAtEnd = !0)
                });
            module.exports = AlphaFade, AlphaFade.prototype = Object.create(Transition.prototype), AlphaFade.prototype.constructor = AlphaFade, AlphaFade.VERSION = "01.00.00", AlphaFade.prototype.transitionIn = function() {
                switch (this.screen.alpha = 0, this.transitionType) {
                    case Transition.TRANSITION_IN_ONLY:
                        this.signalTransitionInComplete.dispatch(this);
                        break;
                    case Transition.TRANSITION_CROSS:
                        if (!this.oldScreen) throw Error("[AlphaFade] You are transitioning out but there is no oldScreen. ");
                        TweenMax.to(this.oldScreen, .5 * this._duration, {
                            delay: this._delay,
                            alpha: 0,
                            ease: Power2.easeIn,
                            onComplete: function() {
                                this.signalTransitionInComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        })
                }
            }, AlphaFade.prototype.transitionOut = function() {
                switch (this.transitionType) {
                    case Transition.TRANSITION_IN_ONLY:
                        TweenMax.to(this.screen, this._duration, {
                            delay: this._delay,
                            alpha: 1,
                            ease: Power2.easeOut,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        });
                        break;
                    case Transition.TRANSITION_CROSS:
                        this.screen.alpha = 0, TweenMax.to(this.screen, .5 * this._duration, {
                            delay: 0,
                            alpha: 1,
                            ease: Power1.easeOut,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        })
                }
            }
        }, {
            "./../ScreenManager": 20,
            "./Transition": 26
        }],
        23: [function(require, module, exports) {
            var Transition = require("./Transition"),
                ScreenManager = require("./../ScreenManager"),
                ColorFade = function(duration, color, pauseTime, delay, type) {
                    Transition.call(this), this.transitionType = type || Transition.TRANSITION_CROSS, this.onTopofAllScreens = !0, this._duration = duration || 1, this._color = "" + color || "#000000", this._pauseTime = pauseTime || 0, this._delay = delay || 0;
                    var renderer = ScreenManager.instance.getRenderer(),
                        graphic = new PIXI.Graphics;
                    graphic.beginFill(this._color, 1), graphic.drawRect(0, 0, Math.ceil(renderer.width * (1 / renderer.resolution)), Math.ceil(renderer.height * (1 / renderer.resolution))), this._overlay = new PIXI.Sprite(graphic.generateTexture(renderer.resolution)), this._overlay.alpha = 0, this.addChild(this._overlay)
                };
            module.exports = ColorFade, ColorFade.prototype = Object.create(Transition.prototype), ColorFade.prototype.constructor = ColorFade, ColorFade.VERSION = "01.00.01", ColorFade.prototype.transitionIn = function() {
                switch (this.transitionType) {
                    case Transition.TRANSITION_IN_ONLY:
                        this._overlay.alpha = 1, this.signalTransitionInComplete.dispatch(this);
                        break;
                    case Transition.TRANSITION_CROSS:
                        this._overlay.alpha = 0, TweenMax.to(this._overlay, .5 * this._duration, {
                            delay: this._delay,
                            alpha: 1,
                            ease: Power1.easeOut,
                            onComplete: function() {
                                this.signalTransitionInComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        })
                }
            }, ColorFade.prototype.transitionOut = function() {
                switch (this.transitionType) {
                    case Transition.TRANSITION_IN_ONLY:
                        TweenMax.to(this._overlay, this._duration, {
                            delay: this._delay + this._pauseTime,
                            alpha: 0,
                            ease: Power1.easeOut,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        });
                        break;
                    case Transition.TRANSITION_CROSS:
                        TweenMax.to(this._overlay, .5 * this._duration, {
                            delay: this._pauseTime,
                            alpha: 0,
                            ease: Power1.easeOut,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        })
                }
            }, ColorFade.prototype.dispose = function() {
                this.removeChildren(), this._overlay = null, Transition.prototype.dispose.call(this)
            }
        }, {
            "./../ScreenManager": 20,
            "./Transition": 26
        }],
        24: [function(require, module, exports) {
            var Transition = require("./Transition"),
                Slide = (require("./../ScreenManager"), function(duration, offsetX, offsetY, destX, destY, oldScreenDestX, oldScreenDestY, delay, type, customEaseIn, customEaseOut) {
                    Transition.call(this), this.transitionType = type || Transition.TRANSITION_CROSS, this._duration = duration, this._offset = new PIXI.Point(offsetX, offsetY), this._destination = new PIXI.Point(destX, destY), this._oldScreenDestination = new PIXI.Point(oldScreenDestX, oldScreenDestY), this._delay = delay || 0, this._customEaseInOut = Power2.easeInOut, this.onTopofAllScreens = !1, this.doReplacementsAtEnd = !0
                });
            module.exports = Slide, Slide.prototype = Object.create(Transition.prototype), Slide.prototype.constructor = Slide, Slide.VERSION = "01.00.00", Slide.prototype.transitionIn = function() {
                this.screen.x = this._offset.x, this.screen.y = this._offset.y, this.signalTransitionInComplete.dispatch(this)
            }, Slide.prototype.transitionOut = function() {
                switch (this.transitionType) {
                    case Transition.TRANSITION_IN_ONLY:
                        TweenMax.to(this.screen, this._duration, {
                            x: this._destination.x,
                            y: this._destination.y,
                            ease: this._customEaseInOut,
                            delay: this._delay,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        });
                        break;
                    case Transition.TRANSITION_CROSS:
                        this.oldScreen && TweenMax.to(this.oldScreen, this._duration, {
                            x: this._oldScreenDestination.x,
                            y: this._oldScreenDestination.y,
                            ease: this._customEaseInOut,
                            delay: this._delay,
                            onComplete: function() {
                                this.oldScreen.visible = !1
                            },
                            onCompleteScope: this
                        }), this.screen.x = this._offset.x, this.screen.y = this._offset.y, TweenMax.to(this.screen, this._duration, {
                            x: this._destination.x,
                            y: this._destination.y,
                            ease: this._customEaseInOut,
                            delay: this._delay,
                            onComplete: function() {
                                this.signalTransitionOutComplete.dispatch(this)
                            },
                            onCompleteScope: this
                        })
                }
            }
        }, {
            "./../ScreenManager": 20,
            "./Transition": 26
        }],
        25: [function(require, module, exports) {
            var Transition = require("./Transition"),
                Swipe = (require("./../ScreenManager"), function(display, duration, p0, p1, p2, easeIn, easeOut) {});
            module.exports = Swipe, Swipe.prototype = Object.create(Transition.prototype),
                Swipe.prototype.constructor = Swipe
        }, {
            "./../ScreenManager": 20,
            "./Transition": 26
        }],
        26: [function(require, module, exports) {
            var Transition = (require("./../Screen"), function() {
                PIXI.Container.call(this), this.signalTransitionInComplete = new signals.Signal, this.signalTransitionOutComplete = new signals.Signal, this.onTopofAllScreens = !0, this.doReplacementsAtEnd = !1, this.transitionType = Transition.TRANSITION_CROSS, this.screen = null, this.oldScreen = null
            });
            module.exports = Transition, Transition.prototype = Object.create(PIXI.Container.prototype), Transition.prototype.constructor = Transition, Transition.VERSION = "02.00.00", Transition.TRANSITION_IN_ONLY = "transition_in_only", Transition.TRANSITION_CROSS = "transition_cross", Transition.prototype.transitionIn = function() {
                this.signalTransitionInComplete.dispatch(this)
            }, Transition.prototype.transitionOut = function() {
                this.signalTransitionOutComplete.dispatch(this)
            }, Transition.prototype.dispose = function() {
                this.signalTransitionInComplete.removeAll(), this.signalTransitionInComplete = null, this.signalTransitionOutComplete.removeAll(), this.signalTransitionOutComplete = null, this.oldScreen = null, this.screen = null, this.removeChildren()
            }
        }, {
            "./../Screen": 18
        }],
        27: [function(require, module, exports) {
            var p3 = window.p3 || {};
            p3.AudioManager = require("./audio/AudioManager"), p3.BBCGel = require("./bbcgel/BBCGel"), p3.Particle = require("./display/particles/Particle"), p3.ParticleSystem = require("./display/particles/ParticleSystem"), p3.ScreenManager = require("./display/screenmanager/ScreenManager"), p3.ScreenGroup = require("./display/screenmanager/ScreenGroup"), p3.ScreenParams = require("./display/screenmanager/ScreenParams"), p3.Screen = require("./display/screenmanager/Screen"), p3.Transition = require("./display/screenmanager/transitions/Transition"), p3.AlphaFade = require("./display/screenmanager/transitions/AlphaFade"), p3.ColorFade = require("./display/screenmanager/transitions/ColorFade"), p3.Slide = require("./display/screenmanager/transitions/Slide"), p3.Swipe = require("./display/screenmanager/transitions/Swipe"), p3.AdditiveSprite = require("./display/AdditiveSprite"), p3.Button = require("./display/Button"), p3.MovieClip = require("./display/MovieClip"), p3.MovieClipSequence = require("./display/MovieClipSequence"), p3.MuteButton = require("./display/MuteButton"), p3.ToggleButton = require("./display/ToggleButton"), p3.Keyboard = require("./input/Keyboard"), p3.RandomSeed = require("./math/RandomSeed"), p3.Vector2 = require("./math/Vector2"), p3.BitmapText = require("./text/BitmapText"), p3.CharacterInfo = require("./text/CharacterInfo"), p3.FontAtlas = require("./text/FontAtlas"), p3.BaseMain = require("./utils/BaseMain"), p3.Camera = require("./utils/Camera"), p3.Color = require("./utils/Color"), p3.Device = require("./utils/Device"), p3.ObjectPool = require("./utils/ObjectPool"), p3.Sorting = require("./utils/Sorting"), p3.Timer = require("./utils/Timer"), p3.Utils = require("./utils/Utils"), p3.Animator = require("./Animator"), p3.AssetManager = require("./AssetManager"), p3.Canvas = require("./Canvas"), p3.CanvasParams = require("./CanvasParams"), p3.Timestep = require("./Timestep"), p3.View = require("./View"), p3.ViewParams = require("./ViewParams"), p3.Tracking = require("./net/tracking/Tracking"), p3.TrackingData = require("./net/tracking/TrackingData"), p3.TrackingDataBBCAction = require("./net/tracking/TrackingDataBBCAction"), p3.TrackingDataBBCAction = require("./net/tracking/TrackingDataEcho"), p3.TrackingDataGoogleEvent = require("./net/tracking/TrackingDataGoogleEvent"), p3.TrackingDataGooglePage = require("./net/tracking/TrackingDataGooglePage"), p3.TrackingDataPlaydom = require("./net/tracking/TrackingDataPlaydom"), p3.TrackingDataPlaydomDeviceInfo = require("./net/tracking/TrackingDataPlaydomDeviceInfo"), p3.TrackingDataPlaydomGameAction = require("./net/tracking/TrackingDataPlaydomGameAction"), p3.TrackingDataPlaydomNavigationAction = require("./net/tracking/TrackingDataPlaydomNavigationAction"), p3.TrackingModule = require("./net/tracking/TrackingModule"), p3.TrackingModuleBBC = require("./net/tracking/TrackingModuleBBC"), p3.TrackingModuleEcho = require("./net/tracking/TrackingModuleEcho"), p3.TrackingModuleGoogle = require("./net/tracking/TrackingModuleGoogle"), p3.TrackingModulePlaydom = require("./net/tracking/TrackingModulePlaydom"), window.p3 = p3
        }, {
            "./Animator": 1,
            "./AssetManager": 2,
            "./Canvas": 3,
            "./CanvasParams": 4,
            "./Timestep": 5,
            "./View": 6,
            "./ViewParams": 7,
            "./audio/AudioManager": 8,
            "./bbcgel/BBCGel": 9,
            "./display/AdditiveSprite": 10,
            "./display/Button": 11,
            "./display/MovieClip": 12,
            "./display/MovieClipSequence": 13,
            "./display/MuteButton": 14,
            "./display/ToggleButton": 15,
            "./display/particles/Particle": 16,
            "./display/particles/ParticleSystem": 17,
            "./display/screenmanager/Screen": 18,
            "./display/screenmanager/ScreenGroup": 19,
            "./display/screenmanager/ScreenManager": 20,
            "./display/screenmanager/ScreenParams": 21,
            "./display/screenmanager/transitions/AlphaFade": 22,
            "./display/screenmanager/transitions/ColorFade": 23,
            "./display/screenmanager/transitions/Slide": 24,
            "./display/screenmanager/transitions/Swipe": 25,
            "./display/screenmanager/transitions/Transition": 26,
            "./input/Keyboard": 28,
            "./math/RandomSeed": 29,
            "./math/Vector2": 30,
            "./net/tracking/Tracking": 31,
            "./net/tracking/TrackingData": 32,
            "./net/tracking/TrackingDataBBCAction": 33,
            "./net/tracking/TrackingDataEcho": 34,
            "./net/tracking/TrackingDataGoogleEvent": 35,
            "./net/tracking/TrackingDataGooglePage": 36,
            "./net/tracking/TrackingDataPlaydom": 37,
            "./net/tracking/TrackingDataPlaydomDeviceInfo": 38,
            "./net/tracking/TrackingDataPlaydomGameAction": 39,
            "./net/tracking/TrackingDataPlaydomNavigationAction": 40,
            "./net/tracking/TrackingModule": 41,
            "./net/tracking/TrackingModuleBBC": 42,
            "./net/tracking/TrackingModuleEcho": 43,
            "./net/tracking/TrackingModuleGoogle": 44,
            "./net/tracking/TrackingModulePlaydom": 45,
            "./text/BitmapText": 46,
            "./text/CharacterInfo": 47,
            "./text/FontAtlas": 48,
            "./utils/BaseMain": 49,
            "./utils/Camera": 50,
            "./utils/Color": 53,
            "./utils/Device": 54,
            "./utils/ObjectPool": 55,
            "./utils/Sorting": 56,
            "./utils/Timer": 57,
            "./utils/Utils": 58
        }],
        28: [function(require, module, exports) {
            var Keyboard = (require("./../Canvas"), function() {
                Keyboard.signalKeyDown = new signals.Signal, Keyboard.signalKeyUp = new signals.Signal
            });
            module.exports = Keyboard, Keyboard.prototype.constructor = Keyboard, Keyboard._keysDown = {}, Keyboard._keysDownPerFrame = {}, Keyboard.KEY_TAB = 9, Keyboard.KEY_ENTER = 13, Keyboard.KEY_SHIFT = 16, Keyboard.KEY_CTRL = 17, Keyboard.KEY_SPACE = 32, Keyboard.KEY_LEFT = 37, Keyboard.KEY_UP = 38, Keyboard.KEY_RIGHT = 39, Keyboard.KEY_DOWN = 40, Keyboard.KEY_A = 65, Keyboard.KEY_B = 66, Keyboard.KEY_C = 67, Keyboard.KEY_D = 68, Keyboard.KEY_E = 69, Keyboard.KEY_F = 70, Keyboard.KEY_G = 71, Keyboard.KEY_H = 72, Keyboard.KEY_I = 73, Keyboard.KEY_J = 74, Keyboard.KEY_K = 75, Keyboard.KEY_L = 76, Keyboard.KEY_M = 77, Keyboard.KEY_N = 78, Keyboard.KEY_O = 79, Keyboard.KEY_P = 80, Keyboard.KEY_Q = 81, Keyboard.KEY_R = 82, Keyboard.KEY_S = 83, Keyboard.KEY_T = 84, Keyboard.KEY_U = 85, Keyboard.KEY_V = 86, Keyboard.KEY_W = 87, Keyboard.KEY_X = 88, Keyboard.KEY_Y = 89, Keyboard.KEY_Z = 90, Keyboard.KEY_PLUs = 187, Keyboard.KEY_MINUS = 189, Keyboard.init = function(window) {
                document.addEventListener("keyup", function(event) {
                    Keyboard._onKeyup(event)
                }, !1), document.addEventListener("keydown", function(event) {
                    Keyboard._onKeydown(event)
                }, !1)
            }, Keyboard.getKey = function(keyCode) {
                return Keyboard._keysDown[keyCode]
            }, Keyboard.getKeyDown = function(keyCode) {
                return Keyboard._keysDownPerFrame[keyCode]
            }, Keyboard.update = function() {
                Keyboard._keysDownPerFrame = {}
            }, Keyboard._onKeydown = function(event) {
                Keyboard._keysDown[event.keyCode] || (Keyboard._keysDown[event.keyCode] = !0, Keyboard._keysDownPerFrame[event.keyCode] = !0, Keyboard.signalKeyDown && Keyboard.signalKeyDown.dispatch(event.keyCode))
            }, Keyboard._onKeyup = function(event) {
                delete Keyboard._keysDown[event.keyCode], delete Keyboard._keysDownPerFrame[event.keyCode], Keyboard.signalKeyUp && Keyboard.signalKeyUp.dispatch(event.keyCode)
            }
        }, {
            "./../Canvas": 3
        }],
        29: [function(require, module, exports) {
            var RandomSeed = function() {
                this.seed = 1
            };
            module.exports = RandomSeed, RandomSeed.prototype.nextInt = function() {
                return this._gen()
            }, RandomSeed.prototype.nextDouble = function() {
                return this._gen() / 2147483647
            }, RandomSeed.prototype.nextIntRange = function(min, max) {
                return min -= .4999, max += .4999, Math.abs(Math.round(min + (max - min) * this.nextDouble()))
            }, RandomSeed.prototype.nextDoubleRange = function(min, max) {
                return min + (max - min) * this.nextDouble()
            }, RandomSeed.prototype._gen = function() {
                return Math.abs(this.seed = 16807 * this.seed % 2147483647)
            }
        }, {}],
        30: [function(require, module, exports) {
            var Vector2 = function(x, y) {
                this.x = x || 0, this.y = y || 0
            };
            module.exports = Vector2, Vector2.VERSION = "1.0.1", Vector2.prototype.add = function(vector) {
                return new p3.Vector2(this.x + vector.x, this.y + vector.y)
            }, Vector2.prototype.subtract = function(vector) {
                return new p3.Vector2(this.x - vector.x, this.y - vector.y)
            }, Vector2.prototype.scale = function(scalar) {
                return new p3.Vector2(this.x * scalar, this.y * scalar)
            }, Vector2.prototype.incrementBy = function(vector) {
                this.x = this.x + vector.x, this.y = this.y + vector.y
            }, Vector2.prototype.decrementBy = function(vector) {
                this.x = this.x - vector.x, this.y = this.y - vector.y
            }, Vector2.prototype.scaleBy = function(scalar) {
                this.x = this.x * scalar, this.y = this.y * scalar
            }, Vector2.prototype.normalize = function(length) {
                var l = this.length;
                l > 0 && (this.x = this.x / l * length, this.y = this.y / l * length)
            }, Vector2.prototype.truncate = function(length) {
                var l = this.length;
                l > length && (this.x = this.x / l * length, this.y = this.y / l * length)
            }, Vector2.prototype.dotProduct = function(vector) {
                return this.x * vector.x + this.y * vector.y
            }, Vector2.prototype.perpProduct = function(vector) {
                return -this.y * vector.x + this.x * vector.y
            }, Vector2.prototype.clone = function() {
                return new p3.Vector2(this.x, this.y)
            }, Object.defineProperty(Vector2.prototype, "length", {
                get: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                }
            }), Object.defineProperty(Vector2.prototype, "lengthSq", {
                get: function() {
                    return this.x * this.x + this.y * this.y
                }
            }), Object.defineProperty(Vector2.prototype, "unit", {
                get: function() {
                    var length = this.length;
                    return new p3.Vector2(this.x / length, this.y / length)
                }
            })
        }, {}],
        31: [function(require, module, exports) {
            var Tracking = function() {
                this._module = null
            };
            module.exports = Tracking, Tracking.DEBUG = !1, Tracking.prototype.init = function(module) {
                this._module = module
            }, Tracking.prototype.track = function(data) {
                this._module.track(data), Tracking.DEBUG && console.log("Track sent - ", data)
            }
        }, {}],
        32: [function(require, module, exports) {
            var TrackingData = function() {};
            module.exports = TrackingData
        }, {}],
        33: [function(require, module, exports) {
            var TrackingData = require("./TrackingData"),
                TrackingDataBBCAction = function(name, type, params) {
                    TrackingData.call(this), this._name = name, this._type = type, this._params = params
                };
            module.exports = TrackingDataBBCAction, TrackingDataBBCAction.prototype = Object.create(TrackingData), TrackingDataBBCAction.prototype.constructor = TrackingDataBBCAction, Object.defineProperty(TrackingDataBBCAction.prototype, "name", {
                get: function() {
                    return this._name
                }
            }), Object.defineProperty(TrackingDataBBCAction.prototype, "type", {
                get: function() {
                    return this._type
                }
            }), Object.defineProperty(TrackingDataBBCAction.prototype, "params", {
                get: function() {
                    return this._params
                }
            })
        }, {
            "./TrackingData": 32
        }],
        34: [function(require, module, exports) {
            var TrackingData = require("./TrackingData"),
                TrackingDataEcho = function(name, type, params) {
                    TrackingData.call(this), this._name = name, this._type = type, this._params = params
                };
            module.exports = TrackingDataEcho, TrackingDataEcho.prototype = Object.create(TrackingData.prototype), TrackingDataEcho.prototype.constructor = TrackingDataEcho, Object.defineProperty(TrackingDataEcho.prototype, "name", {
                get: function() {
                    return this._name
                }
            }), Object.defineProperty(TrackingDataEcho.prototype, "type", {
                get: function() {
                    return this._type
                }
            }), Object.defineProperty(TrackingDataEcho.prototype, "params", {
                get: function() {
                    return this._params
                }
            })
        }, {
            "./TrackingData": 32
        }],
        35: [function(require, module, exports) {
            var TrackingData = require("./TrackingData"),
                TrackingDataGoogleEvent = (require("./TrackingModuleGoogle"), function(category, action, label, value) {
                    this.category = category, this.action = action, this.label = label, this.value = value
                });
            module.exports = TrackingDataGoogleEvent, TrackingDataGoogleEvent.prototype = Object.create(TrackingData), TrackingDataGoogleEvent.prototype.constructor = TrackingDataGoogleEvent
        }, {
            "./TrackingData": 32,
            "./TrackingModuleGoogle": 44
        }],
        36: [function(require, module, exports) {
            var TrackingData = require("./TrackingData"),
                TrackingDataGooglePage = (require("./TrackingModuleGoogle"), function(page) {
                    this.page = page
                });
            module.exports = TrackingDataGooglePage, TrackingDataGooglePage.prototype = Object.create(TrackingData), TrackingDataGooglePage.prototype.constructor = TrackingDataGooglePage
        }, {
            "./TrackingData": 32,
            "./TrackingModuleGoogle": 44
        }],
        37: [function(require, module, exports) {
            TrackingDataPlaydom = function() {
                this.tag = null
            }, module.exports = TrackingDataPlaydom, TrackingDataPlaydom.prototype.getParams = function(object) {
                return {}
            }
        }, {}],
        38: [function(require, module, exports) {
            function TrackingDataPlaydomDeviceInfo(machine, model, osVersion, mToken, deviceId, iosVendorId, iosAdvertisingId, googAdvertisingId) {
                this.tag = "device_info", this.machine = machine || "NULL", this.model = model || "NULL", this.osVersion = osVersion || "NULL", this.mToken = mToken || "NULL", this.deviceId = deviceId || "NULL", this.iosVendorId = iosVendorId || "NULL", this.iosAdvertisingId = iosAdvertisingId || "NULL", this.googAdvertisingId = googAdvertisingId || "NULL"
            }
            var TrackingDataPlaydom = require("./TrackingDataPlaydom");
            module.exports = TrackingDataPlaydomDeviceInfo, TrackingDataPlaydomDeviceInfo.prototype = Object.create(TrackingDataPlaydom.prototype), TrackingDataPlaydomDeviceInfo.prototype.constructor = TrackingDataPlaydomDeviceInfo, TrackingDataPlaydomDeviceInfo.prototype.getParams = function(object) {
                return object = object || {}, object.tag = this.tag, object.machine = this.machine, object.model = this.model, object.osVersion = this.osVersion, object.mToken = this.mToken, object.deviceId = this.deviceId, object.iosVendorId = this.iosVendorId, object.iosAdvertisingId = this.iosAdvertisingId, object.googAdvertisingId = this.googAdvertisingId, object
            }
        }, {
            "./TrackingDataPlaydom": 37
        }],
        39: [function(require, module, exports) {
            function TrackingDataPlaydomGameAction(context, action, message) {
                this.tag = "game_action", this.context = context, this.action = action, this.message = message
            }
            var TrackingDataPlaydom = require("./TrackingDataPlaydom");
            module.exports = TrackingDataPlaydomGameAction, TrackingDataPlaydomGameAction.prototype = Object.create(TrackingDataPlaydom.prototype), TrackingDataPlaydomGameAction.prototype.constructor = TrackingDataPlaydomGameAction, TrackingDataPlaydomGameAction.prototype.getParams = function(object) {
                return object = object || {}, object.tag = this.tag, object.context = this.context, object.action = this.action, object.message = this.message, object
            }
        }, {
            "./TrackingDataPlaydom": 37
        }],
        40: [function(require, module, exports) {
            function TrackingDataPlaydomNavigationAction(context, action) {
                this.tag = "navigation_action", this.context = context, this.action = action
            }
            var TrackingDataPlaydom = require("./TrackingDataPlaydom");
            module.exports = TrackingDataPlaydomNavigationAction, TrackingDataPlaydomNavigationAction.prototype = Object.create(TrackingDataPlaydom.prototype), TrackingDataPlaydomNavigationAction.prototype.constructor = TrackingDataPlaydomNavigationAction, TrackingDataPlaydomNavigationAction.prototype.getParams = function(object) {
                return object = object || {}, object.tag = this.tag, object.context = this.context, object.action = this.action, object
            }
        }, {
            "./TrackingDataPlaydom": 37
        }],
        41: [function(require, module, exports) {
            var TrackingModule = function() {};
            module.exports = TrackingModule, TrackingModule.track = function(data) {}, TrackingModule.isScriptFound = function() {
                return !1
            }
        }, {}],
        42: [function(require, module, exports) {
            var TrackingModule = require("./TrackingModule"),
                TrackingModuleBBC = function(library, gameName, environment, counterName, devTag) {
                    this.window = window.top || window, TrackingModuleBBC.DEV_lib = this.trackingLib = library, this.isScriptFound() && (devTag ? TrackingModuleBBC.DEV_statsLogger = this.statsLogger = this.trackingLib.create(gameName, environment, counterName, devTag) : TrackingModuleBBC.DEV_statsLogger = this.statsLogger = this.trackingLib.create(gameName, environment, counterName))
                };
            module.exports = TrackingModuleBBC, TrackingModuleBBC.prototype = Object.create(TrackingModule), TrackingModuleBBC.prototype.constructor = TrackingModuleBBC, TrackingModuleBBC.DEV_lib = null, TrackingModuleBBC.DEV_statsLogger = null, TrackingModuleBBC.TYPE_PAGE = "page", TrackingModuleBBC.TYPE_EVENT = "event", TrackingModuleBBC.prototype.track = function(data) {
                this.isScriptFound() && (!data || !data.action_name || !data.action_type, this.statsLogger.logAction(data.action_name, data.action_type, data.params)), data.action_name = null, data.action_type = null, data.params = null, data = null
            }, TrackingModuleBBC.prototype.isScriptFound = function() {
                return this.trackingLib ? !0 : !1
            }
        }, {
            "./TrackingModule": 41
        }],
        43: [function(require, module, exports) {
            var TrackingModule = require("./TrackingModule"),
                TrackingModuleEcho = function() {
                    TrackingModule.call(this)
                };
            module.exports = TrackingModuleEcho, TrackingModuleEcho.prototype = Object.create(TrackingModule.prototype), TrackingModuleEcho.prototype.constructor = TrackingModuleEcho, TrackingModuleEcho.prototype.track = function(data) {
                window.stats && window.stats.logUserActionEvent(data.name, data.type, data.params)
            }
        }, {
            "./TrackingModule": 41
        }],
        44: [function(require, module, exports) {
            var TrackingModule = require("./TrackingModule"),
                TrackingDataGoogleEvent = require("./TrackingDataGoogleEvent"),
                TrackingDataGooglePage = require("./TrackingDataGooglePage"),
                TrackingModuleGoogle = function(code, site) {
                    this.window = window.top || window, this.isScriptFound() && this.window.ga("create", code, site)
                };
            module.exports = TrackingModuleGoogle, TrackingModuleGoogle.prototype = Object.create(TrackingModule), TrackingModuleGoogle.prototype.constructor = TrackingModuleGoogle, TrackingModuleGoogle.prototype.track = function(data) {
                this.isScriptFound() && (data instanceof TrackingDataGooglePage ? this.window.ga("send", {
                    hitType: "pageview",
                    page: "/" + data.page,
                    title: data.page
                }) : data instanceof TrackingDataGoogleEvent && this.window.ga("send", {
                    hitType: "event",
                    eventCategory: data.category,
                    eventAction: data.action,
                    eventLabel: data.label,
                    eventValue: data.value
                }))
            }, TrackingModuleGoogle.prototype.isScriptFound = function() {
                return this.window.ga ? !0 : (console.warn("[p3.Tracking] Google Analytics script is not found on the page."), !1)
            }
        }, {
            "./TrackingDataGoogleEvent": 35,
            "./TrackingDataGooglePage": 36,
            "./TrackingModule": 41
        }],
        45: [function(require, module, exports) {
            function TrackingModulePlaydom(app, appLocale, network, viewNetwork, authorizationId) {
                this._app = app, this._appLocale = appLocale, this._network = network, this._viewNetwork = viewNetwork, this._authorizationId = authorizationId, this._browserId = window.localStorage.browserId ? window.localStorage.browserId : this.generateKey(), window.localStorage.browserId = this._browserId, this._transactionId = this.generateKey()
            }
            module.exports = TrackingModulePlaydom, TrackingModulePlaydom.prototype.track = function(data) {
                var url = "#",
                    params = {};
                params.app = this._app, params.user_id = this._browserId, params.app_locale = this._appLocale, params.transaction_id = this._transactionId, params.browserId = this._browserId, params.network = this._network, params.view_network = this._viewNetwork;
                var str = JSON.stringify(data.getParams(params));
                console.log(str);
                var request = new XMLHttpRequest;
                request.open("POST", url, !0), request.setRequestHeader("Content-Type", "application/json"), request.setRequestHeader("Authorization", this._authorizationId), request.send(str)
            }, TrackingModulePlaydom.prototype.generateKey = function() {
                var key = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
                return key.replace(/[xy]/g, function(c) {
                    var r = 16 * Math.random() | 0,
                        v = "x" == c ? r : 3 & r | 8;
                    return v.toString(16)
                })
            }
        }, {}],
        46: [function(require, module, exports) {
            var BitmapText = (require("./FontAtlas"), function(text, atlas, align, color) {
                if (this.multiline = !0, this.autoKern = !0, this._text = "", this._textAlign = align || BitmapText.ALIGN_LEFT, this._textColor = void 0 != color ? color : 16777215, this._fontAtlas = atlas, this._letterSpacing = 0, this._lines = null, this._numOfLines = 0, !this._fontAtlas) throw new Error("Font atlas is invalid!");
                PIXI.Container.call(this), this.text = text
            });
            module.exports = BitmapText, BitmapText.prototype = Object.create(PIXI.Container.prototype), BitmapText.prototype.constructor = BitmapText, BitmapText.VERSION = "1.0.1", BitmapText.DEBUG = !1, BitmapText.ALIGN_CENTER = "center", BitmapText.ALIGN_LEFT = "left", BitmapText.ALIGN_RIGHT = "right", BitmapText.prototype.calculateLines = function() {
                if (this._text || BitmapText.DEBUG && console.warn("[BitmapText] this._text is null."), this._lines = [], this.multiline) {
                    var charCode, nextCharCode, charInfo, currentLine, index = 0,
                        kerning = 0,
                        xPosition = 0;
                    this._numOfLines = 0;
                    var i = 0,
                        length = this._text.length;
                    if (length > 1)
                        for (; length - 1 > i;) {
                            if (charCode = this._text.charCodeAt(i), charCode != BitmapTextASCII.LINE_FEED) {
                                try {
                                    charInfo = this._fontAtlas.getCharacterInfo(charCode)
                                } catch (error) {
                                    charInfo = this._fontAtlas.getCharacterInfo(32), BitmapText.DEBUG && console.warn("[BitmapText] Character '" + String.fromCharCode(charCode) + "' (" + charCode + ") not found!")
                                }
                                i < this._text.length && this.autoKern ? (nextCharCode = this._text.charCodeAt(i + 1), kerning = this._fontAtlas.getKerning(charCode, nextCharCode)) : kerning = 0, xPosition += charInfo.getXAdvance() + kerning + this._letterSpacing
                            } else currentLine = this._text.substring(index, i), this._lines.push(currentLine), ++this._numOfLines, xPosition = 0, index = i + 1;
                            ++i
                        }
                    length > index && (currentLine = this._text.substring(index, length), this._lines.push(currentLine), ++this._numOfLines)
                } else this._numOfLines = 1
            }, BitmapText.prototype.renderGlyph = function(charCode, x, y) {
                var charInfo;
                try {
                    charInfo = this._fontAtlas.getCharacterInfo(charCode)
                } catch (error) {
                    charInfo = this._fontAtlas.getCharacterInfo(32)
                }
                var glyph = new PIXI.Sprite(charInfo.getTexture());
                glyph.x = x + charInfo.getXOffset(), glyph.y = y + charInfo.getYOffset(), glyph.tint = this._textColor, this.addChild(glyph)
            }, BitmapText.prototype.renderText = function() {
                if (this.getLineHeight() <= 0) throw new Error("[BitmapText] Invalid text field dimensions!");
                var i, j, length, charCode, nextCharCode, charInfo, glyphX = 0,
                    glyphY = 0,
                    kerning = 0,
                    xPosition = 0,
                    currentLineWidth = 0;
                if (this.removeChildren(), this.multiline) {
                    var currentLine = null,
                        currentLineLength = null;
                    for (i = 0; i < this._numOfLines; ++i)
                        for (xPosition = 0, currentLine = this._lines[i], currentLineWidth = this.getLineWidth(currentLine), currentLineLength = currentLine.length, j = 0; currentLineLength > j; ++j) {
                            charCode = currentLine.charCodeAt(j);
                            try {
                                charInfo = this._fontAtlas.getCharacterInfo(charCode)
                            } catch (error) {
                                charInfo = this._fontAtlas.getCharacterInfo(32)
                            }
                            if (charCode != BitmapTextASCII.SPACE) {
                                switch (i < this._text.length && this.autoKern ? (nextCharCode = this._text.charCodeAt(i + 1), kerning = this._fontAtlas.getKerning(charCode, nextCharCode)) : kerning = 0, this._textAlign) {
                                    case BitmapText.ALIGN_LEFT:
                                        glyphX = xPosition;
                                        break;
                                    case BitmapText.ALIGN_RIGHT:
                                        glyphX = xPosition - currentLineWidth;
                                        break;
                                    case BitmapText.ALIGN_CENTER:
                                        glyphX = xPosition - .5 * currentLineWidth;
                                        break;
                                    default:
                                        throw new Error("[BitmapText] Invalid text alignment!")
                                }
                                glyphX = Math.floor(glyphX), glyphY = Math.floor(i * this.getLineHeight()), this.renderGlyph(charCode, glyphX, glyphY), xPosition += charInfo.getXAdvance() + kerning + this._letterSpacing
                            } else xPosition += charInfo.getXAdvance() + this._letterSpacing
                        }
                } else
                    for (currentLineWidth = this.getLineWidth(this._text), length = this._text.length, i = 0; length > i; ++i)
                        if (charCode = this._text.charCodeAt(i), charCode != BitmapTextASCII.LINE_FEED) {
                            try {
                                charInfo = this._fontAtlas.getCharacterInfo(charCode)
                            } catch (error) {
                                charInfo = this._fontAtlas.getCharacterInfo(32)
                            }
                            if (charCode != BitmapTextASCII.SPACE) {
                                switch (i < this._text.length && this.autoKern ? (nextCharCode = this._text.charCodeAt(i + 1), kerning = this._fontAtlas.getKerning(charCode, nextCharCode)) : kerning = 0, this._textAlign) {
                                    case BitmapText.ALIGN_LEFT:
                                        glyphX = xPosition;
                                        break;
                                    case BitmapText.ALIGN_RIGHT:
                                        glyphX = xPosition - currentLineWidth;
                                        break;
                                    case BitmapText.ALIGN_CENTER:
                                        glyphX = xPosition - .5 * currentLineWidth;
                                        break;
                                    default:
                                        throw new Error("[BitmapText] Invalid text alignment!")
                                }
                                glyphX = Math.floor(glyphX), this.renderGlyph(charCode, glyphX, glyphY), xPosition += charInfo.getXAdvance() + kerning + this._letterSpacing
                            } else xPosition += charInfo.getXAdvance() + this._letterSpacing
                        }
            }, Object.defineProperty(BitmapText.prototype, "text", {
                get: function() {
                    return this._text
                },
                set: function(value) {
                    value !== this._text && (this._text = value, this.calculateLines(), this.renderText())
                }
            }), Object.defineProperty(BitmapText.prototype, "textColor", {
                get: function() {
                    return this._textColor
                },
                set: function(value) {
                    value !== this._textColor && (this._textColor = value, this.calculateLines(), this.renderText())
                }
            }), Object.defineProperty(BitmapText.prototype, "letterSpacing", {
                get: function() {
                    return this._letterSpacing
                },
                set: function(value) {
                    value != this._letterSpacing && (this._letterSpacing = value, this.calculateLines(), this.renderText())
                }
            }), BitmapText.prototype.getFontAtlas = function() {
                return this._fontAtlas
            }, BitmapText.prototype.getFontName = function() {
                return null != this._fontAtlas ? this._fontAtlas.font.info.face : ""
            }, BitmapText.prototype.getFontSize = function() {
                return null != this._fontAtlas ? this._fontAtlas.font.info.size : 0
            }, BitmapText.prototype.getNumOfLines = function() {
                return this._numOfLines
            }, BitmapText.prototype.getLineWidth = function(string) {
                for (var width = 0, charCode = null, nextCharCode = null, charInfo = null, kerning = null, length = string.length, i = 0; length > i; ++i)
                    if (charCode = string.charCodeAt(i), charCode != BitmapTextASCII.LINE_FEED) {
                        try {
                            charInfo = this._fontAtlas.getCharacterInfo(charCode)
                        } catch (error) {
                            charInfo = this._fontAtlas.getCharacterInfo(32)
                        }
                        i < this._text.length && this.autoKern ? (nextCharCode = this._text.charCodeAt(i + 1), kerning = this._fontAtlas.getKerning(charCode, nextCharCode)) : kerning = 0, width += charInfo.getXAdvance() + kerning + this._letterSpacing
                    }
                return width
            }, BitmapText.prototype.getLineHeight = function() {
                return this.lineHeight > 0 ? this.lineHeight : this._fontAtlas.getFont().common.lineHeight
            };
            var BitmapTextASCII = function() {};
            BitmapTextASCII.LINE_FEED = 10, BitmapTextASCII.SPACE = 32
        }, {
            "./FontAtlas": 48
        }],
        47: [function(require, module, exports) {
            var CharacterInfo = function(data, texture) {
                this._id = parseInt(data.id), this._xAdvance = parseInt(data.xadvance), this._x = parseInt(data.x), this._y = parseInt(data.y), this._width = parseInt(data.width), this._height = parseInt(data.height), this._xOffset = parseInt(data.xoffset), this._yOffset = parseInt(data.yoffset), this._letter = data.letter, this._spriteName = texture
            };
            module.exports = CharacterInfo, CharacterInfo.VERSION = "1.0.0", CharacterInfo.prototype.getId = function() {
                return this._id
            }, CharacterInfo.prototype.getXAdvance = function() {
                return this._xAdvance
            }, CharacterInfo.prototype.getX = function() {
                return this._x
            }, CharacterInfo.prototype.getY = function() {
                return this._y
            }, CharacterInfo.prototype.getWidth = function() {
                return this._width
            }, CharacterInfo.prototype.getHeight = function() {
                return this._height
            }, CharacterInfo.prototype.getXOffset = function() {
                return this._xOffset
            }, CharacterInfo.prototype.getYOffset = function() {
                return this._yOffset
            }, CharacterInfo.prototype.getLetter = function() {
                return this._letter
            }, CharacterInfo.prototype.getTexture = function() {
                return this._spriteName
            }
        }, {}],
        48: [function(require, module, exports) {
            var CharacterInfo = require("./CharacterInfo"),
                FontAtlas = function(name, data, texture) {
                    this._name = name, this._data = data, this._spriteName = texture, this._font = null, this._charInfo = {}, this._kerningMap = {}, this.parseData(data)
                };
            module.exports = FontAtlas, FontAtlas.VERSION = "1.0.0", FontAtlas.prototype.parseData = function(data) {
                if (!data || !data.font) throw Error("[FontAtlas] parseData: There is a problem with the data:", data);
                this._font = data.font;
                for (var character, info, texture, charCount = this._font.chars["char"].length, i = 0; charCount > i; ++i) character = this._font.chars["char"][i], texture = new PIXI.Texture(this._spriteName.baseTexture, new PIXI.Rectangle(parseInt(character.x), parseInt(character.y), parseInt(character.width), parseInt(character.height))), info = new CharacterInfo(character, texture), this._charInfo[character.id] = info;
                this.mapKernings()
            }, FontAtlas.prototype.mapKernings = function() {
                var kernings = this._font.kernings;
                if (kernings)
                    for (var kernCount = kernings.length, i = 0; 127 > i; ++i)
                        for (var j = 0; kernCount > j; ++j) {
                            var kerning = kernings[j];
                            kerning.first == i && (void 0 == this._kerningMap[i] && (this._kerningMap[i] = {}), this._kerningMap[i][kerning.second] = kerning.amount)
                        }
            }, FontAtlas.prototype.getName = function() {
                return this._name
            }, FontAtlas.prototype.getData = function() {
                return this._data
            }, FontAtlas.prototype.getTexture = function() {
                return this._spriteName
            }, FontAtlas.prototype.getFont = function() {
                return this._font
            }, FontAtlas.prototype.getSize = function() {
                return this._font.info.size
            }, FontAtlas.prototype.getCharacterInfo = function(charCode) {
                if (null == this._charInfo[charCode]) throw new Error("CharacterInfo not found!");
                return this._charInfo[charCode]
            }, FontAtlas.prototype.getCharacterCount = function() {
                return this._data.font.chars["char"].length
            }, FontAtlas.prototype.getKerning = function(first, second) {
                var amount = 0;
                return void 0 != this._kerningMap[first] && void 0 != this._kerningMap[first][second] && (amount = this._kerningMap[first][second]), amount
            }
        }, {
            "./CharacterInfo": 47
        }],
        49: [function(require, module, exports) {
            var Device = require("./Device"),
                Canvas = require("./../Canvas"),
                Timestep = require("./../Timestep"),
                AssetManager = require("./../AssetManager"),
                Keyboard = require("./../input/Keyboard"),
                ScreenManager = require("./../display/screenmanager/ScreenManager"),
                Animator = require("./../Animator"),
                BaseMain = function(canvasParams, fps, resolution) {
                    this.signalPreloaderAssetsComplete = new signals.Signal, this.signalCanvasReady = new signals.Signal, this.signalCanvasResize = new signals.Signal, this.signalLoadProgress = new signals.Signal, this.signalLoadComplete = new signals.Signal, this._canvasParams = canvasParams, this._fps = fps || 60, this._resolution = resolution || 1, this._stage = null, this._renderer = null, this._canvas = new Canvas(this._canvasParams), this._canvas.signalChange.add(this._onCanvasResize, this), this._canvas.signalReady.add(this._onCanvasReady, this), this._timestep = new Timestep(2)
                };
            module.exports = BaseMain, BaseMain.animator = null, BaseMain.prototype.init = function() {
                this._assetManager = AssetManager.instance, this._canvas.init(), BaseMain.animator = new Animator, BaseMain.animator.init()
            }, BaseMain.prototype.loadPreloaderAssets = function(filesToLoad, basePath) {
                filesToLoad && filesToLoad.length > 0 ? (this._assetManager.addFiles(filesToLoad, basePath), this._assetManager.signalCompleted.add(function() {
                    this.signalPreloaderAssetsComplete.dispatch()
                }, this), this._assetManager.load()) : this.signalPreloaderAssetsComplete.dispatch()
            }, BaseMain.prototype.load = function(filesToLoad, basePath) {
                basePath = basePath || "", this._assetManager.addFiles(filesToLoad, basePath), this._assetManager.signalCompleted.add(this._onLoadComplete, this), this._assetManager.signalProgress.add(this._onLoadProgress, this), this._assetManager.load(.5)
            }, BaseMain.prototype._update = function() {
                this._screenManager.update(), BaseMain.animator.update(), Keyboard.update()
            }, BaseMain.prototype._render = function() {
                this._renderer.render(this._stage)
            }, BaseMain.prototype._onCanvasReady = function() {
                var options = {
                    view: Canvas.canvasElement,
                    transparent: !1,
                    antialias: !1,
                    preserveDrawingBuffer: !1,
                    autoResize: !1,
                    resolution: this._resolution
                };
                Canvas.stage = this._stage = new PIXI.Container, Canvas.params.forceCanvasMode || Device.isAndroidStockBrowser && Canvas.params.stockAndroidCanvasMode ? this._renderer = new PIXI.CanvasRenderer(Canvas.width, Canvas.height, options) : this._renderer = new PIXI.autoDetectRenderer(Canvas.width, Canvas.height, options), Canvas.renderer = this._renderer, Canvas.canvasElement || document.body.appendChild(this._renderer.view), this._screenManager = ScreenManager.instance, this._screenManager.init(this._stage, this._renderer), Keyboard.init(Canvas.window), this._timestep.init(this._update, this._render, this), this.signalCanvasReady.dispatch()
            }, BaseMain.prototype._onCanvasResize = function(correctRotation) {
                correctRotation ? (this._renderer.resize(Canvas.width, Canvas.height), this._screenManager.resize(), this._timestep.isRunning = !0) : this._timestep.isRunning = !1, this.signalCanvasResize.dispatch(correctRotation)
            }, BaseMain.prototype._onLoadProgress = function(loader, progress) {
                this.signalLoadProgress.dispatch(progress, loader)
            }, BaseMain.prototype._onLoadComplete = function() {
                this._assetManager.signalCompleted.removeAll(), this._assetManager.signalProgress.removeAll(), this.signalLoadComplete.dispatch()
            }, Object.defineProperty(BaseMain.prototype, "stage", {
                get: function() {
                    return this._stage;
                }
            }), Object.defineProperty(BaseMain.prototype, "renderer", {
                get: function() {
                    return this._renderer
                }
            })
        }, {
            "./../Animator": 1,
            "./../AssetManager": 2,
            "./../Canvas": 3,
            "./../Timestep": 5,
            "./../display/screenmanager/ScreenManager": 20,
            "./../input/Keyboard": 28,
            "./Device": 54
        }],
        50: [function(require, module, exports) {
            var CameraLayer = require("./CameraLayer"),
                CameraParallax = require("./CameraParallax"),
                Camera = function(view, snapToPixelEnabled) {
                    this.view = view || new PIXI.Point, this.targetOffset = new PIXI.Point, this.bounds = new PIXI.Rectangle(-(.5 * Number.MAX_VALUE), -(.5 * Number.MAX_VALUE), Number.MAX_VALUE, Number.MAX_VALUE), this.snapToPixelEnabled = snapToPixelEnabled || !0, this.signalTrackingStarted = new signals.Signal, this.signalTrackingFinished = new signals.Signal, this._position = new PIXI.Point(-this.view.x, -this.view.y), this._trackEase = .2, this._trackParallax = new PIXI.Point(CameraParallax.FULL, CameraParallax.FULL), this._target = null, this._targetPos = new PIXI.Point, this._layers = {}, this._tracking = !1, this._shakeOffset = new PIXI.Point
                };
            module.exports = Camera, Camera.VERSION = "1.1.0", Camera.prototype.dispose = function() {
                this._layers = {}, this.signalTrackingStarted.removeAll(), this.signalTrackingStarted = null, this.signalTrackingFinished.removeAll(), this.signalTrackingFinished = null
            }, Camera.prototype.update = function() {
                void 0 != this._target && (this._targetPos.x = this._target.x + this.targetOffset.x, this._targetPos.y = this._target.y + this.targetOffset.y), this._targetPos.x < this.bounds.x ? this._targetPos.x = this.bounds.x : this._targetPos.x > this.bounds.width && (this._targetPos.x = this.bounds.width), this._targetPos.y < this.bounds.y ? this._targetPos.y = this.bounds.y : this._targetPos.y > this.bounds.height && (this._targetPos.y = this.bounds.height), this._targetPos.x += this._shakeOffset.x, this._targetPos.y += this._shakeOffset.y;
                var dx = this._targetPos.x - this.view.x - this._position.x * this._trackParallax.x,
                    dy = this._targetPos.y - this.view.y - this._position.y * this._trackParallax.y;
                this._position.x += dx * (this._trackEase * (1 / this._trackParallax.x)), this._position.y += dy * (this._trackEase * (1 / this._trackParallax.y)), Math.abs(dx) < .01 && (this._position.x = this._targetPos.x - this.view.x), Math.abs(dy) < .01 && (this._position.y = this._targetPos.y - this.view.y), this.snapToPixelEnabled && (this._position.x = Math.round(this._position.x), this._position.y = Math.round(this._position.y));
                var d = dx * dx + dy * dy;.1 > d && !this._tracking ? (this._tracking = !0, this.signalTrackingFinished.dispatch(this)) : d > .1 && this._tracking && (this._tracking = !1, this.signalTrackingStarted.dispatch(this)), this.updateLayers()
            }, Camera.prototype.trackTarget = function(target, reset) {
                if (void 0 != target && (void 0 == target.x || void 0 == target.y)) throw new Error("Camera target is invalid!");
                this._target = target;
                var layer = this.findLayerForObject(this._target);
                this._trackParallax.x = layer ? layer.parallax.x : 1, this._trackParallax.y = layer ? layer.parallax.y : 1, reset && (this._targetPos.x = this._target.x + this.targetOffset.x, this._targetPos.y = this._target.y + this.targetOffset.y, this._targetPos.x < this.bounds.x ? this._targetPos.x = this.bounds.x : this._targetPos.x > this.bounds.width && (this._targetPos.x = this.bounds.width), this._targetPos.y < this.bounds.y ? this._targetPos.y = this.bounds.y : this._targetPos.y > this.bounds.height && (this._targetPos.y = this.bounds.height), this.position = new PIXI.Point(this._targetPos.x - this.view.x, this._targetPos.y - this.view.y))
            }, Camera.prototype.trackPosition = function(x, y, reset) {
                this._target = null, this._targetPos.x = x, this._targetPos.y = y, this._trackParallax.x = 1, this._trackParallax.y = 1, reset && (this._targetPos.x < this.bounds.x ? this._targetPos.x = this.bounds.x : this._targetPos.x > this.bounds.width && (this._targetPos.x = this.bounds.width), this._targetPos.y < this.bounds.y ? this._targetPos.y = this.bounds.y : this._targetPos.y > this.bounds.height && (this._targetPos.y = this.bounds.height), this.position = new PIXI.Point(this._targetPos.x - this.view.x, this._targetPos.y - this.view.y))
            }, Camera.prototype.addLayer = function(name, container, parallax) {
                if (this.hasLayer(name)) throw new Error("Layer with that name already exists: '" + name + "'.");
                if (this.hasContainer(name)) throw new Error("Container already added to existing layer!");
                parallax.x = "undefined" != typeof parallax ? parallax.x : 1, parallax.y = "undefined" != typeof parallax ? parallax.y : 1;
                var layer = new CameraLayer;
                layer.container = container, layer.parallax = new PIXI.Point(parallax.x, parallax.y), this._layers[name] = layer, this.updateLayers()
            }, Camera.prototype.removeLayer = function(name) {
                if (!this.hasLayer) throw new Error("Layer does not exist!");
                this._layers[name] = null
            }, Camera.prototype.removeAllLayers = function() {
                this._layers = {}
            }, Camera.prototype.hasLayer = function(name) {
                return void 0 != this._layers[name]
            }, Camera.prototype.hasContainer = function(container) {
                for (var layer, i = 0; i < this._layers.length; ++i)
                    if (layer = this._layers[i], layer.container == container) return !0;
                return !1
            }, Camera.prototype.findLayerForObject = function(object) {
                var layer, child, count, i = 0,
                    result = null;
                for (var key in this._layers)
                    if (this._layers.hasOwnProperty(key))
                        for (layer = this._layers[key], count = layer.container.children.length, i = 0; count > i; ++i) child = layer.container.getChildAt(i), object == child && (result = layer);
                return result
            }, Camera.prototype.shake = function(amount, repeatCount) {
                amount = amount || new PIXI.Point(5, 5), repeatCount = repeatCount || 4;
                var duration = .1;
                TweenMax.to(this._shakeOffset, duration, {
                    delay: duration,
                    x: this._shakeOffset.x + (1 + Math.random() * amount.x),
                    y: this._shakeOffset.y + (1 + Math.random() * amount.y),
                    ease: Expo.easeInOut,
                    repeat: repeatCount - 1
                }), TweenMax.to(this._shakeOffset, duration, {
                    x: this._shakeOffset.x,
                    y: this._shakeOffset.y,
                    ease: Expo.easeInOut,
                    delay: (repeatCount + 1) * duration
                })
            }, Camera.prototype.getLayerByName = function(name) {
                var layer = this._layers[name];
                if (layer) return layer;
                throw new Error("Layer does not exist: '" + name + "'!")
            }, Camera.prototype.updateLayers = function() {
                for (var key in this._layers)
                    if (this._layers.hasOwnProperty(key)) {
                        var layer = this._layers[key];
                        layer.container.x = -this._position.x * layer.parallax.x, layer.container.y = -this._position.y * layer.parallax.y
                    }
            }, Object.defineProperty(Camera.prototype, "target", {
                get: function() {
                    return this._target
                }
            }), Object.defineProperty(Camera.prototype, "position", {
                get: function() {
                    return this._position
                },
                set: function(value) {
                    this._position.x = value.x * (this._trackParallax.x > 0 ? 1 / this._trackParallax.x : 1), this._position.y = value.y * (this._trackParallax.y > 0 ? 1 / this._trackParallax.y : 1), this.updateLayers()
                }
            }), Object.defineProperty(Camera.prototype, "trackEase", {
                get: function() {
                    return this._trackEase
                },
                set: function(value) {
                    this._trackEase = Math.max(.001, Math.min(1, value))
                }
            })
        }, {
            "./CameraLayer": 51,
            "./CameraParallax": 52
        }],
        51: [function(require, module, exports) {
            var CameraLayer = function() {
                this.container = null, this.parallax = null
            };
            module.exports = CameraLayer
        }, {}],
        52: [function(require, module, exports) {
            var CameraParallax = function() {};
            module.exports = CameraParallax, CameraParallax.NONE = 0, CameraParallax.HALF = .5, CameraParallax.FULL = 1
        }, {}],
        53: [function(require, module, exports) {
            function Color() {}
            module.exports = Color, Color.RED = 16711680, Color.GREEN = 65280, Color.BLUE = 255, Color.WHITE = 16777215, Color.BLACK = 0, Color.lerp = function(a, b, t) {
                var from = Color.hex2rgb(a),
                    to = Color.hex2rgb(b);
                return to.r = (1 - t) * from.r + t * to.r, to.g = (1 - t) * from.g + t * to.g, to.b = (1 - t) * from.b + t * to.b, Color.rgb2hex(to.r, to.g, to.b)
            }, Color.hex2rgb = function(hex) {
                var rgb = {};
                return rgb.r = hex >> 16 & 255, rgb.g = hex >> 8 & 255, rgb.b = hex >> 0 & 255, rgb
            }, Color.rgb2hex = function(red, green, blue) {
                return red << 16 | green << 8 | blue
            }
        }, {}],
        54: [function(require, module, exports) {
            var Device = function() {};
            module.exports = Device, Device.init = function(bowser) {
                bowser || console.warn("[Device] 'bowser' not found, it much be included in the libs and added to the window.");
                var ua = navigator.userAgent;
                Device.bowser = bowser, Device._regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/), Device._resultAppleWebKitRegEx = Device._regExAppleWebKit.exec(navigator.userAgent), Device._appleWebKitVersion = null === Device._resultAppleWebKitRegEx ? null : parseFloat(Device._regExAppleWebKit.exec(navigator.userAgent)[1]), Device._webgl = function() {
                    try {
                        var canvas = document.createElement("canvas");
                        return !!window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
                    } catch (e) {
                        return !1
                    }
                }(), Device.isMobile = bowser.mobile || bowser.tablet, Device.isLowRes = Math.max(window.innerWidth, window.innerHeight) <= 372, Device.isIOS = bowser.ios, Device.isAndroid = bowser.android, Device.isIpad = Device.isIOS && "iPad" == bowser.name, Device.isIpadMini = Device.isIOS && Device.isIpad && 1 === window.devicePixelRatio && Math.max(window.innerWidth, window.innerHeight) <= 1024, Device.isIpod = Device.isIOS && "iPod" == bowser.name, Device.isIphone = Device.isIOS && "iPhone" == bowser.name, Device.isWebGL = Device._webgl, Device.isCanvas = !Device._webgl, Device.isAndroidStockBrowser = Device.isAndroid && null !== Device._appleWebKitVersion && Device._appleWebKitVersion < 537, Device.isIOS9 = Device.isIOS && /(iphone|ipod|ipad).* os 9_/.test(navigator.userAgent.toLowerCase()), Device.isIframe = window.self !== window.top, Device.isKindle = /Kindle/i.test(ua) || /Silk/i.test(ua) || /KFTT/i.test(ua) || /KFOT/i.test(ua) || /KFJWA/i.test(ua) || /KFJWI/i.test(ua) || /KFSOWI/i.test(ua) || /KFTHWA/i.test(ua) || /KFTHWI/i.test(ua) || /KFAPWA/i.test(ua) || /KFAPWI/i.test(ua), Device.isTwitterFacebookBrowser = /(twitter|fban|fbav)/.test(navigator.userAgent.toLowerCase()), Device.isReady = !0
            }, Device.isReady = !1, Device.bowser = null, Device.isMobile = !1, Device.isIOS = !1, Device.isAndroid = !1, Device.isIpad = !1, Device.isIpod = !1, Device.isIphone = !1, Device.isIphone4 = !1, Device.isKindle = !1, Device.isLowRes = !1, Device.isWebGL = !1, Device.isCanvas = !1, Device.isAndroidStockBrowser = !1, Device.isIOS9 = !1, Device.isIframe = !1, Device.isTwitterFacebookBrowser = !1, Object.defineProperty(Device, "isCocoonJS", {
                get: function() {
                    return "undefined" != typeof navigator.isCocoonJS
                }
            })
        }, {}],
        55: [function(require, module, exports) {
            function ObjectPool(base, size, args) {
                this._base = base, this._size = Math.max(1, size), this._args = args || null, this._free = [], this._used = [], this.expand(size)
            }
            module.exports = ObjectPool, ObjectPool.prototype.dispose = function() {
                for (var object, i = 0; i < this._free.length; ++i) object = this._free[i], object && object.dispose();
                for (this._free.length = 0, i = 0; i < this._used.length; ++i) object = this._used[i], object && object.dispose();
                this._used.length = 0
            }, ObjectPool.prototype.expand = function(size) {
                for (var object, i = 0; size > i; ++i) object = Object.create(this._base.prototype), object.constructor = this._base, this._base.apply(object, this._args), this._free.push(object)
            }, ObjectPool.prototype.create = function() {
                var object = this._free.shift();
                return object.init && object.init(), this._used.push(object), this._free.length ? object : null
            }, ObjectPool.prototype.free = function(object) {
                var index = this._used.indexOf(object);
                return -1 != index && (object.reset && object.reset(), this._free.push(object), this._used.splice(index, 1)), -1 != index
            }, Object.defineProperty(ObjectPool.prototype, "size", {
                get: function() {
                    return this._size
                }
            }), Object.defineProperty(ObjectPool.prototype, "available", {
                get: function() {
                    return this._free.length
                }
            })
        }, {}],
        56: [function(require, module, exports) {
            var Sorting = function() {};
            module.exports = Sorting;
            Sorting.prototype;
            Sorting.quickSort = function(array, left, right) {
                function partition(array, left, right) {
                    for (var temp, pivot = array[left + right >>> 1]; right >= left;) {
                        for (; array[left] < pivot;) left++;
                        for (; array[right] > pivot;) right--;
                        right >= left && (temp = array[left], array[left++] = array[right], array[right--] = temp)
                    }
                    return left
                }
                var middle = partition(array, left, right);
                return middle - 1 > left && Sorting.quickSort(array, left, middle - 1), right > middle && Sorting.quickSort(array, middle, right), array
            }, Sorting.quickSortProperty = function(array, left, right, property) {
                function partition(array, left, right) {
                    for (var temp, pivot = array[left + right >>> 1]; right >= left;) {
                        for (; array[left][property] < pivot[property];) left++;
                        for (; array[right][property] > pivot[property];) right--;
                        right >= left && (temp = array[left], array[left++] = array[right], array[right--] = temp)
                    }
                    return left
                }
                var middle = partition(array, left, right);
                return middle - 1 > left && Sorting.quickSortProperty(array, left, middle - 1, property), right > middle && Sorting.quickSortProperty(array, middle, right, property), array
            }, Sorting.insertionSort = function(array) {
                var value, i, j, len = array.length;
                for (i = 0; len > i; i++) {
                    for (value = array[i], j = i - 1; j > -1 && array[j] > value; j--) array[j + 1] = array[j];
                    array[j + 1] = value
                }
                return array
            }, Sorting.insertionSortProperty = function(array, property) {
                var value, i, j, len = array.length;
                for (i = 0; len > i; i++) {
                    for (value = array[i], j = i - 1; j > -1 && array[j][property] > value[property]; j--) array[j + 1] = array[j];
                    array[j + 1] = value
                }
                return array
            }, Sorting.bubbleSort = function(array) {
                var i, j, len, temp;
                for (i = 0, len = array.length; len > i; i++)
                    for (j = i + 1; len > j; j++) array[i] > array[j] && (temp = array[i], array[i] = array[j], array[j] = temp);
                return array
            }, Sorting.bubbleSortProperty = function(array, property) {
                var i, j, len, temp;
                for (i = 0, len = array.length; len > i; i++)
                    for (j = i + 1; len > j; j++) array[i][property] > array[j][property] && (temp = array[i], array[i] = array[j], array[j] = temp);
                return array
            }, Sorting.test = function(numOfObjects, numOfIterations) {
                var start, returnedArray, i, numbericalArr = [],
                    propertyArr = [];
                for (numOfObjects = numOfObjects || 100, numOfIterations = numOfIterations || 1e4, i = 0; numOfObjects > i; i++) numbericalArr.push(Math.round(1e3 * Math.random()));
                for (i = 0; numOfObjects > i; i++) {
                    var obj = {};
                    obj.y = Math.round(1e3 * Math.random()), propertyArr.push(obj)
                }
                for (DEBUG && console.log("//////////////////////"), DEBUG && console.log("/////// SIMPLE ///////"), DEBUG && console.log("////////////////////// "), DEBUG && console.log("\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.bubbleSort(numbericalArr.slice(0));
                for (DEBUG && console.log("Bubble:", new Date - start, ":", returnedArray, "\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.quickSort(numbericalArr.slice(0), 0, numbericalArr.length - 1);
                for (DEBUG && console.log("Quick:", new Date - start, ":", returnedArray, "\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.insertionSort(numbericalArr.slice(0));
                for (DEBUG && console.log("Insertion:", new Date - start, ":", returnedArray, "\n"), DEBUG && console.log("\n"), DEBUG && console.log("//////////////////////"), DEBUG && console.log("////// PROPERTY //////"), DEBUG && console.log("//////////////////////"), DEBUG && console.log("\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.bubbleSortProperty(propertyArr.slice(0), "y");
                for (DEBUG && console.log("Bubble:", new Date - start, ":", returnedArray, "\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.quickSortProperty(propertyArr.slice(0), 0, propertyArr.length - 1, "y");
                for (DEBUG && console.log("Quick:", new Date - start, ":", returnedArray, "\n"), start = new Date, i = 0; numOfIterations > i; i++) returnedArray = Sorting.insertionSortProperty(propertyArr.slice(0), "y");
                DEBUG && console.log("Insertion:", new Date - start, ":", returnedArray, "\n")
            }
        }, {}],
        57: [function(require, module, exports) {
            var Timestep = require("./../Timestep"),
                Timer = function(delay, repeatCount) {
                    this.currentCount = 0, this.delay = delay, this.timeLeft = this.delay, this.repeatCount = Math.max(0, repeatCount) || 0, this.removeOnComplete = !0, this.signals = {}, this.signals.timer = new signals.Signal, this.signals.timerComplete = new signals.Signal, this._running = !1, this._invalid = !1
                };
            module.exports = Timer, Timer.s2ms = function(s) {
                return 1e3 * s
            }, Timer.ms2s = function(ms) {
                return ms / 1e3
            }, Timer.prototype.start = function() {
                this._running = !0
            }, Timer.prototype.stop = function() {
                this._running = !1
            }, Timer.prototype.reset = function() {
                this.currentCount = 0, this.timeLeft = this.delay, this.stop()
            }, Timer.prototype.update = function() {
                !this._running || this.complete || this._invalid || (this.timeLeft <= 0 ? (this.timeLeft = this.delay + this.timeLeft, ++this.currentCount, this.signals.timer.dispatch(this), this.complete && (this.timeLeft = 0, this.signals.timerComplete.dispatch(this))) : this.timeLeft -= Timestep.deltaTime)
            }, Timer.prototype.dispose = function() {
                this._invalid = !0, this.stop(), this.signals.timer.dispose(), this.signals.timerComplete.dispose()
            }, Object.defineProperty(Timer.prototype, "running", {
                get: function() {
                    return this._running && !this.complete
                }
            }), Object.defineProperty(Timer.prototype, "invalid", {
                get: function() {
                    return this._invalid
                }
            }), Object.defineProperty(Timer.prototype, "complete", {
                get: function() {
                    return this.repeatCount && this.currentCount >= this.repeatCount
                }
            })
        }, {
            "./../Timestep": 5
        }],
        58: [function(require, module, exports) {
            var Canvas = require("./../Canvas"),
                Utils = function() {};
            module.exports = Utils, Utils.VERSION = "01.02.00", Utils.PI = 3.141592653589793, Utils.TO_RADIANS = .017453292519943295, Utils.TO_DEGREES = 57.29577951308232, Utils.TextFieldStripUnderScores = function(text, delim) {
                return text.replace(/[_]/g, delim)
            }, Utils.HexToRGB = function(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null
            }, Utils.randomInt = function(max, min) {
                max = parseInt(max), min = parseInt(min), min = min || 0;
                var randomRange;
                return max > min ? (randomRange = Math.round(Math.random() * (max - min)), Math.round(min + randomRange)) : min > max ? (randomRange = Math.round(Math.random() * (min - max)), Math.round(min - randomRange)) : max
            }, Utils.randomBoolean = function() {
                return Math.random() >= .5
            }, Utils.roundNumber = function(number, numDecimalPlaces) {
                numDecimalPlaces = numDecimalPlaces || 0;
                var decimals = Math.pow(10, numDecimalPlaces);
                return Math.round(Math.floor(number * decimals) / decimals)
            }, Utils.padNumber = function(number, width) {
                width = width || 0;
                var n = Math.abs(number),
                    zeros = Math.max(0, width - Math.floor(n).toString().length),
                    zeroString = Math.pow(10, zeros).toString().substr(1);
                return 0 > number && (zeroString = "-" + zeroString), zeroString + n
            }, Utils.roundToPointFive = function(number) {
                return Math.round(2 * number) / 2
            }, Utils.stringToFunction = function(str) {
                for (var arr = str.split("."), thisWindow = window = window.self, fn = thisWindow || this, i = 0, len = arr.length; len > i; i++) fn = fn[arr[i]];
                if ("function" != typeof fn) throw new Error("[Utils.stringToFunction] function not found = " + str);
                return fn
            }, Utils.distanceSqrt = function(pointB, pointA) {
                var xs = 0,
                    ys = 0;
                return xs = pointB.x - pointA.x, xs *= xs, ys = pointB.y - pointA.y, ys *= ys, Math.sqrt(xs + ys)
            }, Utils.distanceSqrtFast = function(pointB, pointA) {
                return (pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y)
            }, Utils.shuffleArray = function(array) {
                for (var currentIndex = array.length, temporaryValue = null, randomIndex = null; 0 !== currentIndex;) randomIndex = Math.floor(Math.random() * currentIndex), currentIndex -= 1, temporaryValue = array[currentIndex], array[currentIndex] = array[randomIndex], array[randomIndex] = temporaryValue;
                return array
            }, Utils.randomItemFromArray = function(array) {
                return array[Utils.randomInt(array.length - 1)]
            }, Utils.rectangleIntersects = function(rectA, rectB) {
                return rectA.x <= rectB.x + rectB.width && rectB.x <= rectA.x + rectA.width && rectA.y <= rectB.y + rectB.height && rectB.y <= rectA.y + rectA.height
            }, Utils.validateEmail = function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email)
            }, Utils.commaFormatNumber = function(num) {
                return (num + "").replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")
            }, Utils.checkStringForMatch = function(str, matchArr) {
                var wordlist = matchArr.join("|"),
                    myRegExp = new RegExp(wordlist),
                    matchPos = str.search(myRegExp);
                return -1 != matchPos ? !0 : !1
            }, Utils.getURLParameter = function(name, opt_default) {
                var value = decodeURI((RegExp(name + "=(.+?)(&|$)").exec(location.search) || [, null])[1]);
                return "null" === value && opt_default && (value = opt_default), value
            }, Utils.goBack = function(count) {
                count = count || -1;
                var thisWindow = window.top || window;
                thisWindow.history.go(count)
            }, Utils.convertStringToXML = function(str) {
                var parseXml, thisWindow = window.top || window;
                return (parseXml = thisWindow.DOMParser ? function(xmlStr) {
                    return (new thisWindow.DOMParser).parseFromString(xmlStr, "text/xml")
                } : "undefined" != typeof thisWindow.ActiveXObject && new window.ActiveXObject("Microsoft.XMLDOM") ? function(xmlStr) {
                    var xmlDoc = new thisWindow.ActiveXObject("Microsoft.XMLDOM");
                    return xmlDoc.async = "false", xmlDoc.loadXML(xmlStr), xmlDoc
                } : function() {
                    return null
                })(str)
            }, Utils.stringToBoolean = function(str) {
                switch (str.toString().toLowerCase()) {
                    case "true":
                    case "yes":
                    case "1":
                        return !0;
                    case "false":
                    case "no":
                    case "0":
                    case null:
                        return !1;
                    default:
                        return Boolean(string)
                }
            }, Utils.clampNumber = function(value, min, max) {
                return Math.min(Math.max(value, min), max)
            }, Utils.normaliseNumber = function(value, min, max) {
                return (value - min) / (max - min)
            }, Utils.lerpNumber = function(normalisedValue, min, max) {
                return (max - min) * normalisedValue + min
            }, Utils.mapNumber = function(value, sourceMin, sourceMax, destMin, destMax) {
                return Utils.lerpNumber(Utils.normaliseNumber(value, sourceMin, sourceMax), destMin, destMax)
            }, Utils.scaleValue = function(currentValue, desiredWidth) {
                return desiredWidth / currentValue
            }, Utils.pointInRect = function(point, rect) {
                return Utils.inRange(point.x, rect.x, rect.x + rect.width) && Utils.inRange(point.y, rect.y, rect.y + rect.height)
            }, Utils.inRange = function(value, min, max) {
                return value >= Math.min(min, max) && value <= Math.max(min, max)
            }, Utils.generateGUID = function() {
                var d = (new Date).getTime(),
                    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
                return uuid.replace(/[xy]/g, function(c) {
                    var r = (d + 16 * Math.random()) % 16 | 0;
                    return d = Math.floor(d / 16), ("x" == c ? r : 7 & r | 8).toString(16)
                })
            }, Utils.createHitAreaSprite = function(opt_debug) {
                var hit = new PIXI.DisplayObjectContainer;
                if (hit.interactive = !0, hit.hitArea = new PIXI.Rectangle(0, 0, Canvas.width, Canvas.height), opt_debug) {
                    var g = new PIXI.Graphics;
                    g.beginFill("0x00ccff", .7), g.drawRect(0, 0, Canvas.width, Canvas.height), hit.addChild(g)
                }
                return hit
            }, Utils.createModalBlock = function(color, alpha, opt_width, opt_height, resolution) {
                color = color || "0x000000", alpha = "undefined" == typeof alpha ? .7 : alpha;
                var width = opt_width || Canvas.width,
                    height = opt_height || Canvas.height;
                resolution = resolution || 1;
                var graphic = new PIXI.Graphics;
                graphic.beginFill(color, alpha), graphic.drawRect(0, 0, width, height);
                var modalBlock = new PIXI.Sprite(graphic.generateTexture(resolution));
                return modalBlock.interactive = !0, modalBlock.buttonMode = !1, modalBlock.mousedown = modalBlock.mouseup = modalBlock.click = modalBlock.tap = function() {}, modalBlock
            }, Utils.cloneObject = function(obj) {
                if (null == obj || "object" != typeof obj) return obj;
                var temp = obj.constructor();
                for (var key in obj) obj.hasOwnProperty(key) && (temp[key] = Utils.cloneObject(obj[key]));
                return temp
            }, Utils.calculateParabola = function(sx, sy, tx, ty, no_frames, overshoot) {
                tx -= sx, ty = -(ty - sy);
                var py;
                py = ty > 0 ? ty + overshoot : overshoot;
                var px, a = ty,
                    b = -2 * tx * py,
                    c = py * tx * tx,
                    px1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
                    px2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
                px = ty > 0 && tx > 0 || 0 > ty && 0 > tx ? Math.min(px1, px2) : Math.max(px1, px2);
                for (var x, y, k = -py / (px * px), ret_y = [], ret_x = [], i = 0; no_frames + 1 > i; i++) x = i * tx / no_frames, y = k * (x * x - 2 * x * px), ret_x.push(x + sx), ret_y.push(sy - y);
                return {
                    x: ret_x,
                    y: ret_y
                }
            }, Utils.logNestedArray = function(array) {
                var str = JSON.stringify(array);
                str = str.replace(/(?:],)/g, "],\n"), console.log(str)
            }
        }, {
            "./../Canvas": 3
        }]
    }, {}, [27])(27)
});

 console.log('Forestry Games - Copyright 2017' );