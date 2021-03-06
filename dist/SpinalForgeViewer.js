"use strict";
/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var BimObjectService_1 = require("./BimObjectService");
var Constants_1 = require("./Constants");
var utils_1 = require("./utils");
var SceneHelper_1 = require("./SceneHelper");
var SpinalForgeViewer = /** @class */ (function () {
    function SpinalForgeViewer() {
        this.bimObjectService = new BimObjectService_1.BimObjectService();
        this.overlayName = "spinal-material-overlay";
        this.option = null;
    }
    SpinalForgeViewer.prototype.initialize = function (viewerManager) {
        var _this = this;
        if (typeof this.initialized === "undefined")
            this.initialized = new Promise(function (resolve) {
                _this.viewerManager = viewerManager;
                _this.viewerManager.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, function (event) {
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
                    _this.initialized.then(function () { return resolve(true); });
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
    SpinalForgeViewer.prototype.getSVFListFromBimFile = function (bimFileId) {
        return __awaiter(this, void 0, void 0, function () {
            var bimFileRNode, elem1, elem, res, i, thumbnail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bimFileRNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimFileId);
                        return [4 /*yield*/, utils_1.loadModelPtr(bimFileRNode.element.ptr)];
                    case 1:
                        elem1 = _a.sent();
                        return [4 /*yield*/, utils_1.loadModelPtr(elem1.currentVersion)];
                    case 2:
                        elem = _a.sent();
                        res = [];
                        if (elem.hasOwnProperty('items')) {
                            for (i = 0; i < elem.items.length; i++) {
                                if (elem.items[i].path.get().indexOf('svf') !== -1) {
                                    thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png';
                                    res.push({
                                        path: elem.items[i].path.get(),
                                        name: elem.items[i].name.get(),
                                        thumbnail: thumbnail
                                    });
                                }
                            }
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    SpinalForgeViewer.prototype.getBimFileDefautPath = function (bimFileId) {
        var bimFileRNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimFileId);
        if (bimFileRNode && bimFileRNode.info.defaultItem) {
            return bimFileRNode.info.defaultItem.get();
        }
    };
    SpinalForgeViewer.prototype.setBimFileDefautPath = function (bimFileId, path) {
        var bimFileRNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimFileId);
        if (bimFileRNode) {
            if (bimFileRNode.info.defaultItem) {
                return bimFileRNode.info.defaultItem.set(path);
            }
            else {
                return bimFileRNode.info.add_attr("defaultItem", path);
            }
        }
    };
    SpinalForgeViewer.prototype.getSVF = function (element, nodeId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var elem1, elem, bimFileRNode, defaultPath, i, thumbnail, i, thumbnail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.loadModelPtr(element.ptr)];
                    case 1:
                        elem1 = _a.sent();
                        return [4 /*yield*/, utils_1.loadModelPtr(elem1.currentVersion)];
                    case 2:
                        elem = _a.sent();
                        if (elem.hasOwnProperty('items')) {
                            bimFileRNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
                            if (bimFileRNode && bimFileRNode.info.defaultItem) {
                                defaultPath = bimFileRNode.info.defaultItem.get();
                                for (i = 0; i < elem.items.length; i++) {
                                    if (elem.items[i].path.get().indexOf('svf') !== -1 && defaultPath === elem.items[i].path.get()) {
                                        thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() :
                                            elem.items[i].path.get() + '.png';
                                        return [2 /*return*/, {
                                                version: elem.versionId,
                                                path: elem.items[i].path.get(),
                                                id: nodeId,
                                                name: name,
                                                thumbnail: thumbnail
                                            }];
                                    }
                                }
                            }
                            for (i = 0; i < elem.items.length; i++) {
                                if (elem.items[i].path.get().indexOf('svf') !== -1) {
                                    thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() :
                                        elem.items[i].path.get() + '.png';
                                    return [2 /*return*/, {
                                            version: elem.versionId,
                                            path: elem.items[i].path.get(),
                                            id: nodeId,
                                            name: name,
                                            thumbnail: thumbnail
                                        }];
                                }
                            }
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    SpinalForgeViewer.prototype.loadBimFile = function (bimFile, scene, options) {
        if (options === void 0) { options = []; }
        return __awaiter(this, void 0, void 0, function () {
            var svfVersionFile, i, path, model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSVF(bimFile.element, bimFile.id.get(), bimFile.name.get())];
                    case 1:
                        svfVersionFile = _a.sent();
                        if (!this.option)
                            for (i = 0; i < options.length; i++) {
                                if (options[i].urn.get().includes(svfVersionFile.path)) {
                                    this.option = options[i].get();
                                    break;
                                }
                            }
                        if (this.option === null)
                            this.option = {};
                        else if (this.option.hasOwnProperty('dbIds') && this.option.dbIds.length > 0)
                            this.option = { ids: this.option.dbIds };
                        path = this.getNormalisePath(svfVersionFile.path);
                        if (this.option.hasOwnProperty('loadOption') &&
                            this.option.loadOption.hasOwnProperty('globalOffset')) {
                            this.option['globalOffset'] = this.option.loadOption.globalOffset;
                        }
                        return [4 /*yield*/, this.viewerManager.loadModel(path, this.option)];
                    case 2:
                        model = _a.sent();
                        this.bimObjectService.addModel(bimFile.id.get(), model, svfVersionFile.version, scene, bimFile.name.get());
                        return [2 /*return*/, { bimFileId: bimFile.id.get(), model: model }];
                }
            });
        });
    };
    SpinalForgeViewer.prototype.loadModelFromNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var node, scene_1, children, option_1, promises, scenes, res, _i, scenes_1, scene, r, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(nodeId)];
                    case 1:
                        node = _a.sent();
                        if (!(node.type.get() === Constants_1.SCENE_TYPE)) return [3 /*break*/, 3];
                        scene_1 = node;
                        return [4 /*yield*/, SceneHelper_1.SceneHelper.getBimFilesFromScene(nodeId)];
                    case 2:
                        children = _a.sent();
                        option_1 = typeof node.options !== "undefined" ? node.options : [];
                        promises = children.map(function (child) { return _this.loadBimFile(child, scene_1, option_1); });
                        return [2 /*return*/, Promise.all(promises)];
                    case 3: return [4 /*yield*/, SceneHelper_1.SceneHelper.getSceneFromNode(nodeId)];
                    case 4:
                        scenes = _a.sent();
                        res = [];
                        _i = 0, scenes_1 = scenes;
                        _a.label = 5;
                    case 5:
                        if (!(_i < scenes_1.length)) return [3 /*break*/, 8];
                        scene = scenes_1[_i];
                        return [4 /*yield*/, this.loadModelFromNode(scene.id.get())];
                    case 6:
                        r = _a.sent();
                        res.push.apply(res, r);
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, res];
                    case 9:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SpinalForgeViewer.prototype.getNormalisePath = function (path) {
        var res = path;
        if (!/https?:\/\//.test(path))
            res = window.location.origin + path;
        return res;
    };
    /**
     * return the model associated to the bimfile
     * @param bimFileId
     * @param dbId
     */
    SpinalForgeViewer.prototype.getModel = function (bimObject) {
        return this.bimObjectService.getModel(bimObject.dbid.get(), bimObject.bimFileId.get());
    };
    SpinalForgeViewer.prototype.loadModelFromBimFile = function (bimFile) {
        return __awaiter(this, void 0, void 0, function () {
            var svfVersionFile, path, model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSVF(bimFile.element, bimFile.id.get(), bimFile.name.get())];
                    case 1:
                        svfVersionFile = _a.sent();
                        path = this.getNormalisePath(svfVersionFile.path);
                        return [4 /*yield*/, this.viewerManager.loadModel(path, {})];
                    case 2:
                        model = _a.sent();
                        return [4 /*yield*/, this.bimObjectService._addModel(bimFile.id.get(), model)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ({ model: model })];
                }
            });
        });
    };
    SpinalForgeViewer.prototype.addMaterial = function (color) {
        // @ts-ignore
        var material = new THREE.MeshPhongMaterial({
            color: color
        });
        this.viewerManager.viewer.impl.createOverlayScene(this.overlayName, material, material);
        return material;
    };
    SpinalForgeViewer.prototype.setModelColorMaterial = function (model, color, ids) {
        var material = this.addMaterial(color);
        for (var i = 0; i < ids.length; i++) {
            var dbid = ids[i];
            //from dbid to node, to fragid
            var it = model.getData().instanceTree;
            it.enumNodeFragments(dbid, (function (fragId) {
                var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);
                // @ts-ignore
                renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, material);
                renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
                renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
                renderProxy.meshProxy.matrixAutoUpdate = false;
                renderProxy.meshProxy.frustumCulled = false;
                this.viewerManager.viewer.impl.addOverlay(this.overlayName, renderProxy.meshProxy);
                this.viewerManager.viewer.impl.invalidate(true);
            }).bind(this), false);
        }
    };
    SpinalForgeViewer.prototype.setColorMaterial = function (aggregateSelection, color) {
        for (var i = 0; i < aggregateSelection.length; i++) {
            var model = aggregateSelection[i].model;
            var ids = aggregateSelection[i].selection;
            this.setModelColorMaterial(model, color, ids);
        }
    };
    SpinalForgeViewer.prototype.restoreColorMaterial = function (aggregateSelection) {
        for (var i = 0; i < aggregateSelection.length; i++) {
            var model = aggregateSelection[1].model;
            var ids = aggregateSelection[1].selection;
            this.restoreModelColorMaterial(model, ids);
        }
    };
    SpinalForgeViewer.prototype.restoreModelColorMaterial = function (model, ids) {
        for (var i = 0; i < ids.length; i++) {
            var dbid = ids[i];
            //from dbid to node, to fragid
            var it = model.getData().instanceTree;
            it.enumNodeFragments(dbid, function (fragId) {
                var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);
                if (renderProxy.meshProxy) {
                    //remove all overlays with same name
                    this.viewerManager.viewer.impl.clearOverlay(this.overlayName);
                    //viewer.impl.removeOverlay(overlayName, renderProxy.meshProxy);
                    delete renderProxy.meshProxy;
                    //refresh the scene
                    this.viewerManager.viewer.impl.invalidate(true);
                }
            }, true);
        }
    };
    return SpinalForgeViewer;
}());
exports.SpinalForgeViewer = SpinalForgeViewer;
