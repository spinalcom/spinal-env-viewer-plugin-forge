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
var Constants_1 = require("./Constants");
var BimObjectService = /** @class */ (function () {
    function BimObjectService() {
        this.mappingModelIdBimFileId = {};
        this.mappingBimFileIdModelId = {};
    }
    BimObjectService.prototype.setCurrentModel = function (model) {
        this.currentModel = model;
    };
    /**
     * Return the node where to attach BIMObject
     * @param bimFileId {String} id of the BIMFile
     */
    BimObjectService.prototype.getBimFileContext = function (bimFileId) {
        return new Promise(function (resolve, reject) {
            spinal_env_viewer_graph_service_1.SpinalGraphService
                .getChildren(bimFileId, [Constants_1.BIM_CONTEXT_RELATION_NAME])
                .then(function (children) {
                if (children.length > 0)
                    resolve(children[0]);
                else
                    resolve(undefined);
            })
                .catch(reject);
        });
    };
    BimObjectService.prototype.createBIMFileContext = function (bimFileId) {
        return new Promise(function (resolve) {
            var contextId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: "BIMContext" }, undefined);
            spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChild(bimFileId, contextId, Constants_1.BIM_CONTEXT_RELATION_NAME, Constants_1.BIM_CONTEXT_RELATION_TYPE)
                .then(resolve);
        });
    };
    /**
     * Return the BIMObject corresponding dbid and the model
     * @param dbId {number}
     * @param model {Model}
     */
    BimObjectService.prototype.getBIMObject = function (dbId, model) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var externalId_1, modelMeta, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BimObjectService.getExternalId(dbId, model)];
                    case 1:
                        externalId_1 = _a.sent();
                        modelMeta = this.mappingModelIdBimFileId[model.id];
                        this.getBimFileContext(modelMeta.bimFileId)
                            .then(function (node) {
                            if (typeof node !== "undefined")
                                spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id, [Constants_1.BIM_OBJECT_RELATION_NAME])
                                    .then(function (children) {
                                    var child = children.find(function (node) {
                                        return node.externalId.get() === externalId_1;
                                    });
                                    resolve(child);
                                });
                            else
                                resolve(undefined);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * create a BIMObject for the corresponding dbid and model
     * @param dbid {number}
     * @param model {Model}
     * @param name {string} name of the bimObject
     * @returns {boolean} true if the BIMObject has been created false otherwise
     */
    BimObjectService.prototype.createBIMObject = function (dbid, name, model) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var bimObject, externalId, modelMeta_1, bimId_1, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getBIMObject(dbid, model)];
                    case 1:
                        bimObject = _a.sent();
                        if (typeof bimObject !== "undefined")
                            resolve(false);
                        return [4 /*yield*/, BimObjectService.getExternalId(dbid, model)];
                    case 2:
                        externalId = _a.sent();
                        modelMeta_1 = this.mappingModelIdBimFileId[model.id];
                        bimId_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                            type: Constants_1.BIM_OBJECT_TYPE,
                            bimFileId: modelMeta_1.bimFileId,
                            version: modelMeta_1.version,
                            externalId: externalId,
                            dbid: dbid,
                            name: name
                        }, undefined);
                        // @ts-ignore
                        this.getBimFileContext(modelMeta_1.bimFileId)
                            .then(function (node) {
                            if (typeof node !== "undefined") {
                                spinal_env_viewer_graph_service_1.SpinalGraphService
                                    .addChild(node.id, bimId_1, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE)
                                    .then(resolve);
                            }
                            else {
                                _this.createBIMFileContext(modelMeta_1.bimFileId)
                                    .then(function () {
                                    _this.createBIMObject(dbid, name, model)
                                        .then(resolve);
                                });
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        reject(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Return the external id for the given dbid
     * @param dbId {number}
     * @param model {Model}
     * @returns {string} external id for the given dbid
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
            var model = modelMeta.model;
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
    /**
     * Add a BIMObject to a node
     * @param contextId  {string} context id where the BIMObject supposed to be
     * @param parentId {string} id of the node where the BIMObject will be add
     * @param dbId {number}
     * @param model {Model}
     * @param name {string}
     */
    BimObjectService.prototype.addBIMObject = function (contextId, parentId, dbId, model, name) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return this.getBIMObject(dbId, model)
            .then(function (bimObject) {
            if (bimObject) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService
                    // @ts-ignore
                    .addChildInContext(parentId, bimObject.id, contextId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE);
            }
            return _this.createBIMObject(dbId, model, name)
                .then(function (child) {
                // @ts-ignore
                return spinal_env_viewer_graph_service_1.SpinalGraphService
                    // @ts-ignore
                    .addChildInContext(parentId, child.getId(), contextId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE);
            });
        });
    };
    /**
     * Remove a BIMObject from a parent
     * @param parentId
     * @param bimObjectId
     */
    BimObjectService.prototype.removeBIMObject = function (parentId, bimObjectId) {
        // @ts-ignore
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, bimObjectId, Constants_1.BIM_NODE_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE);
    };
    /**
     * Delete a BIMObject from graph
     * @param dbId {number}
     * @param model {Model}
     */
    BimObjectService.prototype.deleteBImObject = function (dbId, model) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            var modelMetaData = _this.mappingModelIdBimFileId[model.id];
            _this.getBIMObject(dbId, model)
                .then(function (bimObject) {
                // @ts-ignore
                delete _this.mappingModelIdBimFileId[model.id];
                delete _this.mappingBimFileIdModelId[modelMetaData.bimFileId];
                // @ts-ignore
                resolve(spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(bimObject.id));
            }).catch(reject);
        });
    };
    /**
     * Add a reference object to a node
     *
     * @param parentId {string}
     * @param dbId {Number}
     * @param model {Model}
     * @param name {string}
     */
    BimObjectService.prototype.addReferenceObject = function (parentId, dbId, model, name) {
        if (model === void 0) { model = this.currentModel; }
        this.getBIMObject(dbId, model)
            .then(function (child) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, child.id, REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE);
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
        this.getBIMObject(dbid, model)
            .then(function (child) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, child.id, REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE);
        });
    };
    /*
    /!**
     * @param bimFileId
     * @return {Boolean} true if the version has been created false otherwise
     *!/
    createBIMObjectVersionContext(bimFileId: string) {
      return new Promise((resolve) => {
        this.getBimFileContext(bimFileId)
          .then(children => {
            if (typeof children === "undefined")
              resolve(false);
  
            const nodeId = SpinalGraphService.createNode({
              name: "BIMObjectContext",
              currentVersion: 0
            }, undefined);
  
            return SpinalGraphService
              .addChild(bimFileId, nodeId, BIM_NODE_RELATION_NAME, BIM_NODE_RELATION_TYPE)
              .then(() => {
                resolve(true);
              })
          })
      })
    }
    /!**
     * Add a version to the context
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     *!/
    createBIMObjectVersion(bimFileId: string, version: number): any {
      return new Promise((resolve, reject) => {
        this.getBimFileContext(bimFileId)
          .then(context => {
            const nodeId = SpinalGraphService.createNode({version}, undefined);
            SpinalGraphService
              .addChild(context.id, nodeId, BIM_OBJECT_VERSION_RELATION_NAME, BIM_OBJECT_VERSION_RELATION_TYPE)
              .then(res => {
                SpinalGraphService.getNodeAsync(nodeId).then(resolve);
  
              })
              .catch(reject);
          })
          .catch(reject);
      })
  
    }
  
    /!**
     * Return the node where is attach every node from version
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     *!/
    getBIMObjectVersion(bimFileId: string, version: number) {
      return new Promise((resolve, reject) => {
        this.getBimFileContext(bimFileId)
          .then(context => {
            console.log("10", context);
            SpinalGraphService
              .getChildren(context.id, [BIM_OBJECT_VERSION_RELATION_NAME])
              .then(children => {
                const child = children.find((node) => {
                  return node.version === version
                });
                if (typeof child === "undefined")
                  resolve(this.createBIMObjectVersion(bimFileId, version));
                else
                  resolve(child);
              })
              .catch((e) => {
                reject(e);
              })
          })
          .catch(reject)
      });
    }
  */
    /**
     *
     * @param bimFileId
     * @param version
     */
    BimObjectService.prototype.getAllExternalIdForVersion = function (bimFileId, version) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getBIMObjectVersion(bimFileId, version)
                .then(function (child) {
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService
                    // @ts-ignore
                    .getChildren(child.id, [Constants_1.BIM_OBJECT_RELATION_NAME])
                    .then(function (children) {
                    resolve(children.map(function (children) {
                        return children.externalId;
                    }));
                });
            });
        });
    };
    /**
     * @param version1
     * @param version2
     * @param bimFileId
     */
    BimObjectService.prototype.getDifferenceExternalIdForVersion = function (version1, version2, bimFileId) {
        var promise = [];
        promise.push(this.getAllExternalIdForVersion(bimFileId, version1));
        promise.push(this.getAllExternalIdForVersion(bimFileId, version2));
        return Promise.all(promise).then(function (result) {
            var union = result[0].filter(function (node) {
                return typeof result[1].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) !== "undefined";
            });
            var newBIMObj = result[0].filter(function (node) {
                return typeof result[1].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) === "undefined";
            });
            var oldBIMObj = result[1].filter(function (node) {
                return typeof result[0].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) !== "undefined";
            });
            return { union: union, newBIMObj: newBIMObj, oldBIMObj: oldBIMObj };
        });
    };
    /**
     * notify the service that a new model has been load into the viewer
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     * @param model {Model} model loaded into the viewer
  
     */
    BimObjectService.prototype.addModel = function (bimFileId, model, version) {
        // @ts-ignore
        this.mappingModelIdBimFileId[model.id] = { bimFileId: bimFileId, version: version };
        this.mappingBimFileIdModelId[bimFileId] = {
            // @ts-ignore
            modelId: model.id,
            version: version,
            model: model
        };
    };
    return BimObjectService;
}());
exports.BimObjectService = BimObjectService;
