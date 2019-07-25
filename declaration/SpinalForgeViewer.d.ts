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
    waitForInitialization(): Promise<{}>;
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
    loadBimFile(bimfIle: any, scene: any, options?: any): Promise<{}>;
    loadModelFromNode(nodeId: string): Promise<any[]>;
    /**
     * return the model associated to the bimfile
     * @param bimFileId
     * @param dbId
     */
    getModel(bimObject: any): any;
}
