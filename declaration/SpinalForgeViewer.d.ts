/// <reference types="forge-viewer" />
import { SpinalNodePointer } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import Model = Autodesk.Viewing.Model;
import { BimFileNodeRef, SceneNodeRef, SceneOptions, SceneOptionsGet, BimObjectRef } from './interfaces/interfaces';
import { IAecData } from "./interfaces/IAecData";
import { ISVFFile } from "./interfaces/ISVFFile";
export declare class SpinalForgeViewer {
    currentSceneId: string;
    initialized: Promise<boolean>;
    scenes: {
        sceneId: string;
        modelIds: number[];
    }[];
    bimObjectService: BimObjectService;
    viewerManager: any;
    private overlayName;
    private globalOffset;
    initialize(viewerManager: any): Promise<boolean>;
    isInitialize(): boolean;
    waitForInitialization(): Promise<unknown>;
    getScene(modelId: number): {
        sceneId: string;
        modelIds: number[];
    }[];
    getSVFListFromBimFile(bimFileId: string): Promise<{
        path: string;
        name: string;
        thumbnail: string;
    }[]>;
    getBimFileDefautPath(bimFileId: string): any;
    setBimFileDefautPath(bimFileId: string, path: any): any;
    getSVF(element: SpinalNodePointer<any>, nodeId: string, name: string): Promise<ISVFFile>;
    getAecModelData(aecPath: string): Promise<IAecData>;
    get1stGlobalOffset(): THREE.Vector3;
    addOffsetFromAEC(aecPath: string): Promise<THREE.Vector3>;
    getOption(options: SceneOptions[], svfVersionFile: ISVFFile): SceneOptionsGet;
    addDbIdToOption(option: SceneOptionsGet): void;
    loadBimFile(bimFile: BimFileNodeRef, scene: SceneNodeRef, options?: SceneOptions[]): Promise<{
        bimFileId: string;
        model: Model;
    }>;
    load1stThenAll<T, K>(tasks: T[], callback: (itm: T) => Promise<K>): Promise<K[]>;
    loadModelFromNode(nodeId: string): Promise<{
        bimFileId: string;
        model: Model;
    }[]>;
    getNormalisePath(path: string): string;
    /**
     * return the model associated to the bimfile
     * @param bimFileId
     * @param dbId
     */
    getModel(bimObject: BimObjectRef): Model;
    loadModelFromBimFile(bimFile: BimFileNodeRef): Promise<{
        model: Model;
    }>;
    private addMaterial;
    setModelColorMaterial(model: Model, color: THREE.Color, ids: number[]): void;
    setColorMaterial(aggregateSelection: {
        model: Model;
        selection: number[];
    }[], color: THREE.Color): void;
    restoreColorMaterial(aggregateSelection: {
        model: Model;
        selection: number[];
    }[]): void;
    restoreModelColorMaterial(model: Model, ids: number[]): void;
}
