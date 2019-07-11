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
    loadBimFile(bimfIle: any, options?: any): Promise<unknown>;
    loadModelFromNode(nodeId: string): Promise<any[]>;
    getModel(bimFileID: string): any;
}
