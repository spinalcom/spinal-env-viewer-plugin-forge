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
Object.defineProperty(exports, "__esModule", { value: true });
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var Constants_1 = require("./Constants");
/**
 * @export
 * @class BimObjectService
 */
var BimObjectService = /** @class */ (function () {
    function BimObjectService() {
        /**
         * @type {{ [modelId: number]: { bimFileId: string, version: number, scene: any } }}
         * @memberof BimObjectService
         */
        this.mappingModelIdBimFileId = {};
        /**
         * @type {{ [bimFileId: string]: { modelId: number, version: number, modelScene: { model: Model, scene: any }[] } }}
         * @memberof BimObjectService
         */
        this.mappingBimFileIdModelId = {};
        /**
         * @type {{ [name: string]: Model }}
         * @memberof BimObjectService
         */
        this.mappingNameByModel = {};
    }
    /**
     * @param {Model} model
     * @memberof BimObjectService
     */
    BimObjectService.prototype.setCurrentModel = function (model) {
        this.currentModel = model;
    };
    /**
     * Return the node where to attach BIMObject
     * @param {string} bimFileId id of the BIMFile
     * @returns {Promise<SpinalNodeRef>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.getBimFileContext = function (bimFileId) {
        return __awaiter(this, void 0, void 0, function () {
            var children, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(bimFileId, [Constants_1.BIM_CONTEXT_RELATION_NAME])];
                    case 1:
                        children = _a.sent();
                        if (children.length > 0)
                            return [2 /*return*/, children[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error('BimObjectService.getBimFileContext', e_1);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {string} bimFileId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.createBIMFileContext = function (bimFileId) {
        var contextId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: "BIMContext" }, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(bimFileId, contextId, Constants_1.BIM_CONTEXT_RELATION_NAME, Constants_1.BIM_CONTEXT_RELATION_TYPE);
    };
    /**
     * create a BIMObject for the corresponding dbid and model
     * @param {number} dbid
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>} the BIMObjectRef has been created
     * @memberof BimObjectService
     */
    BimObjectService.prototype.createBIMObject = function (dbid, name, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var bimObject, externalId, modelMeta, bimId, node, n, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.getBIMObject(dbid, model)];
                    case 1:
                        bimObject = _a.sent();
                        //BIMObject already exist
                        if (typeof bimObject !== "undefined")
                            return [2 /*return*/, bimObject];
                        return [4 /*yield*/, BimObjectService.getExternalId(dbid, model)];
                    case 2:
                        externalId = _a.sent();
                        modelMeta = this.mappingModelIdBimFileId[model.id];
                        bimId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                            type: Constants_1.BIM_OBJECT_TYPE,
                            bimFileId: modelMeta.bimFileId,
                            version: modelMeta.version,
                            externalId: externalId, dbid: dbid, name: name,
                        }, undefined);
                        return [4 /*yield*/, this.getBimFileContext(modelMeta.bimFileId)];
                    case 3:
                        node = _a.sent();
                        if (!(typeof node !== "undefined")) return [3 /*break*/, 5];
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(node.id, bimId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(bimId)];
                    case 5: return [4 /*yield*/, this.createBIMFileContext(modelMeta.bimFileId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.getBimFileContext(modelMeta.bimFileId)];
                    case 7:
                        n = _a.sent();
                        if (!(typeof n !== "undefined")) return [3 /*break*/, 9];
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(n.id, bimId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, (spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(bimId))];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_2 = _a.sent();
                        throw e_2;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return the BIMObject corresponding dbid and the model
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.getBIMObject = function (dbId, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var externalId_1, modelMeta, n, node, children, child, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, BimObjectService.getExternalId(dbId, model)];
                    case 1:
                        externalId_1 = _a.sent();
                        modelMeta = this.mappingModelIdBimFileId[model.id];
                        return [4 /*yield*/, this.getBimFileContext(modelMeta.bimFileId)];
                    case 2:
                        n = _a.sent();
                        if (!(typeof n !== "undefined")) return [3 /*break*/, 4];
                        node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(n.id.get());
                        return [4 /*yield*/, node.getChildren([Constants_1.BIM_OBJECT_RELATION_NAME])];
                    case 3:
                        children = _a.sent();
                        child = children.find(function (node) {
                            return node.info.externalId.get() === externalId_1;
                        });
                        if (child) {
                            // @ts-ignore
                            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(child);
                            return [2 /*return*/, (spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(child.info.id.get()))];
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, (undefined)];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_3 = _a.sent();
                        console.error(e_3);
                        throw (e_3);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return the external id for the given dbid
     * @static
     * @param {number} dbId
     * @param {Model} model
     * @returns {Promise<string>} external id for the given dbid
     * @memberof BimObjectService
     */
    BimObjectService.getExternalId = function (dbId, model) {
        return new Promise(function (resolve, reject) {
            model.getProperties(dbId, function (props) {
                resolve(props.externalId);
            }, reject);
        });
    };
    /**
     * Return the dbid corresponding to the external id
     * @param externalId
     * @param bimFileId {String} id of the BIMFile
     * @returns {number} dbid of the given external id
     */
    BimObjectService.prototype.getDbIdFromExternalId = function (externalId, bimFileId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var modelMeta = _this.mappingBimFileIdModelId[bimFileId];
            var model = modelMeta.modelScene[0].model;
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
    /**
     * @param {string} externalId
     * @param {Model} model
     * @returns {Promise<number>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.getDdIdFromExternalIdFromModel = function (externalId, model) {
        return new Promise(function (resolve, reject) {
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
    /**
     * @param {string[]} externalIds
     * @param {Model} model
     * @returns {Promise<number[]>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.getDdIdsFromExternalIds = function (externalIds, model) {
        return new Promise(function (resolve, reject) {
            model.getExternalIdMapping(function (mapping) {
                var res = [];
                for (var i = 0; i < externalIds.length; i++) {
                    res.push(mapping[externalIds[i]]);
                }
                resolve(res);
            }, reject);
        });
    };
    /**
     * Add a BIMObject to a node
     * @param {string} contextId context id where the BIMObject supposed to be
     * @param {string} parentId id of the node where the BIMObject will be add
     * @param {number} dbId
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<SpinalNodeRef>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.addBIMObject = function (contextId, parentId, dbId, name, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var bimObject, node_1, parent_1, context_1, child, node, parent_2, context, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getBIMObject(dbId, model)];
                    case 1:
                        bimObject = _a.sent();
                        if (!(typeof bimObject !== "undefined")) return [3 /*break*/, 3];
                        node_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimObject.id.get());
                        parent_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
                        context_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
                        return [4 /*yield*/, parent_1.addChildInContext(node_1, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context_1)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, bimObject];
                    case 3: return [4 /*yield*/, this.createBIMObject(dbId, name, model)];
                    case 4:
                        child = _a.sent();
                        node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(child.id.get());
                        parent_2 = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
                        context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
                        return [4 /*yield*/, parent_2.addChildInContext(node, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, child];
                    case 6:
                        e_4 = _a.sent();
                        console.error(e_4);
                        throw e_4;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove a BIMObject from a parent
     * @param {string} parentId
     * @param {string} bimObjectId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.removeBIMObject = function (parentId, bimObjectId) {
        // @ts-ignore
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, bimObjectId, Constants_1.BIM_NODE_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE);
    };
    /**
     * Delete a BIMObject from graph
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<void>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.deleteBImObject = function (dbId, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var modelId, modelMetaData, bimObject, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modelId = model.id;
                        modelMetaData = this.mappingModelIdBimFileId[modelId];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getBIMObject(dbId, model)];
                    case 2:
                        bimObject = _a.sent();
                        delete this.mappingModelIdBimFileId[modelId];
                        delete this.mappingBimFileIdModelId[modelMetaData.bimFileId];
                        return [2 /*return*/, spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(bimObject.id.get())];
                    case 3:
                        e_5 = _a.sent();
                        console.error('deleteBImObject', e_5);
                        throw e_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a reference object to a node
     * @param {string} parentId
     * @param {number} dbId
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    BimObjectService.prototype.addReferenceObject = function (parentId, dbId, name, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var child, BIMObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBIMObject(dbId, model)];
                    case 1:
                        child = _a.sent();
                        if (!(typeof child === "undefined")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createBIMObject(dbId, name, model)];
                    case 2:
                        BIMObj = _a.sent();
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, BIMObj.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, BIMObj];
                    case 4: return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, child.info.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, child];
                }
            });
        });
    };
    /**
     *
     * @param parentId
     * @param dbid
     * @param model
     */
    BimObjectService.prototype.removeReferenceObject = function (parentId, dbid, model) {
        if (model === void 0) { model = this.currentModel; }
        return __awaiter(this, void 0, void 0, function () {
            var child;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBIMObject(dbid, model)];
                    case 1:
                        child = _a.sent();
                        return [2 /*return*/, spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, child.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE)];
                }
            });
        });
    };
    /**
     * notify the service that a new model has been load into the viewer
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     * @param model {Model} model loaded into the viewer
     * @param scene {any} scene loaded
     * @param name
     */
    BimObjectService.prototype.addModel = function (bimFileId, model, version, scene, name) {
        // @ts-ignore
        var modelId = model.id;
        this.mappingModelIdBimFileId[modelId] = { bimFileId: bimFileId, version: version, scene: scene };
        this.mappingNameByModel[name] = model;
        var mapping = this.mappingBimFileIdModelId[bimFileId];
        if (typeof mapping === "undefined") {
            mapping = {
                modelId: modelId,
                version: version,
                modelScene: [{ model: model, scene: scene }]
            };
        }
        else
            mapping.modelScene.push({ model: model, scene: scene });
        this.mappingBimFileIdModelId[bimFileId] = mapping;
    };
    BimObjectService.prototype._addModel = function (bimFileId, model) {
        // @ts-ignore
        var modelId = model.id;
        this.mappingModelIdBimFileId[modelId] = { bimFileId: bimFileId, version: 0, scene: undefined };
        this.mappingNameByModel[name] = model;
    };
    /**
     * Get the model corresponding to the dbid and the bimfile
     * @param dbId {number} dbId of the BIMObject
     * @param bimFileId {string} id of the BIMfile
     */
    BimObjectService.prototype.getModel = function (dbId, bimFileId) {
        var mapping = this.mappingBimFileIdModelId[bimFileId];
        if (typeof mapping !== "undefined")
            for (var i = 0; i < mapping.modelScene.length; i++) {
                if (mapping.modelScene[i].scene.hasOwnProperty('options') && mapping.modelScene[i].scene['options'].dbIds.contains(dbId))
                    return mapping.modelScene[i].model;
            }
        return undefined;
    };
    BimObjectService.prototype.getModelByBimfile = function (bimFileId) {
        var mapping = this.mappingBimFileIdModelId[bimFileId];
        //one bimFile is not supposed to be load multipe time
        if (typeof mapping !== "undefined")
            return mapping.modelScene[0].model;
        return undefined;
    };
    /**
     * Get a model corresponding to the name use with caution
     * @param name
     */
    BimObjectService.prototype.getModelByName = function (name) {
        return this.mappingNameByModel[name];
    };
    /**
     * @static
     * @type {number}
     * @memberof BimObjectService
     */
    BimObjectService.num = 0;
    return BimObjectService;
}());
exports.BimObjectService = BimObjectService;
