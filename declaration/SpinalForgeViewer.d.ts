/// <reference types="forge-viewer" />
import { SpinalNodePointer } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import Model = Autodesk.Viewing.Model;
import { BimFileNodeRef, SceneNodeRef, SceneOptions, BimObjectRef } from './interfaces';
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
    private option;
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
    getSVF(element: SpinalNodePointer<any>, nodeId: string, name: string): Promise<{
        version: any;
        path: string;
        id: string;
        name: string;
        thumbnail: any;
    }>;
    loadBimFile(bimFile: BimFileNodeRef, scene: SceneNodeRef, options?: SceneOptions[]): Promise<{
        bimFileId: string;
        model: Model;
    }>;
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
