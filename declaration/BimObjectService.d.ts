/// <reference types="forge-viewer" />
import { SpinalNodeRef } from "spinal-env-viewer-graph-service";
import Model = Autodesk.Viewing.Model;
import { BimObjectRef, SceneNodeRef } from './interfaces/interfaces';
/**
 * @export
 * @class BimObjectService
 */
export declare class BimObjectService {
    /**
     * @type {{ [modelId: number]: { bimFileId: string, version: number, scene: any } }}
     * @memberof BimObjectService
     */
    mappingModelIdBimFileId: {
        [modelId: number]: {
            bimFileId: string;
            version: number;
            scene: any;
        };
    };
    /**
     * @type {{ [bimFileId: string]: { modelId: number, version: number, modelScene: { model: Model, scene: any }[] } }}
     * @memberof BimObjectService
     */
    mappingBimFileIdModelId: {
        [bimFileId: string]: {
            modelId: number;
            version: number;
            modelScene: {
                model: Model;
                scene: any;
            }[];
        };
    };
    /**
     * @type {{ [name: string]: Model }}
     * @memberof BimObjectService
     */
    mappingNameByModel: {
        [name: string]: Model;
    };
    /**
     * @static
     * @type {number}
     * @memberof BimObjectService
     */
    static num: number;
    /**
     * @private
     * @type {Model}
     * @memberof BimObjectService
     */
    private currentModel;
    /**
     * @param {Model} model
     * @memberof BimObjectService
     */
    setCurrentModel(model: Model): void;
    /**
     * Return the node where to attach BIMObject
     * @param {string} bimFileId id of the BIMFile
     * @returns {Promise<SpinalNodeRef>}
     * @memberof BimObjectService
     */
    getBimFileContext(bimFileId: string): Promise<SpinalNodeRef>;
    /**
     * @param {string} bimFileId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    createBIMFileContext(bimFileId: string): Promise<boolean>;
    /**
     * create a BIMObject for the corresponding dbid and model
     * @param {number} dbid
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>} the BIMObjectRef has been created
     * @memberof BimObjectService
     */
    createBIMObject(dbid: number, name: string, model?: Model): Promise<BimObjectRef>;
    /**
     * Return the BIMObject corresponding dbid and the model
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    getBIMObject(dbId: number, model?: Model): Promise<BimObjectRef>;
    /**
     * Return the external id for the given dbid
     * @static
     * @param {number} dbId
     * @param {Model} model
     * @returns {Promise<string>} external id for the given dbid
     * @memberof BimObjectService
     */
    static getExternalId(dbId: number, model: Model): Promise<string>;
    /**
     * Return the dbid corresponding to the external id
     * @param externalId
     * @param bimFileId {String} id of the BIMFile
     * @returns {number} dbid of the given external id
     */
    getDbIdFromExternalId(externalId: string, bimFileId: string): Promise<number>;
    /**
     * @param {string} externalId
     * @param {Model} model
     * @returns {Promise<number>}
     * @memberof BimObjectService
     */
    getDdIdFromExternalIdFromModel(externalId: string, model: Model): Promise<number>;
    /**
     * @param {string[]} externalIds
     * @param {Model} model
     * @returns {Promise<number[]>}
     * @memberof BimObjectService
     */
    getDdIdsFromExternalIds(externalIds: string[], model: Model): Promise<number[]>;
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
    addBIMObject(contextId: string, parentId: string, dbId: number, name: string, model?: Model): Promise<BimObjectRef>;
    /**
     * Remove a BIMObject from a parent
     * @param {string} parentId
     * @param {string} bimObjectId
     * @returns {Promise<boolean>}
     * @memberof BimObjectService
     */
    removeBIMObject(parentId: string, bimObjectId: string): Promise<boolean>;
    /**
     * Delete a BIMObject from graph
     * @param {number} dbId
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<void>}
     * @memberof BimObjectService
     */
    deleteBImObject(dbId: number, model?: Model): Promise<void>;
    /**
     * Add a reference object to a node
     * @param {string} parentId
     * @param {number} dbId
     * @param {string} name
     * @param {Model} [model=this.currentModel]
     * @returns {Promise<BimObjectRef>}
     * @memberof BimObjectService
     */
    addReferenceObject(parentId: string, dbId: number, name: string, model?: Model): Promise<BimObjectRef>;
    /**
     *
     * @param parentId
     * @param dbid
     * @param model
     */
    removeReferenceObject(parentId: string, dbid: number, model?: Model): Promise<boolean>;
    /**
     * notify the service that a new model has been load into the viewer
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     * @param model {Model} model loaded into the viewer
     * @param scene {any} scene loaded
     * @param name
     */
    addModel(bimFileId: string, model: Model, version: number, scene: SceneNodeRef, name: string): void;
    _addModel(bimFileId: string, model: Model, name: string): void;
    /**
     * Get the model corresponding to the dbid and the bimfile
     * @param dbId {number} dbId of the BIMObject
     * @param bimFileId {string} id of the BIMfile
     */
    getModel(dbId: number, bimFileId: string): Model;
    getModelByBimfile(bimFileId: string): Model;
    /**
     * Get a model corresponding to the name use with caution
     * @param name
     */
    getModelByName(name: string): Model;
}
