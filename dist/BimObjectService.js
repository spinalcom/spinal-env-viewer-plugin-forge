"use strict";
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
var Constants_1 = require("./Constants");
var BimObjectService = /** @class */ (function () {
    function BimObjectService() {
        this.mappingModelIdBimFileId = {};
        this.mappingBimFileIdModelId = {};
        this.mappingNameByModel = {};
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
            })["catch"](reject);
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
            var bimObject, externalId, modelMeta_1, bimId_1, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getBIMObject(dbid, model)];
                    case 1:
                        bimObject = _a.sent();
                        //BIMObject already exist
                        if (typeof bimObject !== "undefined")
                            return [2 /*return*/, resolve(bimObject)];
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
                            name: name,
                        }, undefined);
                        // @ts-ignore
                        this.getBimFileContext(modelMeta_1.bimFileId)
                            .then(function (node) {
                            if (typeof node !== "undefined") {
                                spinal_env_viewer_graph_service_1.SpinalGraphService
                                    .addChild(node.id, bimId_1, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE)
                                    .then(function (res) {
                                    spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(bimId_1).then(resolve);
                                });
                            }
                            else {
                                _this.createBIMFileContext(modelMeta_1.bimFileId)
                                    .then(function () {
                                    _this.getBimFileContext(modelMeta_1.bimFileId)
                                        .then(function (node) {
                                        if (typeof node !== "undefined") {
                                            spinal_env_viewer_graph_service_1.SpinalGraphService
                                                .addChild(node.id, bimId_1, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE)
                                                .then(function () {
                                                spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(bimId_1).then(resolve);
                                            })["catch"](console.error);
                                        }
                                    });
                                });
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
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
            var externalId_1, modelMeta, e_2;
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
                            if (typeof node !== "undefined") {
                                node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(node.id.get());
                                node.getChildren(node.id, [Constants_1.BIM_OBJECT_RELATION_NAME])
                                    .then(function (children) {
                                    var child = children.find(function (node) {
                                        return node.info.externalId.get() === externalId_1;
                                    });
                                    resolve(child);
                                })["catch"](console.error);
                            }
                            else
                                resolve(undefined);
                        })["catch"](console.error);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        reject(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
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
            var model = modelMeta.modelScene[0].model;
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
    BimObjectService.prototype.getDdIdFromExternalIdFromModel = function (externalId, model) {
        return new Promise(function (resolve, reject) {
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
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
     * @param contextId  {string} context id where the BIMObject supposed to be
     * @param parentId {string} id of the node where the BIMObject will be add
     * @param dbId {number}
     * @param model {Model}
     * @param name {string}
     */
    BimObjectService.prototype.addBIMObject = function (contextId, parentId, dbId, name, model) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return this.getBIMObject(dbId, model)
            .then(function (bimObject) {
            if (typeof bimObject !== "undefined") {
                var parent_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
                var context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
                return parent_1.addChildInContext(bimObject, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context)
                    .then(function () {
                    return bimObject;
                });
            }
            return _this.createBIMObject(dbId, name, model)
                .then(function (child) {
                child = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(child.id.get());
                var parent = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
                var context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
                return parent.addChildInContext(child, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context)
                    .then(function () {
                    return child;
                });
            });
        })["catch"](console.error);
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
            })["catch"](reject);
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
    BimObjectService.prototype.addReferenceObject = function (parentId, dbId, name, model) {
        var _this = this;
        if (model === void 0) { model = this.currentModel; }
        return new Promise(function (resolve) {
            _this.getBIMObject(dbId, model)
                .then(function (child) {
                if (typeof child === "undefined")
                    return _this.createBIMObject(dbId, name, model)
                        .then(function (BIMObj) {
                        spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, BIMObj.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE)
                            .then(function () {
                            resolve(child);
                        });
                    });
                else {
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, child.info.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE)
                        .then(function () {
                        resolve(child);
                    });
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
        this.getBIMObject(dbid, model)
            .then(function (child) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, child.id, Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE);
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
    /*
  
      /!**
       *
       * @param bimFileId
       * @param version
       *!/
      getAllExternalIdForVersion(bimFileId: string, version: number) {
        return new Promise(resolve => {
  
          this.getBIMObjectVersion(bimFileId, version)
            .then(child => {
              // @ts-ignore
              SpinalGraphService
              // @ts-ignore
                .getChildren(child.id, [BIM_OBJECT_RELATION_NAME])
                .then(children => {
                  resolve(children.map(children => {
                    return children.externalId
                  }));
                })
            })
        })
      }
  
      /!**
       * @param version1
       * @param version2
       * @param bimFileId
       *!/
      getDifferenceExternalIdForVersion(version1: number, version2: number, bimFileId: string) {
        const promise = [];
        promise.push(this.getAllExternalIdForVersion(bimFileId, version1));
        promise.push(this.getAllExternalIdForVersion(bimFileId, version2));
  
        return Promise.all(promise).then((result: Array<Array<string>>) => {
          const union = result[0].filter((node) => {
            return typeof result[1].find(n => {
              // @ts-ignore
              return n.externalId === node.externalId
            }) !== "undefined";
          });
          const newBIMObj = result[0].filter((node) => {
            return typeof result[1].find(n => {
              // @ts-ignore
              return n.externalId === node.externalId
            }) === "undefined";
          });
          const oldBIMObj = result[1].filter((node) => {
            return typeof result[0].find(n => {
              // @ts-ignore
              return n.externalId === node.externalId
            }) !== "undefined";
          });
  
          return {union, newBIMObj, oldBIMObj};
  
        })
      }
    */
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
        this.mappingModelIdBimFileId[model.id] = { bimFileId: bimFileId, version: version, scene: scene };
        this.mappingNameByModel[name] = model;
        var mapping = this.mappingBimFileIdModelId[bimFileId];
        if (typeof mapping === "undefined") {
            mapping = {
                // @ts-ignore
                modelId: model.id,
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
        this.mappingModelIdBimFileId[model.id] = { bimFileId: bimFileId, version: 0, scene: undefined };
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
        //one bimFile is note supposed to be load multipe time
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
    BimObjectService.num = 0;
    return BimObjectService;
}());
exports.BimObjectService = BimObjectService;
