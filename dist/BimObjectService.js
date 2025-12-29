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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BimObjectService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
/**
 * @export
 * @class BimObjectService
 */
class BimObjectService {
    constructor() {
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
    setCurrentModel(model) {
        this.currentModel = model;
    }
    /**
     * Return the node where to attach BIMObject
     * @param {string} bimFileId id of the BIMFile
     * @returns {Promise<SpinalNodeRef>}
     * @memberof BimObjectService
     */
    async getBimFileContext(bimFileId) {
        try {
            const children = await spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(bimFileId, [Constants_1.BIM_CONTEXT_RELATION_NAME]);
            if (children.length > 0)
                return children[0];
            else
                return undefined;
        }
        catch (e) {
            console.error('BimObjectService.getBimFileContext', e);
            throw e;
        }
    }
    /**
     * @param {string} bimFileId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    createBIMFileContext(bimFileId) {
        const contextId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: "BIMContext" }, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(bimFileId, contextId, Constants_1.BIM_CONTEXT_RELATION_NAME, Constants_1.BIM_CONTEXT_RELATION_TYPE);
    }
    /**
     * create a BIMObject for the corresponding dbid and model
     * @param {number} dbid
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>} the BIMObjectRef has been created
     * @memberof BimObjectService
     */
    async createBIMObject(dbid, name, model = this.currentModel) {
        try {
            const bimObject = await this.getBIMObject(dbid, model);
            //BIMObject already exist
            if (typeof bimObject !== "undefined")
                return bimObject;
            const externalId = await BimObjectService.getExternalId(dbid, model);
            // @ts-ignore
            const modelMeta = this.mappingModelIdBimFileId[model.id];
            const bimId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                type: Constants_1.BIM_OBJECT_TYPE,
                bimFileId: modelMeta.bimFileId,
                version: modelMeta.version,
                externalId, dbid, name,
            }, undefined);
            const node = await this.getBimFileContext(modelMeta.bimFileId);
            if (typeof node !== "undefined") {
                await spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(node.id, bimId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(bimId);
            }
            else {
                await this.createBIMFileContext(modelMeta.bimFileId);
                const n = await this.getBimFileContext(modelMeta.bimFileId);
                if (typeof n !== "undefined") {
                    await spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(n.id, bimId, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_OBJECT_RELATION_TYPE);
                    return (spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(bimId));
                }
            }
        }
        catch (e) {
            console.error('createBIMObject', e);
            throw e;
        }
    }
    /**
     * Return the BIMObject corresponding dbid and the model
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    async getBIMObject(dbId, model = this.currentModel) {
        try {
            const externalId = await BimObjectService.getExternalId(dbId, model);
            // @ts-ignore
            const modelMeta = this.mappingModelIdBimFileId[model.id];
            const n = await this.getBimFileContext(modelMeta.bimFileId);
            if (typeof n !== "undefined") {
                const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(n.id.get());
                const children = await node.getChildren([Constants_1.BIM_OBJECT_RELATION_NAME]);
                const child = children.find((node) => {
                    return node.info.externalId.get() === externalId;
                });
                if (child) {
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(child);
                    return (spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(child.info.id.get()));
                }
            }
            else
                return (undefined);
        }
        catch (e) {
            console.error('getBIMObject', e);
            throw (e);
        }
    }
    /**
     * Return the external id for the given dbid
     * @static
     * @param {number} dbId
     * @param {Model} model
     * @returns {Promise<string>} external id for the given dbid
     * @memberof BimObjectService
     */
    static getExternalId(dbId, model) {
        return new Promise((resolve, reject) => {
            model.getProperties(dbId, (props) => {
                resolve(props.externalId);
            }, reject);
        });
    }
    /**
     * Return the dbid corresponding to the external id
     * @param externalId
     * @param bimFileId {String} id of the BIMFile
     * @returns {number} dbid of the given external id
     */
    getDbIdFromExternalId(externalId, bimFileId) {
        return new Promise((resolve, reject) => {
            const modelMeta = this.mappingBimFileIdModelId[bimFileId];
            const model = modelMeta.modelScene[0].model;
            model.getExternalIdMapping(res => {
                resolve(res[externalId]);
            }, reject);
        });
    }
    /**
     * @param {string} externalId
     * @param {Model} model
     * @returns {Promise<number>}
     * @memberof BimObjectService
     */
    getDdIdFromExternalIdFromModel(externalId, model) {
        return new Promise((resolve, reject) => {
            model.getExternalIdMapping(res => {
                resolve(res[externalId]);
            }, reject);
        });
    }
    /**
     * @param {string[]} externalIds
     * @param {Model} model
     * @returns {Promise<number[]>}
     * @memberof BimObjectService
     */
    getDdIdsFromExternalIds(externalIds, model) {
        return new Promise((resolve, reject) => {
            model.getExternalIdMapping(mapping => {
                const res = [];
                for (let i = 0; i < externalIds.length; i++) {
                    res.push(mapping[externalIds[i]]);
                }
                resolve(res);
            }, reject);
        });
    }
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
    async addBIMObject(contextId, parentId, dbId, name, model = this.currentModel) {
        try {
            const bimObject = await this.getBIMObject(dbId, model);
            if (typeof bimObject !== "undefined") {
                const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimObject.id.get());
                const parent = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
                const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
                await parent.addChildInContext(node, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context);
                return bimObject;
            }
            const child = await this.createBIMObject(dbId, name, model);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(child.id.get());
            const parent = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(parentId);
            const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
            await parent.addChildInContext(node, Constants_1.BIM_OBJECT_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE, context);
            return child;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    /**
     * Remove a BIMObject from a parent
     * @param {string} parentId
     * @param {string} bimObjectId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    removeBIMObject(parentId, bimObjectId) {
        // @ts-ignore
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, bimObjectId, Constants_1.BIM_NODE_RELATION_NAME, Constants_1.BIM_NODE_RELATION_TYPE);
    }
    /**
     * Delete a BIMObject from graph
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<void>}
     * @memberof BimObjectService
     */
    async deleteBImObject(dbId, model = this.currentModel) {
        // @ts-ignore
        const modelId = model.id;
        const modelMetaData = this.mappingModelIdBimFileId[modelId];
        try {
            const bimObject = await this.getBIMObject(dbId, model);
            delete this.mappingModelIdBimFileId[modelId];
            delete this.mappingBimFileIdModelId[modelMetaData.bimFileId];
            return spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(bimObject.id.get());
        }
        catch (e) {
            console.error('deleteBImObject', e);
            throw e;
        }
    }
    /**
     * Add a reference object to a node
     * @param {string} parentId
     * @param {number} dbId
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    async addReferenceObject(parentId, dbId, name, model = this.currentModel) {
        const child = await this.getBIMObject(dbId, model);
        if (typeof child === "undefined") {
            const BIMObj = await this.createBIMObject(dbId, name, model);
            await spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, BIMObj.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE);
            return BIMObj;
        }
        await spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, child.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE);
        return child;
    }
    /**
     *
     * @param parentId
     * @param dbid
     * @param model
     */
    async removeReferenceObject(parentId, dbid, model = this.currentModel) {
        const child = await this.getBIMObject(dbid, model);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, child.id.get(), Constants_1.REFERENCE_OBJECT_RELATION_NAME, Constants_1.REFERENCE_OBJECT_RELATION_TYPE);
    }
    /**
     * notify the service that a new model has been load into the viewer
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     * @param model {Model} model loaded into the viewer
     * @param scene {any} scene loaded
     * @param name
     */
    addModel(bimFileId, model, version, scene, name) {
        // @ts-ignore
        const modelId = model.id;
        this.mappingModelIdBimFileId[modelId] = { bimFileId, version, scene };
        this.mappingNameByModel[name] = model;
        let mapping = this.mappingBimFileIdModelId[bimFileId];
        if (typeof mapping === "undefined") {
            mapping = {
                modelId: modelId,
                version: version,
                modelScene: [{ model, scene }]
            };
        }
        else
            mapping.modelScene.push({ model, scene });
        this.mappingBimFileIdModelId[bimFileId] = mapping;
    }
    _addModel(bimFileId, model, name) {
        // @ts-ignore
        const modelId = model.id;
        this.mappingModelIdBimFileId[modelId] = { bimFileId, version: 0, scene: undefined };
        this.mappingNameByModel[name] = model;
    }
    /**
     * Get the model corresponding to the dbid and the bimfile
     * @param dbId {number} dbId of the BIMObject
     * @param bimFileId {string} id of the BIMfile
     */
    getModel(dbId, bimFileId) {
        const mapping = this.mappingBimFileIdModelId[bimFileId];
        if (typeof mapping !== "undefined")
            for (let i = 0; i < mapping.modelScene.length; i++) {
                if (mapping.modelScene[i].scene.hasOwnProperty('options') && mapping.modelScene[i].scene['options'].dbIds.contains(dbId))
                    return mapping.modelScene[i].model;
            }
        return undefined;
    }
    getModelByBimfile(bimFileId) {
        const mapping = this.mappingBimFileIdModelId[bimFileId];
        //one bimFile is not supposed to be load multipe time
        if (typeof mapping !== "undefined")
            return mapping.modelScene[0].model;
        return undefined;
    }
    /**
     * Get a model corresponding to the name use with caution
     * @param name
     */
    getModelByName(name) {
        return this.mappingNameByModel[name];
    }
}
exports.BimObjectService = BimObjectService;
/**
 * @static
 * @type {number}
 * @memberof BimObjectService
 */
BimObjectService.num = 0;
