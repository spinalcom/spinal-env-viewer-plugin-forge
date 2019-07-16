"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var BimObjectService_1 = require("./BimObjectService");
var Constants_1 = require("./Constants");
var utils_1 = require("./utils");
var SceneHelper_1 = require("./SceneHelper");
var SpinalForgeViewer = /** @class */ (function () {
    function SpinalForgeViewer() {
        this.bimObjectService = new BimObjectService_1.BimObjectService();
    }
    SpinalForgeViewer.prototype.initialize = function (viewerManager) {
        var _this = this;
        if (typeof this.initialized === "undefined")
            this.initialized = new Promise(function (resolve) {
                _this.viewerManager = viewerManager;
                _this.viewerManager.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, function (event) {
                    console.log(event);
                    if (typeof event.selections !== "undefined" && event.selections.length > 0) {
                        _this.viewerManager.setCurrentModel(event.selections[0].model);
                        _this.bimObjectService.setCurrentModel(event.selections[0].model);
                    }
                });
                resolve(true);
            });
        return this.initialized;
    };
    SpinalForgeViewer.prototype.isInitialize = function () {
        return typeof this.initialized !== "undefined";
    };
    SpinalForgeViewer.prototype.waitForInitialization = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var interval = setInterval(function () {
                if (typeof _this.initialized !== "undefined") {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 200);
        });
    };
    SpinalForgeViewer.prototype.getScene = function (modelId) {
        return this.scenes.filter(function (scene) {
            return scene.modelIds.indexOf(modelId) !== -1;
        });
    };
    ;
    SpinalForgeViewer.prototype.getSVF = function (element, nodeId, name) {
        return utils_1.loadModelPtr(element.ptr)
            .then(function (elem) {
            return utils_1.loadModelPtr(elem.currentVersion);
        })
            .then(function (elem) {
            if (elem.hasOwnProperty('items'))
                for (var i = 0; i < elem.items.length; i++)
                    if (elem.items[i].path.get().indexOf('svf') !== -1) {
                        return {
                            version: elem.versionId,
                            path: elem.items[i].path.get(),
                            id: nodeId,
                            name: name,
                            thumbnail: elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
                        };
                    }
            return undefined;
        });
    };
    SpinalForgeViewer.prototype.loadBimFile = function (bimfIle, scene, options) {
        var _this = this;
        if (options === void 0) { options = []; }
        return new Promise(function (resolve) {
            _this.getSVF(bimfIle.element, bimfIle.id, bimfIle.name)
                .then(function (svfVersionFile) {
                var option;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].urn.get().includes(svfVersionFile.path) !== -1) {
                        option = options[i];
                        break;
                    }
                }
                if (typeof option === "undefined")
                    option = {};
                else if (option.dbIds.get().length > 0)
                    option = { ids: option.dbIds.get() };
                var path = window.location.origin + svfVersionFile.path;
                _this.viewerManager.loadModel(path, option)
                    .then(function (model) {
                    _this.bimObjectService
                        .addModel(bimfIle.id, model, svfVersionFile.version, scene);
                    resolve({ bimFileId: bimfIle.id, model: model });
                });
            });
        });
    };
    SpinalForgeViewer.prototype.loadModelFromNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var node_1, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(nodeId)];
                    case 1:
                        node_1 = _a.sent();
                        if (node_1.type.get() === Constants_1.SCENE_TYPE) {
                            console.log(node_1);
                            return [2 /*return*/, SceneHelper_1.SceneHelper.getBimFilesFromScene(nodeId)
                                    .then(function (children) {
                                    var promises = [];
                                    var option = typeof node_1.options !== "undefined" ? node_1.options : [];
                                    for (var i = 0; i < children.length; i++) {
                                        promises.push(_this.loadBimFile(children[i], node_1, option));
                                    }
                                    return Promise.all(promises);
                                })];
                        }
                        else
                            return [2 /*return*/, SceneHelper_1.SceneHelper.getSceneFromNode(nodeId)
                                    .then(function (scene) {
                                    if (typeof scene !== "undefined")
                                        return _this.loadModelFromNode(scene.id);
                                })];
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * return the model associated to the bimfile
     * @param bimFileId
     * @param dbId
     */
    SpinalForgeViewer.prototype.getModel = function (bimObject) {
        return this.bimObjectService.getModel(bimObject.dbId, bimObject.bimFileId);
    };
    return SpinalForgeViewer;
}());
exports.SpinalForgeViewer = SpinalForgeViewer;
