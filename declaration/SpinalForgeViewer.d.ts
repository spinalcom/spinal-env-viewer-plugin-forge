/// <reference types="forge-viewer" />
import { BimObjectService } from "./BimObjectService";
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
    initialize(viewerManager: any): Promise<boolean>;
    isInitialize(): boolean;
    waitForInitialization(): Promise<unknown>;
    getScene(modelId: number): {
        sceneId: string;
        modelIds: number[];
    }[];
    getSVF(element: any, nodeId: string, name: string): Promise<{
        version: any;
        path: any;
        id: string;
        name: string;
        thumbnail: any;
    }>;
    loadBimFile(bimfIle: any, scene: any, options?: any): Promise<unknown>;
    loadModelFromNode(nodeId: string): Promise<any[]>;
    /**
     * return the model associated to the bimfile
     * @param bimFileId
     * @param dbId
     */
    getModel(bimObject: any): Autodesk.Viewing.Model;
    loadModelFromBimFile(bimFile: any): Promise<unknown>;
    private addMaterial;
    setModelColorMaterial(model: any, color: THREE.Color, ids: number[]): void;
    setColorMaterial(aggregateSelection: {
        model: any;
        selection: number[];
    }[], color: any): void;
    restoreColorMaterial(aggregateSelection: {
        model: any;
        selection: number[];
    }[]): void;
    restoreModelColorMaterial(model: any, ids: any): void;
}
