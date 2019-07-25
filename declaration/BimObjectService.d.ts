/// <reference types="forge-viewer" />
import Model = Autodesk.Viewing.Model;
export declare class BimObjectService {
    mappingModelIdBimFileId: {
        [modelId: number]: {
            bimFileId: string;
            version: number;
            scene: any;
        };
    };
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
    private currentModel;
    setCurrentModel(model: Model): void;
    /**
     * Return the node where to attach BIMObject
     * @param bimFileId {String} id of the BIMFile
     */
    getBimFileContext(bimFileId: string): Promise<any>;
    createBIMFileContext(bimFileId: string): Promise<unknown>;
    /**
     * Return the BIMObject corresponding dbid and the model
     * @param dbId {number}
     * @param model {Model}
     */
    getBIMObject(dbId: number, model?: Model): Promise<unknown>;
    /**
     * create a BIMObject for the corresponding dbid and model
     * @param dbid {number}
     * @param model {Model}
     * @param name {string} name of the bimObject
     * @returns {boolean} true if the BIMObject has been created false otherwise
     */
    createBIMObject(dbid: number, name: string, model?: Model): Promise<unknown>;
    /**
     * Return the external id for the given dbid
     * @param dbId {number}
     * @param model {Model}
     * @returns {string} external id for the given dbid
     */
    static getExternalId(dbId: number, model: Model): Promise<unknown>;
    /**
     * Return the dbid corresponding to the external id
     * @param externalId
     * @param bimFileId {String} id of the BIMFile
     * @returns {number} dbid of the given external id
     */
    getDbIdFromExternalId(externalId: string, bimFileId: string): Promise<unknown>;
    /**
     * Add a BIMObject to a node
     * @param contextId  {string} context id where the BIMObject supposed to be
     * @param parentId {string} id of the node where the BIMObject will be add
     * @param dbId {number}
     * @param model {Model}
     * @param name {string}
     */
    addBIMObject(contextId: string, parentId: string, dbId: number, model: Model, name: string): Promise<any>;
    /**
     * Remove a BIMObject from a parent
     * @param parentId
     * @param bimObjectId
     */
    removeBIMObject(parentId: string, bimObjectId: string): any;
    /**
     * Delete a BIMObject from graph
     * @param dbId {number}
     * @param model {Model}
     */
    deleteBImObject(dbId: number, model?: Model): Promise<unknown>;
    /**
     * Add a reference object to a node
     *
     * @param parentId {string}
     * @param dbId {Number}
     * @param model {Model}
     * @param name {string}
     */
    addReferenceObject(parentId: string, dbId: number, model: Model, name: string): void;
    /**
     *
     * @param parentId
     * @param dbid
     * @param model
     */
    removeReferenceObject(parentId: string, dbid: number, model?: Model): void;
    /**
     * notify the service that a new model has been load into the viewer
     * @param bimFileId {String} id of the BIMFile
     * @param version {number} version of the bimFile
     * @param model {Model} model loaded into the viewer
     * @param scene {any} scene loaded
     */
    addModel(bimFileId: string, model: Model, version: number, scene: any): void;
    /**
     * Get the model corresponding to the dbid and the bimfile
     * @param dbId {number} dbId of the BIMObject
     * @param bimFileId {string} id of the BIMfile
     */
    getModel(dbId: number, bimFileId: string): Model;
}
